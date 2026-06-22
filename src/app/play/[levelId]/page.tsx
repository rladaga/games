import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLevel } from "@/lib/data";
import { GAMES } from "@/lib/games";
import { GameShell } from "@/components/GameShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ levelId: string }>;
}): Promise<Metadata> {
  const { levelId } = await params;
  const level = await getLevel(levelId);
  if (!level) return { title: "Nivel no encontrado" };
  return {
    title: `${level.title} — ${GAMES[level.gameSlug].name}`,
    description: GAMES[level.gameSlug].description,
  };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const level = await getLevel(levelId);

  if (!level || level.status !== "published") notFound();

  return <GameShell level={level} />;
}
