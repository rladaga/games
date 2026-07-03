"use client";

import { PartyPopper, Frown } from "lucide-react";

export function GameResult({
  won,
  title,
  reveal,
}: {
  won: boolean;
  title: string;
  reveal?: React.ReactNode;
}) {
  return (
    <div className="card w-full max-w-md p-6 text-center animate-rise">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]">
        {won ? <PartyPopper size={24} /> : <Frown size={24} />}
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--heading)]">
        {title}
      </h2>
      {reveal && <p className="mt-2 text-[var(--muted)]">{reveal}</p>}
      <p className="mt-4 text-xs text-[var(--muted)]">
        Usá el botón de reiniciar (arriba a la derecha) para jugar de nuevo.
      </p>
    </div>
  );
}
