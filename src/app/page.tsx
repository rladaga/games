import Link from "next/link";
import { Play, Settings, ArrowRight } from "lucide-react";
import { GAME_LIST, GAMES } from "@/lib/games";
import { listLevels } from "@/lib/data";

export default async function Home() {
  const levels = await listLevels({ publishedOnly: true });
  const byGame = GAME_LIST.map((g) => ({
    game: g,
    levels: levels.filter((l) => l.gameSlug === g.slug),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)]">
            Plataforma de juegos
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-extrabold sm:text-4xl">
            Puzzles para tu canal
          </h1>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
        >
          <Settings size={16} /> Admin
        </Link>
      </header>

      <p className="mt-4 max-w-xl text-[var(--muted)]">
        Cada juego puede tener varios niveles configurables por marca. Compartí
        el link de un nivel y jugalo en pantalla.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {byGame.map(({ game, levels }) => (
          <section key={game.slug}>
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-1.5 rounded-full"
                style={{ background: game.accent }}
              />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {game.name}
                </h2>
                <p className="text-sm text-[var(--muted)]">{game.tagline}</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {levels.length === 0 && (
                <p className="rounded-[var(--radius-tile)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                  Sin niveles publicados todavía.
                </p>
              )}
              {levels.map((level) => (
                <Link
                  key={level.id}
                  href={`/play/${level.id}`}
                  className="group flex items-center justify-between rounded-[var(--radius-tile)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--brand)]"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-white"
                      style={{ background: game.accent }}
                    >
                      <Play size={16} className="translate-x-[1px]" />
                    </span>
                    <span className="font-semibold">{level.title}</span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-[var(--muted)] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-16 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        {GAMES["palabra-secreta"].name} · {GAMES["consensus"].name} ·{" "}
        {GAMES["palabra-clave"].name}
      </footer>
    </div>
  );
}
