import { notFound } from "next/navigation";
import { getLevel } from "@/lib/data";
import { LevelEditor } from "@/components/admin/LevelEditor";

export const dynamic = "force-dynamic";

export default async function EditLevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const level = await getLevel(id);
  if (!level) notFound();
  return <LevelEditor initialLevel={level} isNew={false} />;
}
