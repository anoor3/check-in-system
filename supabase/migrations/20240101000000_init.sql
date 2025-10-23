create extension if not exists "pgcrypto";
create extension if not exists "cube";
create extension if not exists "earthdistance";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','professor','admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  code text,
  section text,
  term text,
  timezone text not null,
  join_code text unique,
  join_code_expires_at timestamptz,
  is_join_open boolean default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'student' check (role in ('student','ta')),
  status text not null default 'active' check (status in ('active','removed')),
  created_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  title text,
  open_at timestamptz not null,
  close_at timestamptz not null,
  rotates_every_seconds int not null default 15,
  require_geo boolean not null default false,
  geo_lat double precision,
  geo_lng double precision,
  geo_radius_m int,
  status text not null default 'open' check (status in ('scheduled','open','closed','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.session_tokens (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (session_id, token_hash)
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  method text not null check (method in ('qr','code','manual')),
  status text not null default 'present' check (status in ('present','late','excused','absent')),
  device_fingerprint text,
  ip_inet inet,
  geo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.adjustments (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins(id) on delete cascade,
  changed_by uuid references public.profiles(id),
  previous_status text,
  new_status text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity text,
  entity_id uuid,
  data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_classes_owner on public.classes(owner_id);
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_sessions_class on public.attendance_sessions(class_id, open_at, close_at);
create index if not exists idx_checkins_session on public.checkins(session_id);
create index if not exists idx_checkins_user on public.checkins(user_id);
