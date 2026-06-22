"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  ConsensusConfig,
  PalabraClaveConfig,
  PalabraSecretaConfig,
} from "@/lib/types";
import { normalize } from "@/lib/utils";
import { Field, TextInput, NumberInput, Toggle, TextArea } from "./fields";

export function PalabraClaveForm({
  config,
  onChange,
}: {
  config: PalabraClaveConfig;
  onChange: (c: PalabraClaveConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Palabra solución"
        hint={`Define el tamaño del tablero (${config.solucion.length || 0} letras). Sin acentos/ñ.`}
      >
        <TextInput
          value={config.solucion}
          onChange={(e) =>
            onChange({ ...config, solucion: e.target.value.toLowerCase() })
          }
          placeholder="ej: marca"
        />
      </Field>
      <Field label="Intentos máximos">
        <NumberInput
          min={1}
          max={12}
          value={config.intentosMax}
          onChange={(e) =>
            onChange({ ...config, intentosMax: Number(e.target.value) })
          }
        />
      </Field>
      <Toggle
        label="Validar contra diccionario"
        checked={config.validarDiccionario}
        onChange={(v) => onChange({ ...config, validarDiccionario: v })}
      />
      <Field
        label="Palabras adicionales aceptadas"
        hint="Separadas por coma. La solución ya se acepta siempre. Útil para palabras de marca que no están en el diccionario."
      >
        <TextInput
          value={(config.palabrasExtra ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              ...config,
              palabrasExtra: e.target.value
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean),
            })
          }
          placeholder="ej: visa, mastercard"
        />
      </Field>
    </div>
  );
}

export function PalabraSecretaForm({
  config,
  onChange,
}: {
  config: PalabraSecretaConfig;
  onChange: (c: PalabraSecretaConfig) => void;
}) {
  const palabras = config.palabras ?? [];
  const palabrasNorm = palabras.map(normalize).filter(Boolean);
  const answerNorm = normalize(config.respuesta);
  const answerInList = !answerNorm || palabrasNorm.includes(answerNorm);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Tema" hint="Lo que ve el jugador, ej: Frutas tropicales.">
        <TextInput
          value={config.tema}
          onChange={(e) => onChange({ ...config, tema: e.target.value })}
          placeholder="ej: Frutas"
        />
      </Field>

      <Field
        label="Palabras del tema"
        hint={`Una por línea (o separadas por coma). Solo se podrán tipear estas palabras, y la distancia se mide entre ellas. ${palabrasNorm.length} palabra(s) cargada(s).`}
      >
        <TextArea
          value={palabras.join("\n")}
          onChange={(e) =>
            onChange({
              ...config,
              palabras: e.target.value
                .split(/[\n,]/)
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder={"naranja\nbanana\nmanzana\nfrutilla\nkiwi\nmelon"}
        />
      </Field>

      <Field
        label="Respuesta secreta"
        hint="Puede ser una frase de varias palabras. Debe estar en la lista de arriba."
      >
        <TextInput
          value={config.respuesta}
          onChange={(e) => onChange({ ...config, respuesta: e.target.value })}
          placeholder="ej: naranja"
        />
      </Field>
      {!answerInList && (
        <p className="-mt-2 text-xs font-medium text-[var(--warn)]">
          ⚠ La respuesta no está en la lista de palabras del tema. Agregala para
          que el juego funcione bien (por ahora se incluye automáticamente).
        </p>
      )}
      <Field
        label="Pistas (letras a revelar, en orden)"
        hint="Opcional. Separá por coma. Si está vacío se revelan letras de la respuesta."
      >
        <TextInput
          value={(config.pistas ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              ...config,
              pistas: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="n, a, r"
        />
      </Field>
    </div>
  );
}

export function ConsensusForm({
  config,
  onChange,
}: {
  config: ConsensusConfig;
  onChange: (c: ConsensusConfig) => void;
}) {
  function setAnswer(i: number, patch: Partial<ConsensusConfig["respuestas"][number]>) {
    onChange({
      ...config,
      respuestas: config.respuestas.map((a, idx) =>
        idx === i ? { ...a, ...patch } : a,
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Pregunta">
        <TextInput
          value={config.pregunta}
          onChange={(e) => onChange({ ...config, pregunta: e.target.value })}
          placeholder="ej: Nombrá una bebida del desayuno"
        />
      </Field>
      <Field label="Errores permitidos">
        <NumberInput
          min={1}
          max={10}
          value={config.maxErrores}
          onChange={(e) =>
            onChange({ ...config, maxErrores: Number(e.target.value) })
          }
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Respuestas populares</span>
        {config.respuestas.map((a, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3"
          >
            <div className="flex gap-2">
              <TextInput
                value={a.texto}
                onChange={(e) => setAnswer(i, { texto: e.target.value })}
                placeholder="Respuesta"
              />
              <div className="flex w-24 shrink-0 items-center gap-1">
                <NumberInput
                  min={0}
                  max={100}
                  value={a.popularidad}
                  onChange={(e) =>
                    setAnswer(i, { popularidad: Number(e.target.value) })
                  }
                />
                <span className="text-sm text-[var(--muted)]">%</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    respuestas: config.respuestas.filter((_, idx) => idx !== i),
                  })
                }
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[var(--muted)] hover:text-[var(--bad)]"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <TextInput
              value={(a.alias ?? []).join(", ")}
              onChange={(e) =>
                setAnswer(i, {
                  alias: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Alias / sinónimos (coma)"
              className="text-sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...config,
              respuestas: [
                ...config.respuestas,
                { texto: "", popularidad: 0, alias: [] },
              ],
            })
          }
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)]"
        >
          <Plus size={16} /> Agregar respuesta
        </button>
      </div>
    </div>
  );
}
