"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TextInput } from "./fields";
import { shortId } from "@/lib/utils";

export function ImageInput({
  value,
  onChange,
  minHeight,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  /** Warn when the image is shorter than this (px). Vector files are exempt. */
  minHeight?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const isVector = !!value && /\.svg($|\?)/i.test(value);
  const lowRes = !!minHeight && !isVector && !!size && size.h < minHeight;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isSupabaseConfigured()) {
      setError("Configurá Supabase para subir archivos. Por ahora pegá una URL.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createClient();
    const path = `${shortId(8)}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage.from("brand").upload(path, file, {
      upsert: true,
    });
    if (error) {
      setError(error.message);
    } else {
      const { data } = supabase.storage.from("brand").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={value}
            src={value}
            alt="preview"
            onLoad={(e) =>
              setSize({
                w: e.currentTarget.naturalWidth,
                h: e.currentTarget.naturalHeight,
              })
            }
            className="h-10 w-16 rounded object-contain"
          />
          <span className="flex-1 truncate text-xs text-[var(--muted)]">
            {size && !isVector ? `${size.w}×${size.h} px — ` : ""}
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="grid h-7 w-7 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--bad)]"
          >
            <X size={15} />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <TextInput
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="Pegá una URL…"
        />
        <label className="flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 text-sm font-semibold hover:bg-white/5">
          <Upload size={15} />
          {uploading ? "Subiendo…" : "Subir"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      </div>
      {lowRes && (
        <span className="text-xs text-[var(--warn)]">
          ⚠ La imagen tiene {size!.h} px de alto: se va a ver borrosa o chica.
          Usá una de al menos {minHeight} px de alto (o un SVG).
        </span>
      )}
      {error && <span className="text-xs text-[var(--bad)]">{error}</span>}
    </div>
  );
}
