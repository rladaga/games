"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Play, Link2, Trash2, Check } from "lucide-react";
import type { Level } from "@/lib/types";
import { deleteLevelAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function LevelRow({ level }: { level: Level }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/play/${level.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function remove() {
    if (!confirm(`¿Eliminar "${level.title}"?`)) return;
    setBusy(true);
    await deleteLevelAction(level.id);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
          level.status === "published"
            ? "bg-[var(--good)]/20 text-[var(--good)]"
            : "bg-[var(--muted)]/15 text-[var(--muted)]",
        )}
      >
        {level.status === "published" ? "Publicado" : "Borrador"}
      </span>
      <span className="min-w-0 flex-1 truncate font-semibold">{level.title}</span>
      <span className="hidden font-mono text-xs text-[var(--muted)] sm:inline">
        /{level.id}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={copyLink}
          title="Copiar link"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
        >
          {copied ? <Check size={16} className="text-[var(--good)]" /> : <Link2 size={16} />}
        </button>
        <Link
          href={`/play/${level.id}`}
          title="Jugar"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
        >
          <Play size={16} />
        </Link>
        <Link
          href={`/admin/edit/${level.id}`}
          title="Editar"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={remove}
          disabled={busy}
          title="Eliminar"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--bad)]/15 hover:text-[var(--bad)]"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
