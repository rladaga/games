"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PalabraClaveConfig } from "@/lib/types";
import { normalize, cn } from "@/lib/utils";
import { isWord, useDictionaryReady } from "@/lib/dictionary";
import { Keyboard, type KeyState } from "./Keyboard";
import { GameResult } from "./GameResult";

type Tile = { letter: string; state: KeyState };

function evaluate(guess: string, solution: string): KeyState[] {
  const res: KeyState[] = Array(guess.length).fill("absent");
  const pool: Record<string, number> = {};
  for (const ch of solution) pool[ch] = (pool[ch] ?? 0) + 1;

  // First pass: exact matches.
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      res[i] = "correct";
      pool[guess[i]]--;
    }
  }
  // Second pass: present elsewhere.
  for (let i = 0; i < guess.length; i++) {
    if (res[i] === "correct") continue;
    if (pool[guess[i]] > 0) {
      res[i] = "present";
      pool[guess[i]]--;
    }
  }
  return res;
}

export function PalabraClave({ config }: { config: PalabraClaveConfig }) {
  const solution = useMemo(() => normalize(config.solucion), [config.solucion]);
  const len = solution.length;
  const maxRows = config.intentosMax || 6;

  const dictReady = useDictionaryReady();
  // Words always accepted as guesses regardless of the dictionary:
  // the configured solution plus any extra words set in the admin.
  const extraWords = useMemo(
    () =>
      new Set([
        solution,
        ...(config.palabrasExtra ?? []).map((w) => normalize(w)),
      ]),
    [solution, config.palabrasExtra],
  );
  const [rows, setRows] = useState<Tile[][]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState("");

  const keyStates = useMemo(() => {
    const map: Record<string, KeyState> = {};
    const rank: Record<KeyState, number> = {
      idle: 0,
      disabled: 0,
      absent: 1,
      present: 2,
      correct: 3,
    };
    for (const row of rows) {
      for (const t of row) {
        if ((rank[t.state] ?? 0) >= (rank[map[t.letter]] ?? 0)) {
          map[t.letter] = t.state;
        }
      }
    }
    return map;
  }, [rows]);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setTimeout(() => setToast(""), 1400);
  }, []);

  const submit = useCallback(() => {
    if (current.length !== len) {
      flashToast(`La palabra tiene ${len} letras`);
      return;
    }
    // Always allow the configured solution; only enforce the dictionary once
    // the full list has loaded, so valid words are never wrongly rejected.
    if (
      config.validarDiccionario &&
      dictReady &&
      !extraWords.has(current) &&
      !isWord(current)
    ) {
      flashToast("No está en el diccionario");
      return;
    }
    const states = evaluate(current, solution);
    const tiles: Tile[] = current
      .split("")
      .map((letter, i) => ({ letter, state: states[i] }));
    const nextRows = [...rows, tiles];
    setRows(nextRows);
    setCurrent("");

    if (current === solution) setStatus("won");
    else if (nextRows.length >= maxRows) setStatus("lost");
  }, [current, len, config.validarDiccionario, dictReady, extraWords, solution, rows, maxRows, flashToast]);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing") return;
      if (key === "enter") submit();
      else if (key === "back") setCurrent((c) => c.slice(0, -1));
      else if (/^[a-z]$/.test(key))
        setCurrent((c) => (c.length < len ? c + key : c));
    },
    [status, submit, len],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore typing while a form field is focused (e.g. the admin preview).
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "Enter") onKey("enter");
      else if (e.key === "Backspace") onKey("back");
      else {
        const k = normalize(e.key);
        if (k.length === 1 && /[a-z]/.test(k)) onKey(k);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const grid: Tile[][] = [];
  for (let r = 0; r < maxRows; r++) {
    if (rows[r]) grid.push(rows[r]);
    else if (r === rows.length) {
      grid.push(
        Array.from({ length: len }, (_, i) => ({
          letter: current[i] ?? "",
          state: "idle" as KeyState,
        })),
      );
    } else {
      grid.push(
        Array.from({ length: len }, () => ({ letter: "", state: "idle" as KeyState })),
      );
    }
  }

  const tileColor: Record<KeyState, string> = {
    correct: "bg-[var(--good)] text-white border-transparent",
    present: "bg-[var(--warn)] text-black border-transparent",
    absent: "bg-[var(--bad)] text-white/80 border-transparent",
    idle: "text-[var(--text)] border-[var(--border)]",
    disabled: "text-[var(--text)] border-[var(--border)]",
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-2">
        {toast && (
          <div className="absolute -top-2 z-10 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg)] animate-rise">
            {toast}
          </div>
        )}
        <div
          className="flex w-full flex-col gap-1.5"
          style={{ maxWidth: `min(92vw, ${len * 3.9}rem)` }}
        >
          {grid.map((row, r) => (
            <div
              key={r}
              className={cn("grid gap-1.5", shake && r === rows.length && "animate-shake")}
              style={{ gridTemplateColumns: `repeat(${len}, minmax(0, 1fr))` }}
            >
              {row.map((t, c) => (
                <div
                  key={c}
                  className={cn(
                    "grid aspect-square place-items-center rounded-[var(--radius-tile)] border-2 font-[family-name:var(--font-display)] font-bold uppercase transition-colors",
                    "text-[clamp(1rem,7vw,1.6rem)]",
                    t.letter && t.state === "idle" && "border-[var(--muted)]/50 animate-pop",
                    tileColor[t.state],
                  )}
                >
                  {t.letter}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {status === "playing" ? (
        <Keyboard states={keyStates} onKey={onKey} />
      ) : (
        <GameResult
          won={status === "won"}
          title={status === "won" ? "¡Lo lograste!" : "Se acabaron los intentos"}
          reveal={
            <>
              La palabra era{" "}
              <strong className="uppercase text-[var(--brand)]">
                {solution}
              </strong>
            </>
          }
        />
      )}
    </div>
  );
}
