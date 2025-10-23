alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.session_tokens enable row level security;
alter table public.checkins enable row level security;
alter table public.adjustments enable row level security;
alter table public.audit_logs enable row level security;

create policy "Public profiles are viewable by authenticated users" on public.profiles
for select
using (auth.role() = 'authenticated');

create policy "Users manage their profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Professors manage owned classes" on public.classes
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Students view classes via enrollment" on public.classes
for select using (exists (
  select 1 from public.enrollments e where e.class_id = id and e.user_id = auth.uid() and e.status = 'active'
));

create policy "Members manage enrollments" on public.enrollments
for select using (class_id in (
  select class_id from public.enrollments where user_id = auth.uid() and status = 'active'
));

create policy "Professors add enrollments" on public.enrollments
for insert with check (auth.uid() in (
  select owner_id from public.classes where id = enrollments.class_id
));

create policy "Professors update enrollments" on public.enrollments
for update using (auth.uid() in (
  select owner_id from public.classes where id = enrollments.class_id
));

create policy "Members view sessions" on public.attendance_sessions
for select using (class_id in (
  select class_id from public.enrollments where user_id = auth.uid() and status = 'active'
) or exists (select 1 from public.classes c where c.id = class_id and c.owner_id = auth.uid()));

create policy "Professors manage sessions" on public.attendance_sessions
for all using (auth.uid() in (
  select owner_id from public.classes where id = attendance_sessions.class_id
));

create policy "Session tokens manageable by professors" on public.session_tokens
for all using (exists (
  select 1 from public.attendance_sessions s join public.classes c on c.id = s.class_id
  where s.id = session_tokens.session_id and c.owner_id = auth.uid()
));

create policy "Members view checkins" on public.checkins
for select using (
  user_id = auth.uid() or class_id in (select class_id from public.enrollments where user_id = auth.uid() and role in ('ta'))
);

create policy "Users manage own checkins" on public.checkins
for insert with check (user_id = auth.uid());

create policy "Professors adjust checkins" on public.checkins
for update using (
  class_id in (select id from public.classes where owner_id = auth.uid())
);

create or replace function public.rpc_mark_checkin(session_id uuid, rotating_token text, geo jsonb default null, device_fingerprint text default null)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  decoded jsonb;
  effective_session uuid := session_id;
  klass attendance_sessions;
  klass_class uuid;
  hashed_token text;
  distance numeric;
begin
  if auth.uid() is null then
    raise exception 'unauthorized';
  end if;

  if rotating_token is null then
    raise exception 'token required';
  end if;

  decoded := convert_from(decode(rotating_token, 'base64'), 'utf8')::jsonb;
  if effective_session is null then
    effective_session := (decoded ->> 'sid')::uuid;
  end if;

  select * into klass from attendance_sessions where id = effective_session;
  if not found then
    raise exception 'session not found';
  end if;
  klass_class := klass.class_id;

  if now() > klass.close_at then
    raise exception 'session closed';
  end if;

  if klass.require_geo and geo is null then
    raise exception 'geolocation required';
  end if;

  if klass.require_geo and geo is not null then
    distance := earth_distance(ll_to_earth((geo ->> 'lat')::double precision, (geo ->> 'lng')::double precision), ll_to_earth(klass.geo_lat, klass.geo_lng));
    if distance > (klass.geo_radius_m)::numeric then
      raise exception 'outside geofence';
    end if;
  end if;

  if not exists(select 1 from enrollments where class_id = klass_class and user_id = auth.uid() and status = 'active') then
    raise exception 'not enrolled';
  end if;

  hashed_token := encode(digest(rotating_token, 'sha256'), 'base64');
  if not exists(select 1 from session_tokens where session_id = klass.id and token_hash = hashed_token and expires_at > now()) then
    raise exception 'token expired';
  end if;

  insert into checkins (session_id, class_id, user_id, method, status, device_fingerprint)
  values (klass.id, klass_class, auth.uid(), 'qr', case when now() > klass.open_at + interval '60 seconds' then 'late' else 'present' end, device_fingerprint)
  on conflict (session_id, user_id) do update
    set status = excluded.status,
        device_fingerprint = coalesce(excluded.device_fingerprint, checkins.device_fingerprint),
        updated_at = now();

  return jsonb_build_object('status', 'ok');
end;
$$;

create or replace function public.rpc_create_session(class_id uuid, params jsonb)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_session_id uuid;
  close_at timestamptz;
  rotates int;
begin
  if auth.uid() is null then
    raise exception 'unauthorized';
  end if;

  if not exists(select 1 from classes where id = class_id and owner_id = auth.uid()) then
    raise exception 'forbidden';
  end if;

  close_at := coalesce((params ->> 'close_at')::timestamptz, now() + interval '5 minutes');
  rotates := coalesce((params ->> 'rotates_every_seconds')::int, 15);

  insert into attendance_sessions (class_id, title, open_at, close_at, rotates_every_seconds, require_geo, geo_lat, geo_lng, geo_radius_m, created_by)
  values (class_id, params ->> 'title', now(), close_at, rotates, coalesce((params ->> 'require_geo')::boolean, false),
          (params ->> 'geo_lat')::double precision, (params ->> 'geo_lng')::double precision, (params ->> 'geo_radius_m')::int, auth.uid())
  returning id into new_session_id;

  perform public.rpc_rotate_token(new_session_id);
  return new_session_id;
end;
$$;

create or replace function public.rpc_rotate_token(session_id uuid)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  klass attendance_sessions;
  raw text;
  token text;
  expires timestamptz;
  secret text := coalesce(current_setting('app.token_secret', true), 'dev-secret');
  payload text;
  sig text;
  nonce text := encode(gen_random_bytes(16), 'base64');
begin
  select * into klass from attendance_sessions where id = session_id;
  if klass is null then
    raise exception 'session missing';
  end if;

  if auth.uid() is null then
    raise exception 'unauthorized';
  end if;

  if not exists(select 1 from classes where id = klass.class_id and owner_id = auth.uid()) then
    raise exception 'forbidden';
  end if;

  expires := now() + make_interval(secs => klass.rotates_every_seconds);
  payload := klass.id::text || '.' || extract(epoch from expires)::text || '.' || nonce;
  sig := encode(hmac(payload, secret, 'sha256'), 'base64');
  token := encode(json_build_object('sid', klass.id, 'exp', extract(epoch from expires), 'nonce', nonce, 'sig', sig)::text::bytea, 'base64');

  insert into session_tokens (session_id, token_hash, expires_at)
  values (klass.id, encode(digest(token, 'sha256'), 'base64'), expires)
  on conflict (session_id, token_hash) do update set expires_at = excluded.expires_at;

  return jsonb_build_object('token', token, 'expires_at', expires);
end;
$$;
