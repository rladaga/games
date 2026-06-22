/**
 * Genera src/lib/dictionary/words.es.ts a partir de un archivo fuente de
 * palabras (una por línea). Útil para reemplazar la lista semilla por un
 * diccionario español completo.
 *
 * Uso:
 *   node scripts/build-dict.mjs ruta/al/lemario.txt
 *
 * Reglas: pasa todo a minúscula, pliega acentos y ñ→n, descarta palabras con
 * caracteres no alfabéticos, las muy cortas/largas y los duplicados. No filtra
 * nombres propios automáticamente: usá una fuente que ya los excluya o que
 * venga en minúscula.
 */
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("Falta la ruta al archivo fuente.");
  process.exit(1);
}

const fold = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const words = new Set();
for (const raw of readFileSync(src, "utf8").split(/\r?\n/)) {
  const w = fold(raw);
  if (/^[a-z]{2,15}$/.test(w)) words.add(w);
}

const sorted = [...words].sort((a, b) => a.localeCompare(b, "es"));
const lines = [];
for (let i = 0; i < sorted.length; i += 12) {
  lines.push("  " + sorted.slice(i, i + 12).map((w) => `"${w}"`).join(","));
}

const out = `// Generado por scripts/build-dict.mjs — ${sorted.length} palabras.
export const WORDS_ES: string[] = [
${lines.join(",\n")},
];
`;

writeFileSync("src/lib/dictionary/words.es.ts", out);
console.log(`OK: ${sorted.length} palabras escritas en src/lib/dictionary/words.es.ts`);
