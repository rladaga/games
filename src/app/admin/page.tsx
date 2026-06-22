import Link from "next/link";
import { Plus } from "lucide-react";
import { GAME_LIST } from "@/lib/games";
import { listLevels } from "@/lib/data";
import { LevelRow } from "@/components/admin/LevelRow";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const levels = await listLevels();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
            Panel de contenido
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Creá y editá niveles de cada juego.
          </p>
        </div>
        <LogoutButton />
      </header>

      <div className="mt-8 flex flex-col gap-8">
        {GAME_LIST.map((game) => {
          const gameLevels = levels.filter((l) => l.gameSlug === game.slug);
          return (
            <section key={game.slug}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-7 w-1.5 rounded-full"
                    style={{ background: game.accent }}
                  />
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">
                    {game.name}
                  </h2>
                  <span className="text-sm text-[var(--muted)]">
                    {gameLevels.length} nivel{gameLevels.length === 1 ? "" : "es"}
                  </span>
                </div>
                <Link
                  href={`/admin/new/${game.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-ink)] hover:brightness-110"
                >
                  <Plus size={16} /> Nuevo
                </Link>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {gameLevels.length === 0 && (
                  <p className="rounded-[var(--radius-tile)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                    Todavía no hay niveles. Creá el primero.
                  </p>
                )}
                {gameLevels.map((level) => (
                  <LevelRow key={level.id} level={level} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
