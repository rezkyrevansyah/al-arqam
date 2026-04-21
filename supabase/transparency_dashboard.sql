create extension if not exists pgcrypto;

create table if not exists public.transparency_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  badge text not null default 'Dashboard Transparansi',
  category text not null default '',
  period_label text not null default '',
  year integer not null default (extract(year from now()))::integer,
  description text not null default '',
  progress_label text not null default 'Dana Terkumpul',
  collected_amount bigint not null default 0,
  target_amount bigint not null default 0,
  related_link_label text not null default '',
  related_link_url text not null default '',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transparency_metrics (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.transparency_programs(id) on delete cascade,
  label text not null,
  value bigint not null default 0,
  value_type text not null default 'number' check (value_type in ('currency', 'number')),
  suffix text not null default '',
  note text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.transparency_donors (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.transparency_programs(id) on delete cascade,
  donor_name text not null,
  amount bigint not null default 0,
  donated_at date,
  note text not null default '',
  is_anonymous boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists transparency_programs_year_sort_idx
  on public.transparency_programs (year desc, sort_order asc, created_at desc);

create index if not exists transparency_metrics_program_sort_idx
  on public.transparency_metrics (program_id, sort_order asc, created_at asc);

create index if not exists transparency_donors_program_sort_idx
  on public.transparency_donors (program_id, sort_order asc, donated_at desc, created_at desc);

create index if not exists transparency_programs_published_idx
  on public.transparency_programs (is_published);

alter table public.transparency_programs enable row level security;
alter table public.transparency_metrics enable row level security;
alter table public.transparency_donors enable row level security;

drop policy if exists "transparency_programs_public_read_published" on public.transparency_programs;
create policy "transparency_programs_public_read_published"
  on public.transparency_programs
  for select
  to anon
  using (is_published = true);

drop policy if exists "transparency_programs_authenticated_read_all" on public.transparency_programs;
create policy "transparency_programs_authenticated_read_all"
  on public.transparency_programs
  for select
  to authenticated
  using (true);

drop policy if exists "transparency_programs_authenticated_insert" on public.transparency_programs;
create policy "transparency_programs_authenticated_insert"
  on public.transparency_programs
  for insert
  to authenticated
  with check (true);

drop policy if exists "transparency_programs_authenticated_update" on public.transparency_programs;
create policy "transparency_programs_authenticated_update"
  on public.transparency_programs
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "transparency_programs_authenticated_delete" on public.transparency_programs;
create policy "transparency_programs_authenticated_delete"
  on public.transparency_programs
  for delete
  to authenticated
  using (true);

drop policy if exists "transparency_metrics_public_read_published_programs" on public.transparency_metrics;
create policy "transparency_metrics_public_read_published_programs"
  on public.transparency_metrics
  for select
  to anon
  using (
    exists (
      select 1
      from public.transparency_programs program
      where program.id = transparency_metrics.program_id
        and program.is_published = true
    )
  );

drop policy if exists "transparency_metrics_authenticated_read_all" on public.transparency_metrics;
create policy "transparency_metrics_authenticated_read_all"
  on public.transparency_metrics
  for select
  to authenticated
  using (true);

drop policy if exists "transparency_metrics_authenticated_insert" on public.transparency_metrics;
create policy "transparency_metrics_authenticated_insert"
  on public.transparency_metrics
  for insert
  to authenticated
  with check (true);

drop policy if exists "transparency_metrics_authenticated_update" on public.transparency_metrics;
create policy "transparency_metrics_authenticated_update"
  on public.transparency_metrics
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "transparency_metrics_authenticated_delete" on public.transparency_metrics;
create policy "transparency_metrics_authenticated_delete"
  on public.transparency_metrics
  for delete
  to authenticated
  using (true);

drop policy if exists "transparency_donors_public_read_published_programs" on public.transparency_donors;
create policy "transparency_donors_public_read_published_programs"
  on public.transparency_donors
  for select
  to anon
  using (
    exists (
      select 1
      from public.transparency_programs program
      where program.id = transparency_donors.program_id
        and program.is_published = true
    )
  );

drop policy if exists "transparency_donors_authenticated_read_all" on public.transparency_donors;
create policy "transparency_donors_authenticated_read_all"
  on public.transparency_donors
  for select
  to authenticated
  using (true);

drop policy if exists "transparency_donors_authenticated_insert" on public.transparency_donors;
create policy "transparency_donors_authenticated_insert"
  on public.transparency_donors
  for insert
  to authenticated
  with check (true);

drop policy if exists "transparency_donors_authenticated_update" on public.transparency_donors;
create policy "transparency_donors_authenticated_update"
  on public.transparency_donors
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "transparency_donors_authenticated_delete" on public.transparency_donors;
create policy "transparency_donors_authenticated_delete"
  on public.transparency_donors
  for delete
  to authenticated
  using (true);
