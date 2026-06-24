"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Link2, Check, Eye } from "lucide-react";
import type {
  ConsensusConfig,
  Level,
  PalabraClaveConfig,
  PalabraSecretaConfig,
} from "@/lib/types";
import { GAMES } from "@/lib/games";
import { themeToCssVars } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { saveLevelAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, Toggle } from "./fields";
import { ThemeEditor } from "./ThemeEditor";
import {
  ConsensusForm,
  PalabraClaveForm,
  PalabraSecretaForm,
} from "./ConfigForms";
import { PalabraClave } from "@/components/games/PalabraClave";
import { Consensus } from "@/components/games/Consensus";
import { PalabraSecreta } from "@/components/games/PalabraSecreta";

type Tab = "contenido" | "apariencia";

export function LevelEditor({
  initialLevel,
  isNew,
}: {
  initialLevel: Level;
  isNew: boolean;
}) {
  const router = useRouter();
  const meta = GAMES[initialLevel.gameSlug];
  const [level, setLevel] = useState<Level>(initialLevel);
  const [tab, setTab] = useState<Tab>("contenido");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedNew, setSavedNew] = useState(!isNew);
  const [copied, setCopied] = useState(false);

  const set = (patch: Partial<Level>) => setLevel((l) => ({ ...l, ...patch }));

  async function save() {
    setSaving(true);
    setError("");
    try {
      const saved = await saveLevelAction(level, isNew && !savedNew);
      setLevel(saved);
      setSavedNew(true);
      router.refresh();
      if (isNew) router.replace(`/admin/edit/${saved.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/play/${level.id}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              {meta.name}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-bold">
              {isNew && !savedNew ? "Nuevo nivel" : "Editar nivel"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedNew && (
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)]"
            >
              {copied ? <Check size={16} className="text-[var(--good)]" /> : <Link2 size={16} />}
              Link
            </button>
          )}
          <Button onClick={save} disabled={saving}>
            <Save size={16} />
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-xl bg-[var(--bad)]/15 p-3 text-sm text-[var(--bad)]">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(360px,420px)]">
        {/* Editor */}
        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <Field label="Título del nivel" hint="Solo visible en el admin.">
              <TextInput
                value={level.title}
                onChange={(e) => set({ title: e.target.value })}
              />
            </Field>
            <div className="mt-4">
              <Toggle
                label={level.status === "published" ? "Publicado" : "Borrador"}
                checked={level.status === "published"}
                onChange={(v) =>
                  set({ status: v ? "published" : "draft" })
                }
              />
              <p className="mt-1 text-xs text-[var(--muted)]">
                Solo los niveles publicados son accesibles por su link.
              </p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex border-b border-[var(--border)]">
              {(["contenido", "apariencia"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-semibold capitalize transition-colors",
                    tab === t
                      ? "border-b-2 border-[var(--brand)] text-[var(--text)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-5">
              {tab === "contenido" ? (
                <ConfigSection level={level} set={set} />
              ) : (
                <ThemeEditor
                  theme={level.theme}
                  onChange={(theme) => set({ theme })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
            <Eye size={16} /> Vista previa
          </div>
          <Preview level={level} />
        </div>
      </div>
    </div>
  );
}

function ConfigSection({
  level,
  set,
}: {
  level: Level;
  set: (patch: Partial<Level>) => void;
}) {
  if (level.gameSlug === "palabra-clave")
    return (
      <PalabraClaveForm
        config={level.config as PalabraClaveConfig}
        onChange={(config) => set({ config })}
      />
    );
  if (level.gameSlug === "consensus")
    return (
      <ConsensusForm
        config={level.config as ConsensusConfig}
        onChange={(config) => set({ config })}
      />
    );
  return (
    <PalabraSecretaForm
      config={level.config as PalabraSecretaConfig}
      onChange={(config) => set({ config })}
    />
  );
}

function Preview({ level }: { level: Level }) {
  // Remount the game when content changes so the preview reflects edits.
  const key = useMemo(() => JSON.stringify(level.config), [level.config]);

  return (
    <div
      className="game-shell overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)]"
      style={themeToCssVars(level.theme)}
    >
      <div
        className={`max-h-[78vh] overflow-y-auto p-4${level.theme.bgImageUrl ? " game-scrim" : ""}`}
      >
        {(level.theme.showTitle ?? true) && (
          <p className="mb-1 text-center font-[family-name:var(--font-display)] text-xs font-bold tracking-wide text-[var(--muted)]">
            {GAMES[level.gameSlug].name}
          </p>
        )}
        {level.theme.logoUrl ? (
          <div className="mb-2 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={level.theme.logoUrl}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
        ) : null}
        <div key={key} className="mx-auto flex min-h-[60vh] max-w-md flex-col">
          {level.gameSlug === "palabra-clave" && (
            <PalabraClave config={level.config as PalabraClaveConfig} />
          )}
          {level.gameSlug === "consensus" && (
            <Consensus config={level.config as ConsensusConfig} />
          )}
          {level.gameSlug === "palabra-secreta" && (
            <PalabraSecreta config={level.config as PalabraSecretaConfig} />
          )}
        </div>
      </div>
    </div>
  );
}
