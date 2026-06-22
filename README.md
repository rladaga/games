# Plataforma de Juegos para Streaming

Plataforma de puzzles (web + mobile) pensada para contenido de marcas en un
canal de streaming. El juego es **local** (se comparte pantalla y juega un
conductor): no hay multijugador online. Cada juego tiene **niveles**
configurables desde un admin —palabras, colores, logo y fondo— y cada nivel se
comparte con su propio link.

## Juegos

| Juego | Descripción |
|------|-------------|
| **Palabra Secreta** | Descubrí la palabra del tema. Los intentos se ordenan alfabéticamente; flechas, números y colores indican qué tan cerca estás. |
| **Consensus** | Adiviná las respuestas más populares de una pregunta de opinión. |
| **Palabra Clave** | Estilo Wordle: descubrí la contraseña probando palabras del mismo largo. |

> Para sumar un juego nuevo: agregá su entrada en `src/lib/games.ts`, un tipo de
> config en `src/lib/types.ts`, su componente en `src/components/games/` y
> enchufalo en `GameShell`, `LevelEditor` y `ConfigForms`.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + componentes propios
- **Supabase** (Postgres + Auth + Storage) — opcional en desarrollo

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

Sin configurar Supabase, la app corre en **modo local**: usa datos de ejemplo
(`src/lib/seed.ts`) en memoria, y el admin es accesible sin login. Ideal para
probar rápido.

### Conectar Supabase (persistencia real)

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Ejecutá `supabase/schema.sql` en el **SQL Editor** (crea tablas, RLS,
   trigger de perfiles y el bucket `brand` para logos/fondos).
3. Copiá `.env.example` a `.env.local` y completá:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. Creá un usuario admin en **Authentication → Users** (o habilitá signups).
5. Reiniciá `npm run dev`. Ahora `/admin` pide login y los cambios persisten.

## Estructura

```
src/
  app/
    page.tsx                 landing con los niveles publicados
    play/[levelId]/          render público de un nivel (con su theme)
    admin/                   login, dashboard, editor (new/edit), server actions
  components/
    games/                   motor de cada juego + teclado + resultado
    admin/                   editor, formularios, theme editor, uploads
    ui/                      Button, Modal
  lib/
    data.ts                  acceso a datos (Supabase o store en memoria)
    games.ts  types.ts  theme.ts  defaults.ts  seed.ts
    dictionary/              diccionario español + utilidades
    supabase/                clients (browser/server/proxy) + config
  proxy.ts                   refresca sesión y protege /admin
supabase/schema.sql          esquema + RLS + storage
scripts/build-dict.mjs       genera un diccionario grande desde un archivo fuente
```

## Cómo se usa (flujo del operador)

1. Entrá a `/admin`.
2. Elegí un juego y creá un **nuevo nivel**.
3. En **Contenido** cargá las palabras/preguntas; en **Apariencia** el logo,
   fondo y colores de la marca. La **vista previa** se actualiza en vivo.
4. Marcá el nivel como **Publicado** y **Guardá**.
5. Copiá el **link** del nivel y compartilo/abrilo en la pantalla del stream.

## Diccionario

`src/lib/dictionary/words.es.ts` trae una lista semilla curada. Para producción,
reemplazala por un lemario español completo:

```bash
node scripts/build-dict.mjs ruta/al/lemario.txt
```

## Deploy

Pensado para **Vercel**. Configurá las variables `NEXT_PUBLIC_SUPABASE_*` en el
proyecto y conectá el repo. El build es `npm run build`.
