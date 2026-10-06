// Generates, for each line in the live tour script (src/tour/buildScript.ts,
// derived from src/content/content.ts):
//   /public/audio/{id}.mp3  - the spoken audio
//   /public/audio/{id}.json - { words: [{ word, start, end }, ...] }
//
// Default backend: the macOS `say` command (voice "Jamie (Premium)") + a
// local Whisper model for word-level timing. No API key, no network call,
// no cost. ElevenLabs is kept as an optional backend (VOICE_BACKEND=elevenlabs
// in .env) for when a more expressive voice is worth paying for.
//
// `spokenText`, if present on a line, is what's actually spoken (for fixing
// mispronounced words like "Cooray" or "IEEE") - subtitles always show
// `text`, never `spokenText`.
//
// Only lines whose text/spokenText changed since the last run are
// regenerated (tracked in public/audio/.manifest.json).
//
// Usage: npm run voice

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { buildScript, type ScriptLine } from "../src/tour/buildScript";

const run = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(envPath: string): Record<string, string> {
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, "utf8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvFile(path.join(ROOT, ".env"));
const BACKEND = env.VOICE_BACKEND === "elevenlabs" ? "elevenlabs" : "system";

const SAY_VOICE = env.SAY_VOICE || "Jamie (Premium)";
const WHISPER_MODEL = env.WHISPER_MODEL || "base.en";

const AUDIO_DIR = path.join(ROOT, "public/audio");
const MANIFEST_PATH = path.join(AUDIO_DIR, ".manifest.json");

function hashLine(line: ScriptLine): string {
  return createHash("sha1")
    .update(
      JSON.stringify({
        text: line.text,
        spokenText: line.spokenText ?? null,
        backend: BACKEND,
        voice: BACKEND === "system" ? SAY_VOICE : env.ELEVENLABS_VOICE_ID,
      }),
    )
    .digest("hex");
}

async function loadManifest(): Promise<Record<string, string>> {
  if (!existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
}

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

// Distributes a known total duration across words proportionally by
// character length. Used as a fallback when Whisper's transcribed word
// count doesn't match the subtitle text's word count (e.g. "Cooray" was
// spoken as "Coo-ray" via spokenText, so Whisper hears two words where
// the subtitle has one) - still anchored to the real spoken duration,
// just not per-word-exact.
function distributeProportionally(words: string[], totalStart: number, totalEnd: number): WordTiming[] {
  const totalChars = words.reduce((sum, w) => sum + w.length, 0) || 1;
  const totalDuration = totalEnd - totalStart;
  let t = totalStart;
  return words.map((word) => {
    const duration = (word.length / totalChars) * totalDuration;
    const entry = { word, start: +t.toFixed(3), end: +(t + duration).toFixed(3) };
    t += duration;
    return entry;
  });
}

function wordsFromWhisper(text: string, whisperWords: WordTiming[]): WordTiming[] {
  const textWords = text.split(/\s+/).filter(Boolean);
  if (whisperWords.length === textWords.length) {
    return textWords.map((word, i) => ({
      word,
      start: +whisperWords[i].start.toFixed(3),
      end: +whisperWords[i].end.toFixed(3),
    }));
  }
  // Word count mismatch (likely spokenText respelling) - fall back to
  // proportional timing across the real spoken envelope.
  const start = whisperWords[0]?.start ?? 0;
  const end = whisperWords[whisperWords.length - 1]?.end ?? start + textWords.join(" ").length / 15;
  return distributeProportionally(textWords, start, end);
}

// `say` runs sentences straight into each other with no real gap. Insert
// an explicit silence after each sentence-ending full stop (macOS `say`'s
// embedded-command syntax) so multi-sentence lines like "intro" breathe.
function addSentencePauses(text: string): string {
  return text.replace(/\. (?=[A-Z])/g, ". [[slnc 1500]] ");
}

async function generateLineSystem(line: ScriptLine, tmpDir: string): Promise<void> {
  const { id, text, spokenText } = line;
  const speakText = addSentencePauses(spokenText ?? text);

  const aiffPath = path.join(tmpDir, `${id}.aiff`);
  const wavPath = path.join(tmpDir, `${id}.wav`);
  const mp3Path = path.join(AUDIO_DIR, `${id}.mp3`);
  const jsonPath = path.join(AUDIO_DIR, `${id}.json`);

  await run("say", ["-v", SAY_VOICE, "-o", aiffPath, speakText]);
  await run("ffmpeg", ["-y", "-i", aiffPath, "-codec:a", "libmp3lame", "-qscale:a", "2", mp3Path]);
  await run("ffmpeg", ["-y", "-i", aiffPath, "-ar", "16000", "-ac", "1", wavPath]);

  await run("whisper", [
    wavPath,
    "--model",
    WHISPER_MODEL,
    "--language",
    "en",
    "--word_timestamps",
    "True",
    "--output_format",
    "json",
    "--output_dir",
    tmpDir,
    "--fp16",
    "False",
  ]);

  const whisperJsonPath = path.join(tmpDir, `${id}.json`);
  const whisperResult = JSON.parse(await readFile(whisperJsonPath, "utf8"));
  const whisperWords: WordTiming[] = whisperResult.segments
    .flatMap((seg: { words?: { word: string; start: number; end: number }[] }) => seg.words ?? [])
    .map((w: { word: string; start: number; end: number }) => ({
      word: w.word.trim(),
      start: w.start,
      end: w.end,
    }));

  const words = wordsFromWhisper(text, whisperWords);
  await writeFile(jsonPath, JSON.stringify({ words }, null, 2));
  console.log(`[${id}] (system/${SAY_VOICE}+Whisper) wrote ${id}.mp3 and ${id}.json (${words.length} words)`);
}

async function main() {
  await mkdir(AUDIO_DIR, { recursive: true });
  const script = buildScript();
  const manifest = await loadManifest();
  const newManifest = { ...manifest };

  const tmpDir = path.join(os.tmpdir(), `voice-gen-${Date.now()}`);
  await mkdir(tmpDir, { recursive: true });

  console.log(`Backend: ${BACKEND}${BACKEND === "system" ? ` (say -v ${SAY_VOICE}, whisper ${WHISPER_MODEL})` : ""}\n`);

  for (const line of script) {
    const hash = hashLine(line);
    const mp3Exists = existsSync(path.join(AUDIO_DIR, `${line.id}.mp3`));
    const jsonExists = existsSync(path.join(AUDIO_DIR, `${line.id}.json`));
    if (manifest[line.id] === hash && mp3Exists && jsonExists) {
      console.log(`[${line.id}] unchanged, skipping`);
      continue;
    }

    if (BACKEND === "elevenlabs") {
      throw new Error("ElevenLabs backend not ported yet in this project — use system (default).");
    }
    await generateLineSystem(line, tmpDir);
    newManifest[line.id] = hash;
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(newManifest, null, 2));
  await rm(tmpDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
