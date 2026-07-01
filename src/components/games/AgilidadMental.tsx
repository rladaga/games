"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";
import type { AgilidadMentalConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GameResult } from "./GameResult";

export function AgilidadMental({ config }: { config: AgilidadMentalConfig }) {
  const preguntas = useMemo(
    () =>
      (config.preguntas ?? []).filter(
        (q) => q.prompt.trim() && q.opciones.filter((o) => o.trim()).length >= 2,
      ),
    [config.preguntas],
  );
  const totalSecs = config.segundosPorPregunta || 8;
  const vidasIniciales = config.vidas || 3;

  const [idx, setIdx] = useState(0);
  const [vidas, setVidas] = useState(vidasIniciales);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [phase, setPhase] = useState<"playing" | "feedback" | "over">("playing");
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSecs);
  const deadline = useRef(0);

  const q = preguntas[idx];

  // Countdown — timestamp-based so it stays accurate and the bar animates
  // smoothly regardless of timer jitter. Runs only while a question is live.
  useEffect(() => {
    if (phase !== "playing") return;
    deadline.current = Date.now() + totalSecs * 1000;
    const t = setInterval(() => {
      const remaining = Math.max(0, (deadline.current - Date.now()) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(t);
        answer(-1);
      }
    }, 50);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx]);

  function answer(opt: number) {
    if (phase !== "playing") return;
    const correct = opt === q.correcta;
    setChosen(opt);
    setPhase("feedback");

    const nextScore = correct ? score + 1 : score;
    const nextVidas = correct ? vidas : vidas - 1;
    if (correct) setScore(nextScore);
    else setVidas(nextVidas);

    setTimeout(() => {
      if (nextVidas <= 0) {
        setWon(false);
        setPhase("over");
      } else if (idx + 1 >= preguntas.length) {
        setWon(true);
        setPhase("over");
      } else {
        setIdx(idx + 1);
        setChosen(null);
        setTimeLeft(totalSecs);
        setPhase("playing");
      }
    }, 800);
  }

  if (preguntas.length < 1) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos una pregunta con dos opciones para jugar.
      </div>
    );
  }

  if (phase === "over") {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <GameResult
          won={won}
          title={won ? "¡Completaste el quiz!" : "Se acabaron las vidas"}
          reveal={`Acertaste ${score} de ${preguntas.length}.`}
        />
      </div>
    );
  }

  const pct = (timeLeft / totalSecs) * 100;

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* Timer + vidas */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[var(--surface)] px-4 py-1.5 font-[family-name:var(--font-display)] text-xl font-extrabold tabular-nums">
          00:{String(Math.ceil(timeLeft)).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: vidasIniciales }).map((_, i) => (
            <Heart
              key={i}
              size={22}
              className={cn(
                "transition-colors",
                i < vidas ? "fill-[var(--bad)] text-[var(--bad)]" : "text-[var(--border)]",
              )}
            />
          ))}
        </div>
      </div>

      {/* Pregunta + estímulo */}
      <div className="card p-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
          {q.prompt}
        </h1>
        {q.stimulus?.texto ? (
          <p
            className="mt-4 font-[family-name:var(--font-display)] text-5xl font-extrabold uppercase tracking-tight"
            style={{ color: q.stimulus.color || "var(--text)" }}
          >
            {q.stimulus.texto}
          </p>
        ) : null}
      </div>

      {/* Barra de progreso */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-[var(--good)] transition-[width] duration-100 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Opciones */}
      <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
        {q.opciones.map((op, i) => {
          if (!op.trim()) return null;
          const isChosen = chosen === i;
          const isCorrect = i === q.correcta;
          const showState = phase === "feedback";
          return (
            <button
              key={i}
              type="button"
              disabled={phase !== "playing"}
              onClick={() => answer(i)}
              className={cn(
                "min-h-13 rounded-[var(--radius-tile)] border px-4 py-3 font-semibold uppercase tracking-wide transition-all active:scale-95",
                showState && isCorrect
                  ? "border-transparent bg-[var(--good)] text-white"
                  : showState && isChosen
                    ? "border-transparent bg-[var(--bad)] text-white"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--brand)]",
              )}
            >
              {op}
            </button>
          );
        })}
      </div>
    </div>
  );
}
