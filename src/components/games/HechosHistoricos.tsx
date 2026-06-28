"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { HechosHistoricosConfig } from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GameResult } from "./GameResult";

interface Evento {
  id: number;
  texto: string;
  anio: number;
  detalle?: string;
}

export function HechosHistoricos({ config }: { config: HechosHistoricosConfig }) {
  const eventos = useMemo<Evento[]>(
    () =>
      (config.eventos ?? [])
        .map((e, id) => ({ id, texto: e.texto.trim(), anio: Number(e.anio), detalle: e.detalle }))
        .filter((e) => e.texto),
    [config.eventos],
  );

  // The correct ascending sequence of years (tie-tolerant grading).
  const sortedAnios = useMemo(
    () => eventos.map((e) => e.anio).sort((a, b) => a - b),
    [eventos],
  );

  const [order, setOrder] = useState<Evento[]>(() => shuffle(eventos));
  const [checked, setChecked] = useState(false);

  function move(from: number, dir: -1 | 1) {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    setOrder((o) => {
      const next = [...o];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setChecked(false);
  }

  // Position i is correct if its year matches the sorted sequence at i.
  const correctAt = (i: number) => checked && order[i].anio === sortedAnios[i];
  const won = checked && order.every((_, i) => order[i].anio === sortedAnios[i]);

  if (eventos.length < 2) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos dos eventos para jugar.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="card p-4 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
          {config.titulo || "Ordená cronológicamente"}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Arriba el más antiguo · abajo el más reciente
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {order.map((ev, i) => {
          const ok = correctAt(i);
          const bad = checked && !ok;
          return (
            <div
              key={ev.id}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-tile)] border px-3 py-2.5 transition-colors",
                ok
                  ? "border-transparent bg-[var(--good)]/15"
                  : bad
                    ? "border-[var(--bad)] bg-[var(--bad)]/10"
                    : "border-[var(--border)] bg-[var(--surface)]",
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--bg-2)] text-sm font-bold text-[var(--muted)]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{ev.texto}</p>
                {checked && (
                  <p
                    className={cn(
                      "text-xs font-bold",
                      ok ? "text-[var(--good)]" : "text-[var(--muted)]",
                    )}
                  >
                    {ev.anio}
                    {ev.detalle ? ` · ${ev.detalle}` : ""}
                  </p>
                )}
              </div>
              {!won && (
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="grid h-6 w-7 place-items-center rounded text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-25"
                    aria-label="Subir"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    className="grid h-6 w-7 place-items-center rounded text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-25"
                    aria-label="Bajar"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {won ? (
        <GameResult won title="¡Línea de tiempo correcta!" reveal="Ordenaste todos los eventos." />
      ) : (
        <div className="mt-auto flex flex-col items-center gap-2">
          {checked && (
            <p className="text-sm font-semibold text-[var(--muted)]">
              Todavía no está del todo. Seguí moviendo y volvé a comprobar.
            </p>
          )}
          <Button size="lg" onClick={() => setChecked(true)} className="w-full sm:w-auto">
            Comprobar
          </Button>
        </div>
      )}
    </div>
  );
}
