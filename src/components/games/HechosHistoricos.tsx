"use client";

import { useMemo, useRef, useState } from "react";
import { Check, CalendarClock } from "lucide-react";
import type { HechosHistoricosConfig } from "@/lib/types";
import { cn, shuffle } from "@/lib/utils";
import { GameResult } from "./GameResult";
import { GameImage } from "./GameImage";

interface Evento {
  id: number;
  texto: string;
  anio: number;
  imagenUrl?: string | null;
}

export function HechosHistoricos({ config }: { config: HechosHistoricosConfig }) {
  const eventos = useMemo<Evento[]>(
    () =>
      (config.eventos ?? [])
        .map((e, id) => ({ id, texto: e.texto.trim(), anio: Number(e.anio), imagenUrl: e.imagenUrl }))
        .filter((e) => e.texto),
    [config.eventos],
  );

  // Timeline slots: the years sorted ascending (one slot per event).
  const slots = useMemo(() => [...eventos].sort((a, b) => a.anio - b.anio), [eventos]);
  // Tray order: shuffled once per mount (the shell remounts to restart).
  const tray = useMemo(() => shuffle(eventos), [eventos]);

  // slot index -> placed event id
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const placedIds = new Set(Object.values(placed));
  const [selected, setSelected] = useState<number | null>(null);
  const [errorSlot, setErrorSlot] = useState<number | null>(null);

  // Pointer drag (mouse + touch, no dependency).
  const boardRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  // `moved` is mirrored in state so render can react to it; the ref stays the
  // source of truth for the synchronous pointer-up handler (always current).
  const [drag, setDrag] = useState<{ id: number; x: number; y: number; moved: boolean } | null>(
    null,
  );
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);

  const byId = (id: number) => eventos.find((e) => e.id === id);
  const won = slots.length > 0 && Object.keys(placed).length >= slots.length;

  function attempt(cardId: number, slotIndex: number) {
    if (placed[slotIndex] !== undefined) return;
    const card = byId(cardId);
    if (card && card.anio === slots[slotIndex].anio) {
      setPlaced((p) => ({ ...p, [slotIndex]: cardId }));
      setSelected(null);
    } else {
      setErrorSlot(slotIndex);
      setTimeout(() => setErrorSlot(null), 450);
    }
  }

  function onCardDown(e: React.PointerEvent, id: number) {
    if (won) return;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragId.current = id;
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setDrag({ id, x: e.clientX, y: e.clientY, moved: false });
  }

  function onCardMove(e: React.PointerEvent) {
    if (dragId.current === null) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (!moved.current && Math.hypot(dx, dy) > 6) moved.current = true;
    setDrag({ id: dragId.current, x: e.clientX, y: e.clientY, moved: moved.current });

    let hovered: number | null = null;
    boardRef.current?.querySelectorAll<HTMLElement>("[data-slot]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        hovered = Number(el.dataset.slot);
      }
    });
    setHoverSlot(hovered);
  }

  function onCardUp(id: number) {
    if (dragId.current === null) return;
    if (moved.current) {
      if (hoverSlot !== null) attempt(id, hoverSlot);
    } else {
      // a tap → toggle selection
      setSelected((s) => (s === id ? null : id));
    }
    dragId.current = null;
    setDrag(null);
    setHoverSlot(null);
  }

  if (eventos.length < 2) {
    return (
      <div className="card p-6 text-center text-sm text-[var(--muted)]">
        Agregá al menos dos eventos para jugar.
      </div>
    );
  }

  const dragCard = drag?.moved ? byId(drag.id) : null;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="card p-4 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-lg font-bold sm:text-xl">
          {config.titulo || "Hechos Históricos"}
        </h1>
        <p className="mt-1 text-xs text-[var(--accent)]">
          Arrastrá o tocá la imagen hasta la fecha correcta
        </p>
      </div>

      {/* Línea de tiempo */}
      <div ref={boardRef} className="relative py-1">
        <div className="absolute bottom-2 left-1/2 top-2 w-2.5 -translate-x-1/2 rounded-full bg-[var(--brand)]" />
        <div className="relative flex flex-col gap-4">
          {slots.map((slot, i) => {
            const onLeft = i % 2 === 0; // circle on the left, year hugs the bar on the right
            const ev = placed[i] !== undefined ? byId(placed[i]) : null;
            const slotEl = (
              <Slot
                index={i}
                ev={ev}
                filled={!!ev}
                hovered={hoverSlot === i}
                error={errorSlot === i}
                armed={selected !== null}
                onTap={() => selected !== null && attempt(selected, i)}
              />
            );
            const yearEl = (
              <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums">
                {slot.anio}
              </span>
            );
            return (
              <div key={i} className="grid grid-cols-2 items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 pr-5",
                    onLeft ? "justify-start" : "justify-end",
                  )}
                >
                  {onLeft ? (
                    <>
                      {slotEl}
                      <span className="h-0.5 flex-1 bg-[var(--border)]" />
                    </>
                  ) : (
                    yearEl
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 pl-5",
                    onLeft ? "justify-start" : "justify-end",
                  )}
                >
                  {onLeft ? (
                    yearEl
                  ) : (
                    <>
                      <span className="h-0.5 flex-1 bg-[var(--border)]" />
                      {slotEl}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {won ? (
        <GameResult won title="¡Línea de tiempo completa!" reveal="Ubicaste cada hecho en su fecha." />
      ) : (
        <div className="mt-auto flex flex-col gap-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Imágenes
          </p>
          <div className="grid grid-cols-3 gap-2">
            {tray
              .filter((c) => !placedIds.has(c.id))
              .map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onPointerDown={(e) => onCardDown(e, card.id)}
                  onPointerMove={onCardMove}
                  onPointerUp={() => onCardUp(card.id)}
                  onPointerCancel={() => onCardUp(card.id)}
                  className={cn(
                    "flex touch-none flex-col items-center gap-1 rounded-xl border p-2 transition-all active:scale-95",
                    selected === card.id
                      ? "border-[var(--brand)] bg-[var(--brand)]/12"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)]/60",
                    drag?.id === card.id && drag.moved && "opacity-30",
                  )}
                >
                  <CardThumb ev={card} />
                  <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight">
                    {card.texto}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Fantasma que sigue al dedo/cursor mientras se arrastra */}
      {dragCard && drag && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: drag.x, top: drag.y }}
        >
          <div className="rounded-full border-2 border-[var(--brand)] shadow-[var(--shadow)]">
            <CardThumb ev={dragCard} />
          </div>
        </div>
      )}
    </div>
  );
}

function Slot({
  index,
  ev,
  filled,
  hovered,
  error,
  armed,
  onTap,
}: {
  index: number;
  ev: Evento | null | undefined;
  filled: boolean;
  hovered: boolean;
  error: boolean;
  armed: boolean;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      data-slot={index}
      onClick={onTap}
      disabled={filled}
      className={cn(
        "relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] transition-all",
        filled
          ? "border-[var(--good)] bg-[var(--good)]/10"
          : "border-dashed border-[var(--text)]/40 bg-[var(--surface)]",
        hovered && !filled && "scale-110 border-solid border-[var(--brand)] bg-[var(--brand)]/15",
        armed && !filled && "cursor-pointer hover:border-[var(--brand)]",
        error && "animate-shake border-[var(--bad)]",
      )}
    >
      {filled && ev ? (
        <GameImage
          src={ev.imagenUrl}
          alt={ev.texto}
          className="h-full w-full object-cover"
          fallback={
            <span className="px-1 text-center text-[9px] font-bold leading-tight text-[var(--good)]">
              {ev.texto}
            </span>
          }
        />
      ) : null}
      {filled && (
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--good)] text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function CardThumb({ ev }: { ev: Evento }) {
  return (
    <GameImage
      src={ev.imagenUrl}
      alt={ev.texto}
      className="h-14 w-14 rounded-full object-cover"
      fallback={
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--bg-2)] text-[var(--muted)]">
          <CalendarClock size={22} />
        </div>
      }
    />
  );
}
