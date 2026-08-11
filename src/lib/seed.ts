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
  {
    id: "demo-une",
    gameSlug: "une-palabras",
    title: "Une Palabras — Demo",
    status: "published",
    theme: { brandColor: "#3b82f6", accentColor: "#93c5fd", showTitle: true },
    config: {
      titulo: "Uní cada país con su capital",
      pares: [
        { izquierda: "Argentina", derecha: "Buenos Aires" },
        { izquierda: "Francia", derecha: "París" },
        { izquierda: "Japón", derecha: "Tokio" },
        { izquierda: "Egipto", derecha: "El Cairo" },
        { izquierda: "Perú", derecha: "Lima" },
      ],
    },
  },
  {
    id: "demo-personaje",
    gameSlug: "adivina-personaje",
    title: "Adivina el Personaje — Demo",
    status: "published",
    theme: { brandColor: "#ec4899", accentColor: "#f9a8d4", showTitle: true },
    config: {
      respuesta: "Lionel Messi",
      alias: ["Messi", "Leo Messi", "Leo"],
      pistas: [
        "Nació en Rosario, Argentina.",
        "Es deportista profesional.",
        "Juega al fútbol como delantero.",
        "Ganó la Copa del Mundo en 2022.",
        "Usó la camiseta número 10 de la Selección.",
      ],
      intentosMax: 5,
      imagenUrl: null,
    },
  },
  {
    id: "demo-agilidad",
    gameSlug: "agilidad-mental",
    title: "Agilidad Mental — Demo",
    status: "published",
    theme: { brandColor: "#22c55e", accentColor: "#86efac", showTitle: true },
    config: {
      segundosPorPregunta: 8,
      vidas: 3,
      preguntas: [
        {
          prompt: "¿Cuál es el color de la palabra?",
          stimulus: { texto: "ROJO", color: "#ec4899" },
          opciones: ["Naranja", "Rojo", "Rosa"],
          correcta: 2,
        },
        {
          prompt: "¿Cuánto es 7 × 6?",
          opciones: ["36", "42", "48"],
          correcta: 1,
        },
        {
          prompt: "¿Cuál es el color de la palabra?",
          stimulus: { texto: "VERDE", color: "#3b82f6" },
          opciones: ["Verde", "Azul", "Violeta"],
          correcta: 1,
        },
        {
          prompt: "¿En qué río está la ciudad de Rosario?",
          opciones: [],
          correcta: 0,
          respuesta: "Paraná",
          alias: ["Río Paraná"],
        },
      ],
    },
  },
  {
    id: "demo-hechos",
    gameSlug: "hechos-historicos",
    title: "Hechos Históricos — Demo",
    status: "published",
    theme: { brandColor: "#eab308", accentColor: "#fde047", showTitle: true },
    config: {
      titulo: "Ubicá cada invento en su año",
      eventos: [
        { texto: "Imprenta de Gutenberg", anio: 1440, imagenUrl: null },
        { texto: "Máquina de vapor", anio: 1769, imagenUrl: null },
        { texto: "Teléfono", anio: 1876, imagenUrl: null },
        { texto: "Primer avión", anio: 1903, imagenUrl: null },
        { texto: "World Wide Web", anio: 1989, imagenUrl: null },
      ],
    },
  },
  {
    id: "demo-ranking",
    gameSlug: "ranking",
    title: "Ranking — Demo",
    status: "published",
    theme: { brandColor: "#f97316", accentColor: "#fdba74", showTitle: true },
    config: {
      titulo: "Armá tu top de comidas",
      aleatorio: true,
      items: [
        { texto: "Pizza" },
        { texto: "Asado" },
        { texto: "Sushi" },
        { texto: "Hamburguesa" },
        { texto: "Empanadas" },
      ],
    },
  },
];
