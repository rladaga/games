"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Lightbulb } from "lucide-react";
import type { PalabraSecretaConfig } from "@/lib/types";
import { normalize, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GameResult } from "./GameResult";

interface Guess {
  text: string;
  wordsBetween: number;
  direction: "before" | "after" | "equal";
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

// Blend between the "cold" (far) and "hot" (near) theme colors by closeness.
function heatColor(c: number): string {
  return `color-mix(in oklab, var(--hot) ${Math.round(c * 100)}%, var(--cold))`;
}

export function PalabraSecreta({ config, preview }: { config: PalabraSecretaConfig; preview?: boolean }) {
  const answer = useMemo(() => normalize(config.respuesta), [config.respuesta]);

  // Curated theme words: the only valid guesses, and the universe in which the
  // "words between" distance is measured. The answer is always included.
  const themeWords = useMemo(() => {
    const set = new Set((config.palabras ?? []).map(normalize).filter(Boolean));
    if (answer) set.add(answer);
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [config.palabras, answer]);
  const themeSet = useMemo(() => new Set(themeWords), [themeWords]);
  const answerIdx = useMemo(() => themeWords.indexOf(answer), [themeWords, answer]);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState("");
  const [won, setWon] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState("");

  // Letters that cannot start the answer, inferred from guesses.
  const impossibleInitials = useMemo(() => {
    let lower = ""; // largest guess known to be < answer
    let upper = ""; // smallest guess known to be > answer
    for (const g of guesses) {
      if (g.direction === "after") {
        if (!lower || g.text.localeCompare(lower, "es") > 0) lower = g.text;
      } else if (g.direction === "before") {
        if (!upper || g.text.localeCompare(upper, "es") < 0) upper = g.text;
      }
    }
    const set = new Set<string>();
    if (lower) for (const l of ALPHABET) if (l < lower[0]) set.add(l);
    if (upper) for (const l of ALPHABET) if (l > upper[0]) set.add(l);
    return set;
  }, [guesses]);

  const revealed = useMemo(() => {
    const letters = config.pistas?.length
      ? config.pistas.join("")
      : answer.replace(/\s/g, "");
    return normalize(letters).slice(0, hintCount);
  }, [config.pistas, answer, hintCount]);

  function flashToast(msg: string) {
    setToast(msg);
    setShake(true);
    setTimeout(() => setShake(false), 350);
    setTimeout(() => setToast(""), 1600);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = normalize(input);
    if (!text) return;

    if (!themeSet.has(text)) {
      flashToast("Esa palabra no es del tema");
      return;
    }
    if (guesses.some((g) => g.text === text)) {
      setInput("");
      return;
    }

    if (text === answer) {
      setGuesses((g) =>
        [...g, { text, wordsBetween: 0, direction: "equal" as const }].sort(
          (a, b) => a.text.localeCompare(b.text, "es"),
        ),
      );
      setWon(true);
      setInput("");
      return;
    }

    const gi = themeWords.indexOf(text);
    const wordsBetween = Math.max(0, Math.abs(gi - answerIdx) - 1);
    const direction: Guess["direction"] = gi < answerIdx ? "after" : "before";
    setGuesses((g) =>
      [...g, { text, wordsBetween, direction }].sort((a, b) =>
        a.text.localeCompare(b.text, "es"),
      ),
    );
    setInput("");
  }

  // Closeness relative to the size of the theme list.
  const closeness = (wordsBetween: number) =>
    Math.max(0, 1 - wordsBetween / Math.max(themeWords.length - 1, 1));

  const maxHints =
    (config.pistas?.length ?? answer.replace(/\s/g, "").length) || 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="card p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Tema
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--heading)]">
          {config.tema}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {themeWords.length} palabras posibles
        </p>
        {revealed && (
          <p className="mt-2 font-mono text-lg tracking-[0.3em] text-[var(--brand)]">
            {revealed}
            <span className="text-[var(--muted)]/40">
              {"·".repeat(
                Math.max(0, answer.replace(/\s/g, "").length - revealed.length),
              )}
            </span>
          </p>
        )}
      </div>

      {/* Iniciales posibles */}
      <div className="flex flex-wrap justify-center gap-1">
        {ALPHABET.map((l) => (
          <span
            key={l}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-md text-xs font-bold uppercase transition-colors",
              impossibleInitials.has(l)
                ? "text-[var(--muted)]/20"
                : "bg-[var(--surface)] text-[var(--text)]",
            )}
          >
            {l}
          </span>
        ))}
      </div>

      {/* Intentos en orden alfabético */}
      <div className="relative flex flex-col gap-1.5">
        {toast && (
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg)] animate-rise">
            {toast}
          </div>
        )}
        {guesses.length === 0 && (
          <p className="py-6 text-center text-sm text-[var(--muted)]">
            Escribí una palabra del tema para empezar.
          </p>
        )}
        {guesses.map((g) => {
          const c = closeness(g.wordsBetween);
          const isWin = g.direction === "equal";
          return (
            <div
              key={g.text}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-tile)] border px-4 py-2.5 animate-rise",
                isWin
                  ? "border-[var(--good)] bg-[var(--good)]/15"
                  : "border-[var(--border)] bg-[var(--surface)]",
              )}
            >
              <span className="flex-1 truncate font-[family-name:var(--font-display)] font-semibold">
                {g.text}
              </span>
              {!isWin && (
                <>
                  <span className="text-sm font-bold tabular-nums text-[var(--muted)]">
                    {g.wordsBetween}
                  </span>
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-white"
                    style={{ background: heatColor(c) }}
                  >
                    {g.direction === "after" ? (
                      <ArrowDown size={16} />
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </span>
                </>
              )}
              {isWin && (
                <span className="text-sm font-bold text-[var(--good)]">✓</span>
              )}
            </div>
          );
        })}
      </div>

      {!won ? (
        <div className="mt-auto flex flex-col gap-2">
          <form
            onSubmit={submit}
            className={cn("flex gap-2", shake && "animate-shake")}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tu palabra…"
              autoFocus={!preview}
              className="h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-[var(--text)] outline-none focus:border-[var(--brand)]"
            />
            <Button type="submit" size="lg">
              Probar
            </Button>
          </form>
          <button
            onClick={() => setHintCount((h) => Math.min(h + 1, maxHints))}
            disabled={hintCount >= maxHints}
            className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] disabled:opacity-40"
          >
            <Lightbulb size={16} />
            Pista ({hintCount}/{maxHints})
          </button>
        </div>
      ) : (
        <GameResult
          won
          title="¡Palabra secreta descubierta!"
          reveal={
            <>
              Era{" "}
              <strong className="uppercase text-[var(--brand)]">{answer}</strong>{" "}
              en {guesses.length} intento{guesses.length === 1 ? "" : "s"}.
            </>
          }
        />
      )}
    </div>
  );
}
