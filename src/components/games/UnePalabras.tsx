"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { UnePalabrasConfig } from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";
import { GameResult } from "./GameResult";

/** A pair the player must connect, identified by its original index. */
interface Pair {
  id: number;
  izquierda: string;
  derecha: string;
}

export function UnePalabras({ config }: { config: UnePalabrasConfig }) {
  const pairs = useMemo<Pair[]>(
    () =>
      (config.pares ?? [])
        .map((p, id) => ({ id, izquierda: p.izquierda.trim(), derecha: p.derecha.trim() }))
        .filter((p) => p.izquierda && p.derecha),
    [config.pares],
  );

  // Right column is shuffled once per mount (the shell remounts to restart).
  const rightOrder = useMemo(() => shuffle(pairs), [pairs]);

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [selRight, setSelRight] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);

  const won = pairs.length > 0 && matched.size === pairs.length;

  function tryMatch(left: number, right: number) {
    if (left === right) {
      setMatched((m) => new Set(m).add(left));
      setSelLeft(null);
      setSelRight(null);
    } else {
      setErrors((e) => e + 1);
      setWrong({ left, right });
      setTimeout(() => {
        setWrong(null);
        setSelLeft(null);
        setSelRight(null);
      }, 450);
    }
  }

  function pickLeft(id: number) {
    if (matched.has(id) || wrong) return;
    setSelLeft(id);
    if (selRight !== null) tryMatch(id, selRight);
  }

  function pickRight(id: number) {
    if (matched.has(id) || wrong) return;
    setSelRight(id);
    if (selLeft !== null) tryMatch(selLeft, id);
  }

  if (pairs.length < 1) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos un par para jugar.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      {config.titulo ? (
        <div className="card p-4 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
            {config.titulo}
          </h1>
        </div>
      ) : null}

      <div className="grid flex-1 grid-cols-2 gap-3">
        <Column
          items={pairs}
          side="left"
          matched={matched}
          selected={selLeft}
          wrong={wrong?.left ?? null}
          onPick={pickLeft}
        />
        <Column
          items={rightOrder}
          side="right"
          matched={matched}
          selected={selRight}
          wrong={wrong?.right ?? null}
          onPick={pickRight}
        />
      </div>

      <p className="text-center text-sm text-[var(--muted)]">
        {matched.size}/{pairs.length} unidos · {errors} error{errors === 1 ? "" : "es"}
      </p>

      {won && (
        <GameResult
          won
          title="¡Uniste todos los pares!"
          reveal={`Lo lograste con ${errors} error${errors === 1 ? "" : "es"}.`}
        />
      )}
    </div>
  );
}

function Column({
  items,
  side,
  matched,
  selected,
  wrong,
  onPick,
}: {
  items: Pair[];
  side: "left" | "right";
  matched: Set<number>;
  selected: number | null;
  wrong: number | null;
  onPick: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((p) => {
        const isMatched = matched.has(p.id);
        const isSel = selected === p.id;
        const isWrong = wrong === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={isMatched}
            onClick={() => onPick(p.id)}
            className={cn(
              "flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-tile)] border px-3 py-2 text-center text-sm font-semibold transition-all",
              isMatched
                ? "border-transparent bg-[var(--good)]/15 text-[var(--good)]"
                : isSel
                  ? "border-[var(--brand)] bg-[var(--brand)]/12 text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--brand)]/60",
              isWrong && "animate-shake border-[var(--bad)]",
            )}
          >
            {isMatched && <Check size={15} className="shrink-0" />}
            <span>{side === "left" ? p.izquierda : p.derecha}</span>
          </button>
        );
      })}
    </div>
  );
}
