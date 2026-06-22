/**
 * Genera public/dictionary-es.json a partir del paquete
 * `an-array-of-spanish-words` (~636k palabras). La app lo carga en runtime
 * (fetch) para validar intentos y calcular distancias, sin inflar el bundle JS.
 *
 * Reglas: pliega acentos y ñ→n, descarta lo que no sea alfabético y las
 * longitudes fuera de [2, 15]. Quita duplicados resultantes del plegado.
 *
 * Uso:  npm run build:dict:es
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const source = require("an-array-of-spanish-words");

const fold = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const words = new Set();
for (const raw of source) {
  const w = fold(raw);
  if (/^[a-z]{2,15}$/.test(w)) words.add(w);
}

const sorted = [...words].sort((a, b) => a.localeCompare(b, "es"));

mkdirSync("public", { recursive: true });
writeFileSync("public/dictionary-es.json", JSON.stringify(sorted));
console.log(`OK: ${sorted.length} palabras en public/dictionary-es.json`);
