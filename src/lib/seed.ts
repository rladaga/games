import type { Level } from "./types";

/** Example levels so the app is playable before Supabase is configured. */
export const SEED_LEVELS: Level[] = [
  {
    id: "demo-clave",
    gameSlug: "palabra-clave",
    title: "Palabra Clave — Demo",
    status: "published",
    theme: { showTitle: true },
    config: {
      solucion: "marca",
      intentosMax: 6,
      validarDiccionario: true,
    },
  },
  {
    id: "demo-consensus",
    gameSlug: "consensus",
    title: "Consensus — Demo",
    status: "published",
    theme: { brandColor: "#23c2a8", accentColor: "#7CF5DE", showTitle: true },
    config: {
      pregunta: "Nombrá una bebida que se toma en el desayuno",
      maxErrores: 4,
      respuestas: [
        { texto: "café", popularidad: 42, alias: ["cafe"] },
        { texto: "leche", popularidad: 24 },
        { texto: "jugo", popularidad: 14, alias: ["zumo", "jugo de naranja"] },
        { texto: "té", popularidad: 12, alias: ["te"] },
        { texto: "mate", popularidad: 8 },
      ],
    },
  },
  {
    id: "demo-secreta",
    gameSlug: "palabra-secreta",
    title: "Palabra Secreta — Demo",
    status: "published",
    theme: { brandColor: "#7c5cff", accentColor: "#ffd166", showTitle: true },
    config: {
      tema: "Frutas",
      respuesta: "naranja",
      palabras: [
        "ananá", "arándano", "banana", "cereza", "ciruela", "damasco",
        "durazno", "frambuesa", "frutilla", "granada", "higo", "kiwi",
        "lima", "limón", "mandarina", "mango", "manzana", "melón",
        "naranja", "papaya", "pera", "pomelo", "sandía", "uva",
      ],
      pistas: ["n", "a", "r"],
    },
  },
];
