"use client";

import type { Theme } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/theme";
import { Field, ColorInput, Toggle } from "./fields";
import { ImageInput } from "./ImageInput";

const COLOR_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "bgColor", label: "Fondo" },
  { key: "surfaceColor", label: "Tarjetas / teclas" },
  { key: "brandColor", label: "Color principal" },
  { key: "brandInkColor", label: "Texto sobre principal" },
  { key: "accentColor", label: "Acento" },
  { key: "textColor", label: "Texto / letras" },
  { key: "mutedColor", label: "Texto suave" },
  { key: "borderColor", label: "Bordes" },
];

const RESULT_COLOR_FIELDS: { key: keyof Theme; label: string }[] = [
  { key: "goodColor", label: "Acierto (verde)" },
  { key: "warnColor", label: "Posición incorrecta (amarillo)" },
  { key: "badColor", label: "Ausente (gris)" },
];

export function ThemeEditor({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
}) {
  const set = (patch: Partial<Theme>) => onChange({ ...theme, ...patch });

  return (
    <div className="flex flex-col gap-5">
      <Field label="Logo (arriba del juego)">
        <ImageInput
          value={theme.logoUrl}
          onChange={(url) => set({ logoUrl: url })}
        />
      </Field>

      <Field label="Imagen de fondo" hint="Opcional. Se aplica sobre el color de fondo.">
        <ImageInput
          value={theme.bgImageUrl}
          onChange={(url) => set({ bgImageUrl: url })}
        />
      </Field>

      <Toggle
        label="Mostrar nombre del juego"
        checked={theme.showTitle ?? true}
        onChange={(v) => set({ showTitle: v })}
      />

      <div className="grid grid-cols-2 gap-3">
        {COLOR_FIELDS.map(({ key, label }) => (
          <Field key={key} label={label}>
            <ColorInput
              value={(theme[key] as string) || (DEFAULT_THEME[key] as string) || "#000000"}
              onChange={(v) => set({ [key]: v } as Partial<Theme>)}
            />
          </Field>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-4">
        <p className="mb-3 text-sm font-bold">Colores de resultado</p>
        <p className="mb-3 text-xs text-[var(--muted)]">
          Se usan en Palabra Clave (y en aciertos de los otros juegos).
        </p>
        <div className="grid grid-cols-1 gap-3">
          {RESULT_COLOR_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <ColorInput
                value={(theme[key] as string) || (DEFAULT_THEME[key] as string) || "#000000"}
                onChange={(v) => set({ [key]: v } as Partial<Theme>)}
              />
            </Field>
          ))}
        </div>
      </div>
    </div>
  );
}
