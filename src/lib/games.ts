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
  "une-palabras": {
    slug: "une-palabras",
    name: "Une Palabras",
    tagline: "Conectá cada par",
    description:
      "Uní cada elemento de la izquierda con su par de la derecha. Ideal para asociar conceptos, definiciones, países y capitales, y más.",
    instructions: [
      "Tocá un elemento de la izquierda y luego su par de la derecha.",
      "Si la conexión es correcta, el par queda fijado.",
      "Si te equivocás, suma un error e intentás de nuevo.",
      "Ganás cuando uniste todos los pares.",
    ],
    accent: "#3b82f6",
  },
  "adivina-personaje": {
    slug: "adivina-personaje",
    name: "Adivina el Personaje",
    tagline: "Descubrí de quién se trata",
    description:
      "Adiviná el personaje con la menor cantidad de pistas posible. Cada pista nueva te acerca, pero baja tu puntaje.",
    instructions: [
      "Leé la primera pista e intentá adivinar el personaje.",
      "Si no sabés, pedí otra pista (cada vez son más reveladoras).",
      "Tenés un número limitado de intentos.",
      "Cuantas menos pistas uses, mejor.",
    ],
    accent: "#ec4899",
  },
  "agilidad-mental": {
    slug: "agilidad-mental",
    name: "Agilidad Mental",
    tagline: "Respondé contra el reloj",
    description:
      "Quiz de respuesta rápida: cada pregunta tiene un tiempo límite. Acertá la mayor cantidad antes de quedarte sin vidas.",
    instructions: [
      "Cada pregunta tiene un tiempo límite que se agota.",
      "Tocá la opción correcta antes de que termine el tiempo.",
      "Si fallás o se acaba el tiempo, perdés una vida.",
      "El juego termina al quedarte sin vidas o al responder todas.",
    ],
    accent: "#22c55e",
  },
  "hechos-historicos": {
    slug: "hechos-historicos",
    name: "Hechos Históricos",
    tagline: "Ordená la línea de tiempo",
    description:
      "Ordená los eventos del más antiguo al más reciente. Cuando creas tenerlos en orden, comprobá tu línea de tiempo.",
    instructions: [
      "Mové los eventos con las flechas para ordenarlos cronológicamente.",
      "Arriba el más antiguo, abajo el más reciente.",
      "Tocá «Comprobar» para ver tu resultado.",
      "Los aciertos se pintan de verde y se revela cada año.",
    ],
    accent: "#eab308",
  },
  ranking: {
    slug: "ranking",
    name: "Ranking",
    tagline: "Armá tu top sin arrepentirte",
    description:
      "Estilo tier list: te aparece un elemento a la vez y tenés que ubicarlo en una posición del ranking. Una vez puesto, no se puede mover.",
    instructions: [
      "Aparece un elemento a la vez.",
      "Tocá la posición del ranking donde querés ubicarlo.",
      "¡Cuidado! Una vez ubicado no se puede cambiar.",
      "Seguí hasta completar todas las posiciones.",
    ],
    accent: "#f97316",
  },
};

export const GAME_LIST = Object.values(GAMES);

export function getGame(slug: string): GameMeta | undefined {
  return GAMES[slug as GameSlug];
}
