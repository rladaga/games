"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
    >
      <LogOut size={16} /> Salir
    </button>
  );
}
