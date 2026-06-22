/* ----------------------------------------------------------------------------
   Domain types. These mirror the Supabase schema (see supabase/schema.sql) but
   are also used by the local seed data so the app runs without a backend.
---------------------------------------------------------------------------- */

export type GameSlug = "palabra-secreta" | "consensus" | "palabra-clave";

export type LevelStatus = "draft" | "published";

/** Per-level branding. All optional; falls back to platform defaults. */
export interface Theme {
  bgColor?: string;
  bgImageUrl?: string | null;
  surfaceColor?: string;
  borderColor?: string;
  textColor?: string;
  mutedColor?: string;
  brandColor?: string;
  brandInkColor?: string;
  accentColor?: string;
  /** Result colors (Palabra Clave: acierto / posición / ausente). */
  goodColor?: string;
  warnColor?: string;
  badColor?: string;
  logoUrl?: string | null;
  /** Optional title shown under the logo on the game screen. */
  showTitle?: boolean;
}

/* ------------------------------ Game configs ------------------------------ */

export interface PalabraClaveConfig {
  /** The solution word. Length defines the board width. */
  solucion: string;
  intentosMax: number;
  validarDiccionario: boolean;
  /** Extra words accepted as guesses beyond the dictionary (e.g. brand names). */
  palabrasExtra?: string[];
}

export interface ConsensusAnswer {
  texto: string;
  /** Popularity 0-100, how much of the community picked it. */
  popularidad: number;
  /** Alternative accepted spellings/synonyms. */
  alias?: string[];
}

export interface ConsensusConfig {
  pregunta: string;
  respuestas: ConsensusAnswer[];
  /** Errors allowed before the round ends. */
  maxErrores: number;
}

export interface PalabraSecretaConfig {
  /** Topic shown to the player, e.g. "Frutas tropicales". */
  tema: string;
  /** The secret answer. May be a multi-word phrase. Must be one of `palabras`. */
  respuesta: string;
  /**
   * Curated list of words that belong to the theme. Guesses are restricted to
   * this list, and the "words between" count is measured within it.
   */
  palabras: string[];
  /** Ordered list of letter reveals offered as hints. */
  pistas?: string[];
}

export type GameConfig =
  | PalabraClaveConfig
  | ConsensusConfig
  | PalabraSecretaConfig;

/* ------------------------------- Entities -------------------------------- */

export interface Level<C extends GameConfig = GameConfig> {
  id: string; // short, used in /play/[id]
  gameSlug: GameSlug;
  title: string;
  status: LevelStatus;
  theme: Theme;
  config: C;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameMeta {
  slug: GameSlug;
  name: string;
  tagline: string;
  description: string;
  /** How to play, shown in a modal. */
  instructions: string[];
  accent: string;
}
