import type { GameSlug, GameConfig, Level } from "./types";
import { GAMES } from "./games";
import { DEFAULT_THEME } from "./theme";
import { shortId } from "./utils";

export function blankConfig(game: GameSlug): GameConfig {
  switch (game) {
    case "palabra-clave":
      return {
        solucion: "",
        intentosMax: 6,
        validarDiccionario: true,
        palabrasExtra: [],
      };
    case "consensus":
      return {
        pregunta: "",
        maxErrores: 4,
        respuestas: [{ texto: "", popularidad: 0, alias: [] }],
      };
    case "palabra-secreta":
      return { tema: "", respuesta: "", palabras: [], pistas: [] };
  }
}

export function blankLevel(game: GameSlug): Level {
  return {
    id: shortId(),
    gameSlug: game,
    title: `Nuevo nivel — ${GAMES[game].name}`,
    status: "draft",
    theme: { ...DEFAULT_THEME },
    config: blankConfig(game),
  };
}
