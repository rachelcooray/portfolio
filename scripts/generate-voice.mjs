// Reads /src/tour/script.json and generates, for each line:
//   /public/audio/{id}.mp3  - the spoken audio
//   /public/audio/{id}.json - { words: [{ word, start, end }, ...] }
//
// Default backend: the macOS `say` command (voice "Daniel") + a local
// Whisper model for word-level timing. No API key, no network call, no
// cost. ElevenLabs is kept as an optional backend (VOICE_BACKEND=elevenlabs
// in .env) for when a more expressive voice is worth paying for.
//
// `spokenText`, if present on a line, is what's actually spoken (for
// fixing mispronounced words like "Cooray" or "IEEE") - subtitles always
// show `text`, never `spokenText`.
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

const run = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, "utf8").split("\n");
  const env = {};
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

const SAY_VOICE = env.SAY_VOICE || "Jamie (Enhanced)";
const WHISPER_MODEL = env.WHISPER_MODEL || "base.en";

const SCRIPT_PATH = path.join(ROOT, "src/tour/script.json");
const AUDIO_DIR = path.join(ROOT, "public/audio");
const MANIFEST_PATH = path.join(AUDIO_DIR, ".manifest.json");

function hashLine(line) {
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

async function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
}

// Distributes a known total duration across words proportionally by
// character length. Used as a fallback when Whisper's transcribed word
// count doesn't match the subtitle text's word count (e.g. "Cooray" was
// spoken as "Coo-ray" via spokenText, so Whisper hears two words where
// the subtitle has one) - still anchored to the real spoken duration,
// just not per-word-exact.
function distributeProportionally(words, totalStart, totalEnd) {
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

function wordsFromWhisper(text, whisperWords) {
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
function addSentencePauses(text) {
  return text.replace(/\. (?=[A-Z])/g, ". [[slnc 1500]] ");
}

async function generateLineSystem(line, tmpDir) {
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
  const whisperWords = whisperResult.segments.flatMap((seg) => seg.words ?? []).map((w) => ({
    word: w.word.trim(),
    start: w.start,
    end: w.end,
  }));

  const words = wordsFromWhisper(text, whisperWords);
  await writeFile(jsonPath, JSON.stringify({ words }, null, 2));
  console.log(`[${id}] (system/${SAY_VOICE}+Whisper) wrote ${id}.mp3 and ${id}.json (${words.length} words)`);
}

function alignmentToWords(alignment) {
  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment;
  const words = [];
  let current = null;
  for (let i = 0; i < characters.length; i++) {
    const ch = characters[i];
    if (/\s/.test(ch)) {
      if (current) {
        words.push(current);
        current = null;
      }
      continue;
    }
    if (!current) {
      current = { word: "", start: character_start_times_seconds[i], end: character_end_times_seconds[i] };
    }
    current.word += ch;
    current.end = character_end_times_seconds[i];
  }
  if (current) words.push(current);
  return words;
}

async function generateLineElevenLabs(line) {
  const { id, text, spokenText } = line;
  const API_KEY = env.ELEVENLABS_API_KEY;
  const VOICE_ID = env.ELEVENLABS_VOICE_ID;
  if (!API_KEY || !VOICE_ID) {
    throw new Error(`[${id}] VOICE_BACKEND=elevenlabs but ELEVENLABS_API_KEY/ELEVENLABS_VOICE_ID missing in .env`);
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: spokenText ?? text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`[${id}] ElevenLabs API error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  await writeFile(path.join(AUDIO_DIR, `${id}.mp3`), Buffer.from(data.audio_base64, "base64"));
  const words = wordsFromWhisper(text, alignmentToWords(data.alignment));
  await writeFile(path.join(AUDIO_DIR, `${id}.json`), JSON.stringify({ words }, null, 2));
  console.log(`[${id}] (elevenlabs) wrote ${id}.mp3 and ${id}.json (${words.length} words)`);
}

async function main() {
  await mkdir(AUDIO_DIR, { recursive: true });
  const script = JSON.parse(await readFile(SCRIPT_PATH, "utf8"));
  const manifest = await loadManifest();
  const newManifest = { ...manifest };

  const tmpDir = await (async () => {
    const dir = path.join(os.tmpdir(), `voice-gen-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    return dir;
  })();

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
      await generateLineElevenLabs(line);
    } else {
      await generateLineSystem(line, tmpDir);
    }
    newManifest[line.id] = hash;
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(newManifest, null, 2));
  await rm(tmpDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
