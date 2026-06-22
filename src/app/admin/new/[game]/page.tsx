import { notFound } from "next/navigation";
import { getGame } from "@/lib/games";
import { blankLevel } from "@/lib/defaults";
import type { GameSlug } from "@/lib/types";
import { LevelEditor } from "@/components/admin/LevelEditor";

export default async function NewLevelPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  if (!getGame(game)) notFound();
  return <LevelEditor initialLevel={blankLevel(game as GameSlug)} isNew />;
}
