import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      {!isSupabaseConfigured() && (
        <div className="bg-[var(--accent)]/15 px-4 py-2 text-center text-xs font-medium text-[var(--accent)]">
          Modo local (sin Supabase): los cambios viven en memoria y se reinician
          al reiniciar el servidor. Configurá <code>.env.local</code> para
          persistir.
        </div>
      )}
      {children}
    </div>
  );
}
