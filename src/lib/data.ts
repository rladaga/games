import "server-only";
import type { GameSlug, Level, LevelStatus } from "./types";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import { SEED_LEVELS } from "./seed";
import { shortId } from "./utils";

/* ----------------------------------------------------------------------------
   Data access. Two backends behind one interface:
   - Supabase (when env vars are set): the real, persistent store.
   - Dev store (otherwise): an in-memory map seeded from SEED_LEVELS so the app
     and admin are fully usable in development without any backend. Resets on
     server restart.
---------------------------------------------------------------------------- */

interface LevelRow {
  id: string;
  game_slug: GameSlug;
  title: string;
  status: LevelStatus;
  theme: Level["theme"];
  config: Level["config"];
  created_at?: string;
  updated_at?: string;
}

function rowToLevel(row: LevelRow): Level {
  return {
    id: row.id,
    gameSlug: row.game_slug,
    title: row.title,
    status: row.status,
    theme: row.theme ?? {},
    config: row.config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function levelToRow(level: Level): LevelRow {
  return {
    id: level.id,
    game_slug: level.gameSlug,
    title: level.title,
    status: level.status,
    theme: level.theme,
    config: level.config,
  };
}

/* --------------------------------- Dev store ------------------------------ */

const g = globalThis as unknown as { __devLevels?: Map<string, Level> };
function devStore(): Map<string, Level> {
  if (!g.__devLevels) {
    g.__devLevels = new Map(SEED_LEVELS.map((l) => [l.id, structuredClone(l)]));
  }
  return g.__devLevels;
}

/* ------------------------------- Read (public) ---------------------------- */

export async function getLevel(id: string): Promise<Level | null> {
  if (!isSupabaseConfigured()) return devStore().get(id) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("levels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToLevel(data as LevelRow);
}

/** Levels for the admin (all statuses) or a public listing (published only). */
export async function listLevels(opts?: {
  gameSlug?: GameSlug;
  publishedOnly?: boolean;
}): Promise<Level[]> {
  if (!isSupabaseConfigured()) {
    let levels = [...devStore().values()];
    if (opts?.gameSlug) levels = levels.filter((l) => l.gameSlug === opts.gameSlug);
    if (opts?.publishedOnly) levels = levels.filter((l) => l.status === "published");
    return levels.sort((a, b) => a.title.localeCompare(b.title));
  }

  const supabase = await createClient();
  let query = supabase.from("levels").select("*").order("updated_at", {
    ascending: false,
  });
  if (opts?.gameSlug) query = query.eq("game_slug", opts.gameSlug);
  if (opts?.publishedOnly) query = query.eq("status", "published");

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as LevelRow[]).map(rowToLevel);
}

/* ------------------------------- Write (admin) ---------------------------- */

export async function createLevel(
  input: Omit<Level, "id"> & { id?: string },
): Promise<Level> {
  const level: Level = { ...input, id: input.id || shortId() };

  if (!isSupabaseConfigured()) {
    devStore().set(level.id, structuredClone(level));
    return level;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("levels")
    .insert(levelToRow(level))
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return rowToLevel(data as LevelRow);
}

export async function updateLevel(level: Level): Promise<Level> {
  if (!isSupabaseConfigured()) {
    devStore().set(level.id, structuredClone(level));
    return level;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("levels")
    .update({ ...levelToRow(level), updated_at: new Date().toISOString() })
    .eq("id", level.id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return rowToLevel(data as LevelRow);
}

export async function deleteLevel(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    devStore().delete(id);
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("levels").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
