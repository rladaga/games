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
    case "une-palabras":
      return {
        titulo: "",
        pares: [
          { izquierda: "", derecha: "" },
          { izquierda: "", derecha: "" },
        ],
      };
    case "adivina-personaje":
      return {
        respuesta: "",
        alias: [],
        pistas: ["", ""],
        intentosMax: 5,
        imagenUrl: null,
      };
    case "agilidad-mental":
      return {
        preguntas: [{ prompt: "", opciones: ["", ""], correcta: 0 }],
        segundosPorPregunta: 8,
        vidas: 3,
      };
    case "hechos-historicos":
      return {
        titulo: "",
        eventos: [
          { texto: "", anio: 0 },
          { texto: "", anio: 0 },
        ],
      };
    case "ranking":
      return {
        titulo: "",
        items: [
          { texto: "", imagenUrl: null },
          { texto: "", imagenUrl: null },
        ],
        aleatorio: false,
      };
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
