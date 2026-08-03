"use client";

import type { GameSlug, Theme } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/theme";
import { Field, ColorInput, Toggle } from "./fields";
import { ImageInput } from "./ImageInput";

type Slot = { key: keyof Theme; label: string; hint?: string };

// Base colors shown for every game.
const BASE: Slot[] = [
  { key: "bgColor", label: "Fondo" },
  { key: "surfaceColor", label: "Tarjetas / teclas" },
  { key: "borderColor", label: "Bordes" },
  { key: "brandColor", label: "Color principal", hint: "Botones, selección, resaltados." },
  { key: "brandInkColor", label: "Texto sobre el principal" },
  { key: "accentColor", label: "Acento", hint: "Subtítulos, pistas, porcentajes." },
];

// Text roles — the important split so each kind of text can carry its own color.
const TEXT: Slot[] = [
  { key: "textColor", label: "Texto principal" },
  { key: "headingColor", label: "Títulos", hint: "Títulos, preguntas y números grandes." },
  { key: "mutedColor", label: "Texto suave" },
];

const CAPTION: Slot = {
  key: "captionColor",
  label: "Leyendas de imágenes",
  hint: "El texto que va debajo de cada imagen.",
};

// Games that render captions under thumbnails.
const CAPTION_GAMES: GameSlug[] = ["hechos-historicos", "ranking"];
// Only Palabra Clave uses the "wrong position" (yellow) state.
const WARN_GAMES: GameSlug[] = ["palabra-clave"];

// Extra, game-specific accents shown as their own section.
const GAME_SECTIONS: Partial<Record<GameSlug, { title: string; slots: Slot[] }>> = {
  "hechos-historicos": {
    title: "Colores de Hechos Históricos",
    slots: [
      { key: "yearColor", label: "Años", hint: "Los números de año de la línea de tiempo." },
      { key: "timelineColor", label: "Barra de tiempo", hint: "La línea vertical central." },
    ],
  },
  "agilidad-mental": {
    title: "Colores de Agilidad Mental",
    slots: [
      { key: "timerColor", label: "Barra de tiempo" },
      { key: "livesColor", label: "Vidas (corazones)" },
    ],
  },
  "palabra-secreta": {
    title: "Colores de Palabra Secreta",
    slots: [
      { key: "hotColor", label: "Cerca (caliente)", hint: "Cuando el intento está cerca de la palabra." },
      { key: "coldColor", label: "Lejos (frío)" },
      { key: "winnerColor", label: "Palabra ganadora", hint: "Color del texto cuando se descubre la palabra." },
    ],
  },
  consensus: {
    title: "Colores de Consensus",
    slots: [{ key: "popularityColor", label: "Porcentaje / popularidad" }],
  },
  ranking: {
    title: "Colores de Ranking",
    slots: [{ key: "rankColor", label: "Número de posición" }],
  },
};

// Slots that inherit another slot's color until overridden.
const ALIAS: Partial<Record<keyof Theme, keyof Theme>> = {
  headingColor: "textColor",
  captionColor: "textColor",
  yearColor: "headingColor",
  timelineColor: "brandColor",
  rankColor: "brandColor",
  timerColor: "goodColor",
  livesColor: "badColor",
  popularityColor: "accentColor",
  winnerColor: "goodColor",
};

// Slots with a fixed default that isn't in DEFAULT_THEME.
const EXTRA_DEFAULTS: Partial<Record<keyof Theme, string>> = {
  hotColor: "#e5484d",
  coldColor: "#4f7cff",
};

export function ThemeEditor({
  theme,
  gameSlug,
  onChange,
}: {
  theme: Theme;
  gameSlug: GameSlug;
  onChange: (t: Theme) => void;
}) {
  const set = (patch: Partial<Theme>) => onChange({ ...theme, ...patch });

  // Resolve the color actually in effect for a slot, following alias chains
  // (e.g. timeline → brand → its value) so the swatch shows the real color.
  function effective(key: keyof Theme): string {
    const own = theme[key] as string | undefined;
    if (own) return own;
    const alias = ALIAS[key];
    if (alias) return effective(alias);
    return EXTRA_DEFAULTS[key] || (DEFAULT_THEME[key] as string) || "#000000";
  }

  const color = (slot: Slot) => (
    <Field key={slot.key} label={slot.label} hint={slot.hint}>
      <ColorInput value={effective(slot.key)} onChange={(v) => set({ [slot.key]: v } as Partial<Theme>)} />
    </Field>
  );

  const showCaption = CAPTION_GAMES.includes(gameSlug);
  const showWarn = WARN_GAMES.includes(gameSlug);
  const textSlots = showCaption ? [...TEXT, CAPTION] : TEXT;
  const gameSection = GAME_SECTIONS[gameSlug];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Field label="Logo (arriba del juego)">
          <ImageInput value={theme.logoUrl} onChange={(url) => set({ logoUrl: url })} />
        </Field>
        <Field label="Imagen de fondo" hint="Opcional. Se aplica sobre el color de fondo.">
          <ImageInput value={theme.bgImageUrl} onChange={(url) => set({ bgImageUrl: url })} />
        </Field>
        <Toggle
          label="Mostrar nombre del juego"
          checked={theme.showTitle ?? true}
          onChange={(v) => set({ showTitle: v })}
        />
      </div>

      <Section title="Colores base">
        <div className="grid grid-cols-2 gap-3">{BASE.map(color)}</div>
      </Section>

      <Section title="Textos" hint="Cada tipo de texto lleva su propio color.">
        <div className="grid grid-cols-2 gap-3">{textSlots.map(color)}</div>
      </Section>

      <Section
        title="Colores de resultado"
        hint={showWarn ? "Se usan en Palabra Clave y en los aciertos." : "Aciertos y errores del juego."}
      >
        <div className="grid grid-cols-2 gap-3">
          {color({ key: "goodColor", label: "Acierto" })}
          {color({ key: "badColor", label: showWarn ? "Ausente" : "Error" })}
          {showWarn && color({ key: "warnColor", label: "Posición incorrecta" })}
        </div>
      </Section>

      {gameSection && (
        <Section title={gameSection.title}>
          <div className="grid grid-cols-2 gap-3">{gameSection.slots.map(color)}</div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--border)] pt-4">
      <p className="text-sm font-bold">{title}</p>
      {hint && <p className="mb-3 mt-0.5 text-xs text-[var(--muted)]">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  );
}
