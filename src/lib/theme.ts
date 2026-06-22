import type { CSSProperties } from "react";
import type { Theme } from "./types";

type Vars = CSSProperties & Record<`--${string}`, string | undefined>;

/**
 * Maps a level Theme onto the CSS custom properties consumed by globals.css.
 * Undefined values are omitted so platform defaults shine through.
 */
export function themeToCssVars(theme: Theme = {}): Vars {
  const vars: Vars = {};

  if (theme.bgColor) {
    vars["--bg"] = theme.bgColor;
    vars["--bg-2"] = theme.bgColor;
  }
  vars["--bg-image"] = theme.bgImageUrl
    ? `url("${theme.bgImageUrl}")`
    : "none";

  if (theme.surfaceColor) vars["--surface"] = theme.surfaceColor;
  if (theme.borderColor) vars["--border"] = theme.borderColor;
  if (theme.textColor) vars["--text"] = theme.textColor;
  if (theme.mutedColor) vars["--muted"] = theme.mutedColor;
  if (theme.brandColor) vars["--brand"] = theme.brandColor;
  if (theme.brandInkColor) vars["--brand-ink"] = theme.brandInkColor;
  if (theme.accentColor) vars["--accent"] = theme.accentColor;
  if (theme.goodColor) vars["--good"] = theme.goodColor;
  if (theme.warnColor) vars["--warn"] = theme.warnColor;
  if (theme.badColor) vars["--bad"] = theme.badColor;

  return vars;
}

export const DEFAULT_THEME: Theme = {
  bgColor: "#0b0b12",
  surfaceColor: "#1a1a28",
  borderColor: "#2c2c40",
  textColor: "#f4f4f8",
  mutedColor: "#9a9ab0",
  brandColor: "#7c5cff",
  brandInkColor: "#ffffff",
  accentColor: "#ffd166",
  goodColor: "#2ecc71",
  warnColor: "#f4c542",
  badColor: "#6b7280",
  bgImageUrl: null,
  logoUrl: null,
  showTitle: true,
};
