-- Mers (Glimmers y Dimmers) — esquema de base de datos para Supabase.
-- Ejecutar una vez en el SQL Editor del proyecto de Supabase.

create extension if not exists pgcrypto;

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  avatar_emoji text not null default '✨',
  avatar_color text not null default '#a85c14',
  pin_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  entry_date date not null,
  glimmer_text text not null,
  dimmer_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_id, entry_date)
);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  reactor_person_id uuid not null references people(id) on delete cascade,
  emoji text not null check (emoji in ('❤️', '🌱', '😲', '👏')),
  created_at timestamptz not null default now(),
  unique (entry_id, reactor_person_id, emoji)
);

create index if not exists entries_date_idx on entries (entry_date);
create index if not exists entries_person_idx on entries (person_id);
create index if not exists reactions_entry_idx on reactions (entry_id);

-- RLS habilitado en las tres tablas, sin policies para anon/authenticated.
-- La app nunca expone el anon key al navegador: todo el acceso pasa por
-- Server Actions / Server Components de Next.js usando el service role key,
-- que ignora RLS. Esto deja la base de datos cerrada si alguna clave
-- llegara a filtrarse por error.
alter table people enable row level security;
alter table entries enable row level security;
alter table reactions enable row level security;
