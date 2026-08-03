import { useEffect, useState } from "react";
import { normalize } from "@/lib/utils";
import { WORDS_ES } from "./words.es";

/* ----------------------------------------------------------------------------
   Diccionario español.

   La lista grande (public/dictionary-es.json, ~633k palabras) se carga en
   runtime con fetch para no inflar el bundle. Hasta que termina de cargar se
   usa la lista semilla bundleada (WORDS_ES) como fallback inmediato, así
   Palabra Secreta funciona desde el primer momento.

   Regenerar el JSON:  npm run build:dict:es
---------------------------------------------------------------------------- */

let wordSet = new Set(WORDS_ES.map(normalize));
let sorted = [...wordSet].sort((a, b) => a.localeCompare(b, "es"));
let loaded = false;
let loading: Promise<void> | null = null;

/** Carga la lista grande una sola vez (idempotente). Solo en cliente. */
export function ensureDictionary(): Promise<void> {
  if (loaded) return Promise.resolve();
  if (loading) return loading;
  if (typeof window === "undefined") return Promise.resolve();

  loading = fetch("/dictionary-es.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
    .then((list: string[]) => {
      wordSet = new Set(list);
      sorted = list; // ya viene ordenado por el script de build
      loaded = true;
    })
    .catch(() => {
      // Sin el JSON, seguimos con la lista semilla.
      loaded = true;
    });

  return loading;
}

/** Hook: dispara la carga y devuelve si el diccionario completo está listo. */
export function useDictionaryReady(): boolean {
  const [ready, setReady] = useState(loaded);
  useEffect(() => {
    if (loaded) {
      setReady(true);
      return;
    }
    let active = true;
    ensureDictionary().then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);
  return ready;
}

export function isWord(input: string): boolean {
  return wordSet.has(normalize(input));
}

export function wordsOfLength(len: number): string[] {
  return sorted.filter((w) => w.length === len);
}

/** Insertion index of a (possibly unknown) word in the sorted dictionary. */
function insertionIndex(word: string): number {
  const w = normalize(word);
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid].localeCompare(w, "es") < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Estimated number of dictionary positions between `guess` and `answer`
 * (0 sólo si son la misma palabra, 1 si son contiguas), plus the direction
 * the answer lies relative to the guess (alphabetically).
 */
export function distanceBetween(
  guess: string,
  answer: string,
): { distance: number; direction: "before" | "after" | "equal" } {
  const gi = insertionIndex(guess);
  const ai = insertionIndex(answer);
  const cmp = normalize(guess).localeCompare(normalize(answer), "es");
  if (cmp === 0) return { distance: 0, direction: "equal" };
  return {
    distance: Math.max(1, Math.abs(ai - gi)),
    direction: cmp < 0 ? "after" : "before",
  };
}

/** Tamaño actual del diccionario en memoria (semilla o completo). */
export function dictSize(): number {
  return sorted.length;
}
