"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  AdivinaPersonajeConfig,
  AgilidadMentalConfig,
  ConsensusConfig,
  HechosHistoricosConfig,
  PalabraClaveConfig,
  PalabraSecretaConfig,
  RankingConfig,
  UnePalabrasConfig,
} from "@/lib/types";
import { normalize } from "@/lib/utils";
import {
  Field,
  TextInput,
  NumberInput,
  Toggle,
  TextArea,
  ColorInput,
} from "./fields";
import { ImageInput } from "./ImageInput";

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

/* -------------------------- Une Palabras ---------------------------------- */

export function UnePalabrasForm({
  config,
  onChange,
}: {
  config: UnePalabrasConfig;
  onChange: (c: UnePalabrasConfig) => void;
}) {
  const pares = config.pares ?? [];
  function setPar(i: number, patch: Partial<UnePalabrasConfig["pares"][number]>) {
    onChange({ ...config, pares: pares.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  }
  return (
    <div className="flex flex-col gap-4">
      <Field label="Título / consigna" hint="Opcional. Ej: Uní cada país con su capital.">
        <TextInput
          value={config.titulo ?? ""}
          onChange={(e) => onChange({ ...config, titulo: e.target.value })}
          placeholder="ej: Uní cada par"
        />
      </Field>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Pares a unir</span>
        {pares.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput
              value={p.izquierda}
              onChange={(e) => setPar(i, { izquierda: e.target.value })}
              placeholder="Izquierda"
            />
            <span className="shrink-0 text-[var(--muted)]">↔</span>
            <TextInput
              value={p.derecha}
              onChange={(e) => setPar(i, { derecha: e.target.value })}
              placeholder="Derecha"
            />
            <RemoveButton
              onClick={() =>
                onChange({ ...config, pares: pares.filter((_, idx) => idx !== i) })
              }
            />
          </div>
        ))}
        <AddButton
          label="Agregar par"
          onClick={() => onChange({ ...config, pares: [...pares, { izquierda: "", derecha: "" }] })}
        />
      </div>
    </div>
  );
}

/* ----------------------- Adivina el Personaje ----------------------------- */

export function AdivinaPersonajeForm({
  config,
  onChange,
}: {
  config: AdivinaPersonajeConfig;
  onChange: (c: AdivinaPersonajeConfig) => void;
}) {
  const pistas = config.pistas ?? [];
  return (
    <div className="flex flex-col gap-4">
      <Field label="Personaje (respuesta)">
        <TextInput
          value={config.respuesta}
          onChange={(e) => onChange({ ...config, respuesta: e.target.value })}
          placeholder="ej: Lionel Messi"
        />
      </Field>
      <Field label="Alias / variantes aceptadas" hint="Separados por coma. Ej: Messi, Leo Messi.">
        <TextInput
          value={(config.alias ?? []).join(", ")}
          onChange={(e) =>
            onChange({
              ...config,
              alias: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          placeholder="ej: Messi, Leo"
        />
      </Field>
      <Field
        label="Pistas (en orden, de vaga a obvia)"
        hint="Una por línea. La primera se muestra al empezar; las demás se piden de a una."
      >
        <TextArea
          value={pistas.join("\n")}
          onChange={(e) =>
            onChange({
              ...config,
              pistas: e.target.value.split("\n").map((s) => s.replace(/\s+$/, "")),
            })
          }
          placeholder={"Nació en Rosario\nJuega al fútbol\nGanó el Mundial 2022"}
        />
      </Field>
      <Field label="Intentos máximos">
        <NumberInput
          min={1}
          max={10}
          value={config.intentosMax}
          onChange={(e) => onChange({ ...config, intentosMax: Number(e.target.value) })}
        />
      </Field>
      <Field label="Imagen (se revela al terminar)" hint="Opcional.">
        <ImageInput
          value={config.imagenUrl}
          onChange={(url) => onChange({ ...config, imagenUrl: url })}
        />
      </Field>
    </div>
  );
}

/* ------------------------- Agilidad Mental -------------------------------- */

export function AgilidadMentalForm({
  config,
  onChange,
}: {
  config: AgilidadMentalConfig;
  onChange: (c: AgilidadMentalConfig) => void;
}) {
  const preguntas = config.preguntas ?? [];
  function setQ(i: number, patch: Partial<AgilidadMentalConfig["preguntas"][number]>) {
    onChange({
      ...config,
      preguntas: preguntas.map((q, idx) => (idx === i ? { ...q, ...patch } : q)),
    });
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Segundos por pregunta">
          <NumberInput
            min={2}
            max={60}
            value={config.segundosPorPregunta}
            onChange={(e) => onChange({ ...config, segundosPorPregunta: Number(e.target.value) })}
          />
        </Field>
        <Field label="Vidas">
          <NumberInput
            min={1}
            max={10}
            value={config.vidas}
            onChange={(e) => onChange({ ...config, vidas: Number(e.target.value) })}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold">Preguntas</span>
        {preguntas.map((q, i) => {
          const opciones = q.opciones ?? [];
          return (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3"
            >
              <div className="flex items-start gap-2">
                <TextInput
                  value={q.prompt}
                  onChange={(e) => setQ(i, { prompt: e.target.value })}
                  placeholder="Pregunta. Ej: ¿Cuál es el color de la palabra?"
                />
                <RemoveButton
                  onClick={() =>
                    onChange({
                      ...config,
                      preguntas: preguntas.filter((_, idx) => idx !== i),
                    })
                  }
                />
              </div>

              {/* Estímulo opcional (palabra grande de color) */}
              <div className="flex items-center gap-2">
                <TextInput
                  value={q.stimulus?.texto ?? ""}
                  onChange={(e) =>
                    setQ(i, {
                      stimulus: { texto: e.target.value, color: q.stimulus?.color },
                    })
                  }
                  placeholder="Estímulo opcional (palabra grande)"
                  className="text-sm"
                />
                <div className="w-40 shrink-0">
                  <ColorInput
                    value={q.stimulus?.color ?? ""}
                    onChange={(color) =>
                      setQ(i, { stimulus: { texto: q.stimulus?.texto ?? "", color } })
                    }
                  />
                </div>
              </div>

              {/* Opciones con radio de correcta */}
              <div className="flex flex-col gap-1.5">
                {opciones.map((op, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correcta-${i}`}
                      checked={q.correcta === j}
                      onChange={() => setQ(i, { correcta: j })}
                      className="h-4 w-4 shrink-0 accent-[var(--brand)]"
                      aria-label="Marcar como correcta"
                    />
                    <TextInput
                      value={op}
                      onChange={(e) =>
                        setQ(i, {
                          opciones: opciones.map((o, idx) => (idx === j ? e.target.value : o)),
                        })
                      }
                      placeholder={`Opción ${j + 1}`}
                      className="text-sm"
                    />
                    <RemoveButton
                      onClick={() =>
                        setQ(i, {
                          opciones: opciones.filter((_, idx) => idx !== j),
                          correcta: q.correcta >= opciones.length - 1 ? 0 : q.correcta,
                        })
                      }
                    />
                  </div>
                ))}
                <AddButton
                  small
                  label="Agregar opción"
                  onClick={() => setQ(i, { opciones: [...opciones, ""] })}
                />
              </div>
            </div>
          );
        })}
        <AddButton
          label="Agregar pregunta"
          onClick={() =>
            onChange({
              ...config,
              preguntas: [...preguntas, { prompt: "", opciones: ["", ""], correcta: 0 }],
            })
          }
        />
      </div>
    </div>
  );
}

/* ------------------------ Hechos Históricos ------------------------------- */

export function HechosHistoricosForm({
  config,
  onChange,
}: {
  config: HechosHistoricosConfig;
  onChange: (c: HechosHistoricosConfig) => void;
}) {
  const eventos = config.eventos ?? [];
  function setEv(i: number, patch: Partial<HechosHistoricosConfig["eventos"][number]>) {
    onChange({
      ...config,
      eventos: eventos.map((ev, idx) => (idx === i ? { ...ev, ...patch } : ev)),
    });
  }
  return (
    <div className="flex flex-col gap-4">
      <Field label="Título / consigna" hint="Opcional.">
        <TextInput
          value={config.titulo ?? ""}
          onChange={(e) => onChange({ ...config, titulo: e.target.value })}
          placeholder="ej: Ordená estos inventos"
        />
      </Field>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">
          Eventos
          <span className="ml-2 font-normal text-[var(--muted)]">
            (el jugador arrastra cada imagen a su año)
          </span>
        </span>
        {eventos.map((ev, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
            <div className="flex items-center gap-2">
              <TextInput
                value={ev.texto}
                onChange={(e) => setEv(i, { texto: e.target.value })}
                placeholder="Nombre del evento (ej: Llegada a América)"
              />
              <div className="w-24 shrink-0">
                <NumberInput
                  value={ev.anio}
                  onChange={(e) => setEv(i, { anio: Number(e.target.value) })}
                  placeholder="Año"
                />
              </div>
              <RemoveButton
                onClick={() =>
                  onChange({ ...config, eventos: eventos.filter((_, idx) => idx !== i) })
                }
              />
            </div>
            <ImageInput
              value={ev.imagenUrl}
              onChange={(url) => setEv(i, { imagenUrl: url })}
            />
          </div>
        ))}
        <AddButton
          label="Agregar evento"
          onClick={() =>
            onChange({ ...config, eventos: [...eventos, { texto: "", anio: 0, imagenUrl: null }] })
          }
        />
      </div>
    </div>
  );
}

/* ----------------------------- Ranking ------------------------------------ */

export function RankingForm({
  config,
  onChange,
}: {
  config: RankingConfig;
  onChange: (c: RankingConfig) => void;
}) {
  const items = config.items ?? [];
  function setItem(i: number, patch: Partial<RankingConfig["items"][number]>) {
    onChange({ ...config, items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  }
  return (
    <div className="flex flex-col gap-4">
      <Field label="Título" hint="Ej: Top mejores series.">
        <TextInput
          value={config.titulo}
          onChange={(e) => onChange({ ...config, titulo: e.target.value })}
          placeholder="ej: Top 10 mejores series"
        />
      </Field>
      <Toggle
        label="Orden de aparición aleatorio"
        checked={config.aleatorio ?? false}
        onChange={(v) => onChange({ ...config, aleatorio: v })}
      />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">
          Elementos
          <span className="ml-2 font-normal text-[var(--muted)]">
            (aparecen de a uno; el ranking tiene {items.length} posiciones)
          </span>
        </span>
        {items.map((it, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
            <div className="flex items-center gap-2">
              <TextInput
                value={it.texto}
                onChange={(e) => setItem(i, { texto: e.target.value })}
                placeholder="Elemento"
              />
              <RemoveButton
                onClick={() =>
                  onChange({ ...config, items: items.filter((_, idx) => idx !== i) })
                }
              />
            </div>
            <ImageInput value={it.imagenUrl} onChange={(url) => setItem(i, { imagenUrl: url })} />
          </div>
        ))}
        <AddButton
          label="Agregar elemento"
          onClick={() => onChange({ ...config, items: [...items, { texto: "", imagenUrl: null }] })}
        />
        <p className="text-xs text-[var(--muted)]">
          Es un ranking subjetivo: no hay respuesta correcta ni puntaje. Cada quien arma su top.
        </p>
      </div>
    </div>
  );
}

/* ------------------------- Shared list controls --------------------------- */

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[var(--muted)] hover:text-[var(--bad)]"
    >
      <Trash2 size={16} />
    </button>
  );
}

function AddButton({
  label,
  onClick,
  small,
}: {
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] font-semibold text-[var(--muted)] hover:text-[var(--text)] ${
        small ? "py-1.5 text-xs" : "py-2.5 text-sm"
      }`}
    >
      <Plus size={small ? 14 : 16} /> {label}
    </button>
  );
}
