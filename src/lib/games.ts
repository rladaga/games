import type { GameMeta, GameSlug } from "./types";

export const GAMES: Record<GameSlug, GameMeta> = {
  "palabra-secreta": {
    slug: "palabra-secreta",
    name: "Palabra Secreta",
    tagline: "Descubrí la palabra del tema",
    description:
      "Adiviná la palabra secreta relacionada con el tema. Tus intentos se ordenan alfabéticamente y las pistas te dicen qué tan cerca estás.",
    instructions: [
      "Escribí una palabra que encaje con el tema. Algunas respuestas son frases de varias palabras.",
      "Tus intentos aparecen en orden alfabético: usalos para orientar el siguiente.",
      "La flecha indica si la respuesta va antes o después de tu intento.",
      "El número indica cuántas palabras hay entre tu intento y la correcta.",
      "El color indica qué tan cerca estás.",
      "El teclado oscurece las letras que no pueden empezar la palabra.",
      "¿Te atascás? Usá una pista para descubrir una letra correcta.",
    ],
    accent: "#7c5cff",
  },
  consensus: {
    slug: "consensus",
    name: "Consensus",
    tagline: "Adiviná las respuestas más populares",
    description:
      "Cada puzzle plantea una pregunta de opinión. Encontrá las respuestas más votadas por la comunidad.",
    instructions: [
      "Respondé tratando de adivinar las opciones más elegidas por la comunidad.",
      "Si acertás, se muestra la respuesta y qué tan popular es.",
      "Cada intento que no esté entre las respuestas cuenta como error.",
      "Al errar se van revelando letras de las respuestas que faltan.",
    ],
    accent: "#23c2a8",
  },
  "palabra-clave": {
    slug: "palabra-clave",
    name: "Palabra Clave",
    tagline: "Encontrá la contraseña oculta",
    description:
      "Estilo Wordle: descubrí la palabra secreta probando palabras del mismo largo que el tablero.",
    instructions: [
      "Escribí una palabra con el mismo número de letras que el tablero.",
      "No se aceptan nombres propios.",
      "Verde: la letra está en la posición correcta.",
      "Amarillo: la letra está en la palabra, pero en otra posición.",
      "Gris: la letra no está en la palabra.",
      "Cada intento cuenta.",
    ],
    accent: "#f4a23b",
  },
};

export const GAME_LIST = Object.values(GAMES);

export function getGame(slug: string): GameMeta | undefined {
  return GAMES[slug as GameSlug];
}
