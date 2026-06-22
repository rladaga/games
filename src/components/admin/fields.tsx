"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 text-[var(--text)] outline-none focus:border-[var(--brand)]";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3 text-[var(--text)] outline-none focus:border-[var(--brand)]",
        props.className,
      )}
    />
  );
}

export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Normalize on blur: accept "fff" / "7c5cff" and prepend # automatically.
  function normalizeHex() {
    const v = value.trim();
    if (/^[0-9a-fA-F]{3,8}$/.test(v)) onChange(`#${v.toLowerCase()}`);
    else if (/^#[0-9a-fA-F]{3,8}$/.test(v)) onChange(v.toLowerCase());
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-10 w-10 shrink-0 rounded-lg border border-[var(--border)]"
        style={{ background: value || "transparent" }}
        aria-hidden
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={normalizeHex}
        placeholder="#7c5cff"
        spellCheck={false}
        className={cn(inputClass, "font-mono text-sm uppercase")}
      />
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[var(--brand)]" : "bg-[var(--border)]",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
