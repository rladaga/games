"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      router.push(next);
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      router.push(next);
      router.refresh();
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-sm p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]">
            <LogIn size={22} />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold">
            Acceso al admin
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {configured
              ? "Ingresá con tu cuenta."
              : "Modo local: entrá sin credenciales."}
          </p>
        </div>

        {configured && (
          <div className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 outline-none focus:border-[var(--brand)]"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 outline-none focus:border-[var(--brand)]"
            />
          </div>
        )}

        {error && <p className="mt-3 text-sm text-[var(--bad)]">{error}</p>}

        <Button type="submit" className="mt-5 w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
