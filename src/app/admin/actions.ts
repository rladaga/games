"use server";

import { revalidatePath } from "next/cache";
import type { Level } from "@/lib/types";
import { createLevel, deleteLevel, updateLevel } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

async function assertAuthed() {
  if (!isSupabaseConfigured()) return; // local/demo mode
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
}

export async function saveLevelAction(
  level: Level,
  isNew: boolean,
): Promise<Level> {
  await assertAuthed();
  const saved = isNew ? await createLevel(level) : await updateLevel(level);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/play/${saved.id}`);
  return saved;
}

export async function deleteLevelAction(id: string): Promise<void> {
  await assertAuthed();
  await deleteLevel(id);
  revalidatePath("/admin");
  revalidatePath("/");
}
