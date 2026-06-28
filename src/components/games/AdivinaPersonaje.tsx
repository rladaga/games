"use client";

import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import type { AdivinaPersonajeConfig } from "@/lib/types";
import { cn, normalize } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GameResult } from "./GameResult";

export function AdivinaPersonaje({ config }: { config: AdivinaPersonajeConfig }) {
  const pistas = useMemo(
    () => (config.pistas ?? []).map((p) => p.trim()).filter(Boolean),
    [config.pistas],
  );
  const intentosMax = config.intentosMax || 5;

  const [revealed, setRevealed] = useState(1); // clues shown so far
  const [intentos, setIntentos] = useState(0);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [flash, setFlash] = useState(false);

  const accepted = useMemo(
    () => [config.respuesta, ...(config.alias ?? [])].map(normalize).filter(Boolean),
    [config.respuesta, config.alias],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "playing" || !guess.trim()) return;
    if (accepted.includes(normalize(guess))) {
      setStatus("won");
      return;
    }
    const next = intentos + 1;
    setIntentos(next);
    setGuess("");
    setFlash(true);
    setTimeout(() => setFlash(false), 450);
    if (next >= intentosMax) setStatus("lost");
  }

  function masPista() {
    if (revealed < pistas.length) setRevealed((r) => r + 1);
  }

  const showImage = status !== "playing" && config.imagenUrl;
  const restantes = intentosMax - intentos;

  if (pistas.length < 1) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos una pista para jugar.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="card p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          ¿Quién es?
        </p>
        {showImage ? (
          <div className="mt-3 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.imagenUrl as string}
              alt={config.respuesta}
              className="max-h-48 w-auto rounded-[var(--radius-tile)] object-contain"
            />
          </div>
        ) : null}
        {status !== "playing" && (
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold">
            {config.respuesta}
          </h1>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {pistas.slice(0, status === "playing" ? revealed : pistas.length).map((pista, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-[var(--radius-tile)] border border-[var(--border)] bg-[var(--surface)] p-3 text-sm animate-rise"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand)]/15 text-xs font-bold text-[var(--brand)]">
              {i + 1}
            </span>
            <span className="flex-1 text-[var(--text)]">{pista}</span>
          </div>
        ))}
      </div>

      {status === "playing" ? (
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <span>
              {restantes} intento{restantes === 1 ? "" : "s"} restante
              {restantes === 1 ? "" : "s"}
            </span>
            {revealed < pistas.length ? (
              <button
                type="button"
                onClick={masPista}
                className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)] hover:brightness-110"
              >
                <Lightbulb size={15} /> Otra pista
              </button>
            ) : (
              <span className="text-xs">No quedan más pistas</span>
            )}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="¿Quién es el personaje?"
              autoFocus
              className={cn(
                "h-12 flex-1 rounded-full border bg-[var(--surface)] px-5 text-[var(--text)] outline-none transition-colors",
                "border-[var(--border)] focus:border-[var(--brand)]",
                flash && "animate-shake border-[var(--bad)]",
              )}
            />
            <Button type="submit" size="lg">
              Adivinar
            </Button>
          </form>
        </div>
      ) : (
        <GameResult
          won={status === "won"}
          title={status === "won" ? "¡Lo adivinaste!" : "No esta vez"}
          reveal={
            status === "won"
              ? `Acertaste con ${revealed} pista${revealed === 1 ? "" : "s"} usada${revealed === 1 ? "" : "s"}.`
              : `El personaje era ${config.respuesta}.`
          }
        />
      )}
    </div>
  );
}
