"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { ConsensusConfig } from "@/lib/types";
import { normalize, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GameResult } from "./GameResult";

interface Row {
  answer: ConsensusConfig["respuestas"][number];
  found: boolean;
  revealed: number; // letters auto-revealed on errors
}

export function Consensus({ config, preview }: { config: ConsensusConfig; preview?: boolean }) {
  const sorted = useMemo(
    () => [...config.respuestas].sort((a, b) => b.popularidad - a.popularidad),
    [config.respuestas],
  );
  const maxErr = config.maxErrores || 4;

  const [rows, setRows] = useState<Row[]>(() =>
    sorted.map((answer) => ({ answer, found: false, revealed: 0 })),
  );
  const [errors, setErrors] = useState(0);
  const [guess, setGuess] = useState("");
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);

  const allFound = rows.every((r) => r.found);
  const status: "playing" | "won" | "lost" = allFound
    ? "won"
    : errors >= maxErr
      ? "lost"
      : "playing";

  function matches(input: string, row: Row): boolean {
    const n = normalize(input);
    if (!n) return false;
    const candidates = [row.answer.texto, ...(row.answer.alias ?? [])];
    return candidates.some((c) => normalize(c) === n);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "playing" || !guess.trim()) return;

    const idx = rows.findIndex((r) => !r.found && matches(guess, r));
    if (idx >= 0) {
      setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, found: true } : r)));
      setFlash("hit");
    } else {
      const nextErr = errors + 1;
      setErrors(nextErr);
      // Reveal one more letter of the most popular not-yet-found answer.
      setRows((rs) => {
        const target = rs
          .map((r, i) => ({ r, i }))
          .filter(({ r }) => !r.found && r.revealed < r.answer.texto.length)
          .sort((a, b) => a.r.revealed - b.r.revealed || a.i - b.i)[0];
        if (!target) return rs;
        return rs.map((r, i) =>
          i === target.i ? { ...r, revealed: r.revealed + 1 } : r,
        );
      });
      setFlash("miss");
    }
    setGuess("");
    setTimeout(() => setFlash(null), 500);
  }

  const reveal = status === "lost";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="card p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Consensus
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-[var(--heading)] sm:text-2xl">
          {config.pregunta}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <AnswerRow key={i} rank={i + 1} row={row} reveal={reveal} flash={flash} />
        ))}
      </div>

      {/* Errores */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxErr }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full border transition-colors",
              i < errors
                ? "border-transparent bg-[var(--bad)] text-white"
                : "border-[var(--border)] text-[var(--border)]",
            )}
          >
            <X size={15} />
          </span>
        ))}
      </div>

      {status === "playing" ? (
        <form onSubmit={submit} className="mt-auto flex gap-2">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Escribí tu respuesta…"
            autoFocus={!preview}
            className={cn(
              "h-12 flex-1 rounded-full border bg-[var(--surface)] px-5 text-[var(--text)] outline-none transition-colors",
              "border-[var(--border)] focus:border-[var(--brand)]",
              flash === "miss" && "animate-shake border-[var(--bad)]",
            )}
          />
          <Button type="submit" size="lg">
            Responder
          </Button>
        </form>
      ) : (
        <GameResult
          won={status === "won"}
          title={
            status === "won"
              ? "¡Encontraste el consenso!"
              : "Se acabaron los intentos"
          }
          reveal={
            status === "won"
              ? "Acertaste todas las respuestas populares."
              : "Mirá arriba las respuestas que faltaban."
          }
        />
      )}
    </div>
  );
}

function AnswerRow({
  rank,
  row,
  reveal,
  flash,
}: {
  rank: number;
  row: Row;
  reveal: boolean;
  flash: "hit" | "miss" | null;
}) {
  const open = row.found || reveal;

  // Masked display: revealed letters shown, the rest as dots.
  const masked = row.answer.texto
    .split("")
    .map((ch, i) => (ch === " " ? " " : i < row.revealed ? ch : "·"))
    .join("");

  return (
    <div
      className={cn(
        "flex items-center gap-3 overflow-hidden rounded-[var(--radius-tile)] border px-4 transition-all",
        "h-13",
        open
          ? "border-transparent bg-[var(--brand)]/12"
          : "border-[var(--border)] bg-[var(--surface)]",
        row.found && flash === "hit" && "animate-pop",
      )}
      style={{ height: "3.25rem" }}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold",
          open ? "bg-[var(--brand)] text-[var(--brand-ink)]" : "bg-[var(--bg-2)] text-[var(--muted)]",
        )}
      >
        {rank}
      </span>
      <span
        className={cn(
          "flex-1 truncate font-[family-name:var(--font-display)] font-semibold tracking-wide",
          open ? "uppercase" : "lowercase text-[var(--muted)]",
        )}
      >
        {open ? row.answer.texto : masked}
      </span>
      {open && (
        <span className="shrink-0 rounded-full bg-[var(--popularity)]/20 px-2.5 py-0.5 text-sm font-bold text-[var(--popularity)]">
          {row.answer.popularidad}%
        </span>
      )}
    </div>
  );
}
