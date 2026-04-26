
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  age int,
  weight_kg numeric,
  height_cm numeric,
  goal text,
  cuisines text[] default '{}',
  activity text,
  gym_days_per_week int default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- MEALS
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  slot text not null,
  name text not null,
  calories int not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  emoji text,
  created_at timestamptz not null default now()
);
create index meals_user_date_idx on public.meals(user_id, log_date);
alter table public.meals enable row level security;
create policy "own meals all" on public.meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- WORKOUTS
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index workouts_user_date_uniq on public.workouts(user_id, log_date);
alter table public.workouts enable row level security;
create policy "own workouts all" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger workouts_updated before update on public.workouts for each row execute function public.set_updated_at();

-- SUPPLEMENTS
create table public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  timing text not null,
  emoji text default '💊',
  is_food_based boolean default false,
  created_at timestamptz not null default now()
);
create index supplements_user_idx on public.supplements(user_id);
alter table public.supplements enable row level security;
create policy "own supplements all" on public.supplements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  supplement_id uuid not null references public.supplements(id) on delete cascade,
  log_date date not null default current_date,
  taken boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index supplement_logs_uniq on public.supplement_logs(user_id, supplement_id, log_date);
alter table public.supplement_logs enable row level security;
create policy "own supp logs all" on public.supplement_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- HYDRATION
create table public.hydration_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  ml int not null,
  created_at timestamptz not null default now()
);
create index hydration_user_date_idx on public.hydration_logs(user_id, log_date);
alter table public.hydration_logs enable row level security;
create policy "own hydration all" on public.hydration_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- CHECK INS
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  type text not null,
  mood int not null,
  notes text default '',
  created_at timestamptz not null default now()
);
create index check_ins_user_date_idx on public.check_ins(user_id, log_date);
alter table public.check_ins enable row level security;
create policy "own checkins all" on public.check_ins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- COACH MESSAGES (AI chat history)
create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index coach_msgs_user_idx on public.coach_messages(user_id, created_at);
alter table public.coach_messages enable row level security;
create policy "own coach msgs all" on public.coach_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
