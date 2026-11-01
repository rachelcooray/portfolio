"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/content/content";
import { ask, excerpt, goToSection, reducedMotion, ASK_OPEN, TOUR_START, startTour } from "@/lib/ask";

/**
 * Ask mode: a command bar opened with "/", Cmd+K or Ctrl+K, or the Ask
 * button. Typing a topic or a question finds the matching section, and
 * Enter scrolls there and highlights it. The short answer is quoted from
 * the page itself, never generated.
 *
 * Also owns the "Walk me through" tour: sections in order, each with a
 * short typed caption.
 */
export default function AskPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const result = useMemo(() => ask(query), [query]);
  const items = result.sections;

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      lastFocus.current = document.activeElement as HTMLElement;
      const q = (e as CustomEvent<{ query?: string }>).detail?.query ?? "";
      setQuery(q);
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, [contenteditable=true]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) close();
        else onOpen(new CustomEvent(ASK_OPEN));
      } else if ((e.key === "/" || (e.code === "Slash" && !e.shiftKey)) && !typing && !open) {
        e.preventDefault();
        onOpen(new CustomEvent(ASK_OPEN));
      }
    };
    window.addEventListener(ASK_OPEN, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(ASK_OPEN, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const choose = (i: number) => {
    const hit = items[i];
    if (!hit) return;
    setOpen(false);
    goToSection(hit.section, hit.passage.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(items.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Tab") {
      // keep focus inside the dialog
      const f = [...(e.currentTarget.querySelectorAll<HTMLElement>("input, button"))];
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const suggestions = ["What does she do at OCTAVE?", "Research", "How does she measure impact?", "Teaching", "Contact"];

  return (
    <>
      <div className={`ask-scrim${open ? " open" : ""}`} hidden={!open} onClick={close} />
      <div
        className={`ask-dialog${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Ask about Rachel"
        hidden={!open}
        onKeyDown={onKeyDown}
      >
        <div className="ask-bar">
          <label htmlFor="ask-input" className="ask-slash" aria-hidden="true">
            /
          </label>
          <input
            id="ask-input"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls="ask-results"
            aria-activedescendant={items[active] ? `ask-opt-${active}` : undefined}
            aria-label="Ask about Rachel, or type a section"
            placeholder="Ask about her work, research, teaching..."
            autoComplete="off"
            spellCheck={false}
            maxLength={160}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
          <button type="button" className="ask-esc" onClick={close}>
            esc
          </button>
        </div>

        {query.trim() === "" ? (
          <div className="ask-body">
            <p className="ask-label">Try</p>
            <ul className="ask-suggest">
              {suggestions.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <p className="ask-label">Sections</p>
            <ul className="ask-suggest">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      goToSection(s.id);
                    }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="ask-body">
            <p className="ask-label" id="ask-results-label">
              Open a section
            </p>
            {items.length > 0 ? (
              <ul id="ask-results" role="listbox" aria-labelledby="ask-results-label" className="ask-results">
                {items.map((h, i) => (
                  <li
                    key={h.section}
                    id={`ask-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className={i === active ? "active" : ""}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                  >
                    <span className="opt-main">
                      <span className="opt-title">
                        {h.label}: {h.passage.title}
                      </span>
                      <span className="opt-sub">{excerpt(h.passage.text, 120)}</span>
                    </span>
                    <span className="opt-key" aria-hidden="true">
                      {i === active ? "enter" : h.number}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ask-empty">
                Nothing on this page matches that. Try research, OCTAVE, teaching or contact.
              </p>
            )}
            {result.answer && (
              <div className="ask-answer" aria-live="polite">
                <p className="ask-label">From this page</p>
                <p>{excerpt(result.answer.text)}</p>
              </div>
            )}
          </div>
        )}

        <div className="ask-foot">
          <span>Answers come only from this page.</span>
          <button
            type="button"
            className="ask-tour"
            onClick={() => {
              setOpen(false);
              startTour();
            }}
          >
            Walk me through
          </button>
        </div>
      </div>
      <Tour />
    </>
  );
}

function Tour() {
  const [step, setStep] = useState<number | null>(null);
  const [chars, setChars] = useState(0);
  const [paused, setPaused] = useState(false);

  // Every step change goes through here, so the caption reset happens in
  // the same update as the step itself.
  const goTo = useCallback((n: number | null) => {
    setChars(0);
    setStep(n === null || n >= sections.length ? null : n);
  }, []);

  useEffect(() => {
    const onStart = () => {
      setPaused(false);
      goTo(0);
    };
    window.addEventListener(TOUR_START, onStart);
    return () => window.removeEventListener(TOUR_START, onStart);
  }, [goTo]);

  const s = step === null ? null : sections[step];
  const caption = s ? `${s.number} ${s.label}. ${s.hint}.` : "";

  useEffect(() => {
    if (!s) return;
    goToSection(s.id);
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      setChars((c) => {
        if (c >= caption.length) window.clearInterval(id);
        return c + 2;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [s, caption]);

  useEffect(() => {
    if (step === null || paused) return;
    const t = window.setTimeout(() => goTo(step + 1), 4800);
    return () => window.clearTimeout(t);
  }, [step, paused, goTo]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goTo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goTo]);

  if (step === null) return null;
  const typed = reducedMotion() ? caption : caption.slice(0, chars);
  return (
    <div className="tour" role="region" aria-label="Guided tour">
      <p className="tour-caption" aria-live="polite">
        <span aria-hidden="true">{typed}</span>
        <span className="sr-only">{caption}</span>
      </p>
      <div className="tour-controls">
        <span className="tour-count">
          {String(step + 1).padStart(2, "0")} / {sections.length}
        </span>
        <button type="button" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={() => goTo(step + 1)}>
          Next
        </button>
        <button type="button" onClick={() => goTo(null)}>
          Stop
        </button>
      </div>
    </div>
  );
}
