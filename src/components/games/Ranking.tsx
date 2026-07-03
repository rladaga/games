"use client";

import { useMemo, useState } from "react";
import type { RankingConfig } from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";
import { GameResult } from "./GameResult";
import { GameImage } from "./GameImage";

interface Item {
  id: number;
  texto: string;
  imagenUrl?: string | null;
}

export function Ranking({ config }: { config: RankingConfig }) {
  const items = useMemo<Item[]>(
    () =>
      (config.items ?? [])
        .map((it, id) => ({ id, texto: it.texto.trim(), imagenUrl: it.imagenUrl }))
        .filter((it) => it.texto),
    [config.items],
  );

  const queue = useMemo(
    () => (config.aleatorio ? shuffle(items) : items),
    [items, config.aleatorio],
  );

  const slots = items.length;
  // slot (1..N) -> item id placed there
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const placedCount = Object.keys(placed).length;
  const current = queue[placedCount];
  const done = placedCount >= slots && slots > 0;

  function place(slot: number) {
    if (!current || placed[slot] !== undefined) return;
    setPlaced((p) => ({ ...p, [slot]: current.id }));
  }

  const itemById = (id: number) => items.find((it) => it.id === id);

  if (slots < 2) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos dos elementos para armar el ranking.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {config.titulo ? (
        <div className="card p-4 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--heading)] sm:text-xl">
            {config.titulo}
          </h1>
        </div>
      ) : null}

      {/* Elemento actual */}
      {!done && current && (
        <div className="card flex items-center gap-3 border-2 border-[var(--brand)] p-3 animate-pop">
          <GameImage
            src={current.imagenUrl}
            alt={current.texto}
            className="h-14 w-14 shrink-0 rounded-[var(--radius-tile)] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              Ubicá este
            </p>
            <p className="truncate font-[family-name:var(--font-display)] text-lg font-bold">
              {current.texto}
            </p>
          </div>
          <span className="shrink-0 text-sm text-[var(--muted)]">
            {placedCount + 1}/{slots}
          </span>
        </div>
      )}

      {/* Ranking */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: slots }).map((_, i) => {
          const slot = i + 1;
          const itemId = placed[slot];
          const item = itemId !== undefined ? itemById(itemId) : undefined;
          const empty = item === undefined;
          return (
            <button
              key={slot}
              type="button"
              disabled={!empty || done}
              onClick={() => place(slot)}
              className={cn(
                "flex min-h-13 items-center gap-3 rounded-[var(--radius-tile)] border px-3 py-2 text-left transition-all",
                empty
                  ? "border-dashed border-[var(--border)] bg-transparent hover:border-[var(--brand)] hover:bg-[var(--brand)]/5"
                  : "border-transparent bg-[var(--surface)]",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full font-[family-name:var(--font-display)] text-base font-extrabold",
                  empty
                    ? "bg-[var(--bg-2)] text-[var(--muted)]"
                    : "bg-[var(--rank)] text-[var(--brand-ink)]",
                )}
              >
                {slot}
              </span>
              <GameImage
                src={item?.imagenUrl}
                alt={item?.texto ?? ""}
                className="h-9 w-9 shrink-0 rounded object-cover"
              />
              <span
                className={cn(
                  "flex-1 truncate font-semibold",
                  empty ? "text-[var(--muted)]" : "text-[var(--caption)]",
                )}
              >
                {empty ? "Tocá para ubicar acá" : item?.texto}
              </span>
            </button>
          );
        })}
      </div>

      {done && (
        <GameResult
          won
          title="¡Ranking completo!"
          reveal="Armaste tu top sin arrepentirte."
        />
      )}
    </div>
  );
}
