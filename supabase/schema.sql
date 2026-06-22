-- ============================================================================
-- Plataforma de Juegos — esquema Supabase
-- Ejecutar en el SQL Editor del proyecto (o vía `supabase db push`).
-- ============================================================================

-- Niveles ---------------------------------------------------------------------
create table if not exists public.levels (
  id          text primary key,                 -- slug corto usado en /play/[id]
  game_slug   text not null
              check (game_slug in ('palabra-secreta', 'consensus', 'palabra-clave')),
  title       text not null default 'Nuevo nivel',
  status      text not null default 'draft'
              check (status in ('draft', 'published')),
  theme       jsonb not null default '{}'::jsonb,
  config      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists levels_game_slug_idx on public.levels (game_slug);
create index if not exists levels_status_idx on public.levels (status);

-- Perfiles (rol admin) --------------------------------------------------------
create table if not exists public.profiles (
  id    uuid primary key references auth.users (id) on delete cascade,
  email text,
  role  text not null default 'admin'
);

-- Al registrarse un usuario, crear su perfil automáticamente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security ----------------------------------------------------------
alter table public.levels enable row level security;
alter table public.profiles enable row level security;

-- Lectura pública SOLO de niveles publicados (para los links compartibles).
drop policy if exists "public reads published levels" on public.levels;
create policy "public reads published levels"
  on public.levels for select
  using (status = 'published');

-- Usuarios autenticados (admins) tienen acceso total.
drop policy if exists "admins manage levels" on public.levels;
create policy "admins manage levels"
  on public.levels for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Storage: assets de marca (logos, fondos) -----------------------------------
insert into storage.buckets (id, name, public)
values ('brand', 'brand', true)
on conflict (id) do nothing;

drop policy if exists "public reads brand assets" on storage.objects;
create policy "public reads brand assets"
  on storage.objects for select
  using (bucket_id = 'brand');

drop policy if exists "admins upload brand assets" on storage.objects;
create policy "admins upload brand assets"
  on storage.objects for insert
  with check (bucket_id = 'brand' and auth.role() = 'authenticated');

drop policy if exists "admins update brand assets" on storage.objects;
create policy "admins update brand assets"
  on storage.objects for update
  using (bucket_id = 'brand' and auth.role() = 'authenticated');

drop policy if exists "admins delete brand assets" on storage.objects;
create policy "admins delete brand assets"
  on storage.objects for delete
  using (bucket_id = 'brand' and auth.role() = 'authenticated');
