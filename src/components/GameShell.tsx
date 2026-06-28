"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, HelpCircle, RotateCcw } from "lucide-react";
import type {
  AdivinaPersonajeConfig,
  AgilidadMentalConfig,
  ConsensusConfig,
  HechosHistoricosConfig,
  Level,
  PalabraClaveConfig,
  PalabraSecretaConfig,
  RankingConfig,
  UnePalabrasConfig,
} from "@/lib/types";
import { GAMES } from "@/lib/games";
import { themeToCssVars } from "@/lib/theme";
import { Modal } from "@/components/ui/Modal";
import { PalabraClave } from "@/components/games/PalabraClave";
import { Consensus } from "@/components/games/Consensus";
import { PalabraSecreta } from "@/components/games/PalabraSecreta";
import { UnePalabras } from "@/components/games/UnePalabras";
import { AdivinaPersonaje } from "@/components/games/AdivinaPersonaje";
import { AgilidadMental } from "@/components/games/AgilidadMental";
import { HechosHistoricos } from "@/components/games/HechosHistoricos";
import { Ranking } from "@/components/games/Ranking";

export function GameShell({ level }: { level: Level }) {
  const meta = GAMES[level.gameSlug];
  const [showHelp, setShowHelp] = useState(false);
  // Bumping this key remounts the game to restart it cleanly.
  const [round, setRound] = useState(0);
  const { theme } = level;

  // Paint the page (html/body) with the level's background so any area beyond
  // the game (e.g. mobile overscroll / browser chrome) shows the chosen color
  // instead of the platform default.
  useEffect(() => {
    if (!theme.bgColor) return;
    const root = document.documentElement;
    const body = document.body;
    const prev = { html: root.style.background, body: body.style.background };
    root.style.background = theme.bgColor;
    body.style.background = theme.bgColor;
    return () => {
      root.style.background = prev.html;
      body.style.background = prev.body;
    };
  }, [theme.bgColor]);

  return (
    <main
      className="game-shell min-h-dvh"
      style={themeToCssVars(theme)}
    >
      <div
        className={`min-h-dvh flex flex-col${theme.bgImageUrl ? " game-scrim" : ""}`}
      >
        <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 pt-4">
          <Link
            href="/"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            {(theme.showTitle ?? true) && (
              <span className="truncate font-[family-name:var(--font-display)] text-sm font-bold tracking-wide text-[var(--muted)]">
                {meta.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setRound((r) => r + 1)}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
              aria-label="Reiniciar"
            >
              <RotateCcw size={19} />
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
              aria-label="Cómo jugar"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        {theme.logoUrl ? (
          <div className="mx-auto flex w-full max-w-2xl justify-center px-4 pt-4">
            <Image
              src={theme.logoUrl}
              alt="Logo"
              width={240}
              height={80}
              className="h-14 w-auto object-contain sm:h-16"
              unoptimized
            />
          </div>
        ) : null}

        <div
          key={round}
          className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-3"
        >
          {level.gameSlug === "palabra-clave" && (
            <PalabraClave config={level.config as PalabraClaveConfig} />
          )}
          {level.gameSlug === "consensus" && (
            <Consensus config={level.config as ConsensusConfig} />
          )}
          {level.gameSlug === "palabra-secreta" && (
            <PalabraSecreta config={level.config as PalabraSecretaConfig} />
          )}
          {level.gameSlug === "une-palabras" && (
            <UnePalabras config={level.config as UnePalabrasConfig} />
          )}
          {level.gameSlug === "adivina-personaje" && (
            <AdivinaPersonaje config={level.config as AdivinaPersonajeConfig} />
          )}
          {level.gameSlug === "agilidad-mental" && (
            <AgilidadMental config={level.config as AgilidadMentalConfig} />
          )}
          {level.gameSlug === "hechos-historicos" && (
            <HechosHistoricos config={level.config as HechosHistoricosConfig} />
          )}
          {level.gameSlug === "ranking" && (
            <Ranking config={level.config as RankingConfig} />
          )}
        </div>
      </div>

      <Modal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title={`Cómo jugar — ${meta.name}`}
      >
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          {meta.instructions.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--brand)]">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Modal>
    </main>
  );
}
