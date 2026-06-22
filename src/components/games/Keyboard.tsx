"use client";

import { Delete, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type KeyState = "correct" | "present" | "absent" | "disabled" | "idle";

const ROWS = [
  "q w e r t y u i o p".split(" "),
  "a s d f g h j k l".split(" "),
  ["enter", ..."z x c v b n m".split(" "), "back"],
];

const STATE_CLASS: Record<KeyState, string> = {
  correct: "bg-[var(--good)] text-white border-transparent",
  present: "bg-[var(--warn)] text-black border-transparent",
  absent: "bg-[var(--bad)] text-white/80 border-transparent",
  disabled: "bg-transparent text-[var(--muted)]/30 border-[var(--border)]",
  idle: "bg-[var(--surface)] text-[var(--text)] border-[var(--border)]",
};

export function Keyboard({
  states = {},
  onKey,
  disabledKeys,
}: {
  states?: Record<string, KeyState>;
  onKey: (key: string) => void;
  /** Letters to dim (e.g. cannot start the word) when no state is set. */
  disabledKeys?: Set<string>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-1.5 select-none">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isAction = key === "enter" || key === "back";
            const state =
              states[key] ??
              (disabledKeys?.has(key) ? "disabled" : "idle");
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg border text-sm font-semibold uppercase transition-all active:scale-90 sm:h-14",
                  isAction ? "px-3 text-xs" : "flex-1 min-w-0",
                  STATE_CLASS[state],
                )}
                aria-label={key}
              >
                {key === "back" ? (
                  <Delete size={18} />
                ) : key === "enter" ? (
                  <CornerDownLeft size={18} />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
