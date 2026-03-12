-- ============================================
-- BurnPosse Initial Schema Migration
-- ============================================

-- Table: profiles
-- Extends Supabase auth.users. Created automatically on signup via trigger.
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'maker' check (role in ('maker', 'teacher', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Table: teacher_profiles
create table teacher_profiles (
  id uuid references profiles(id) on delete cascade primary key,
  slug text unique not null,
  bio text,
  headline text,
  hourly_rate_cents integer not null default 5000,
  session_lengths integer[] default '{30,60}',
  is_active boolean default false,
  certification_level text default 'none' check (
    certification_level in ('none', 'verified', 'certified', 'master')
  ),
  stripe_account_id text,
  stripe_onboarding_complete boolean default false,
  session_count integer default 0,
  avg_rating numeric(3,2),
  response_time_hours numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table teacher_profiles enable row level security;
create policy "Anyone can view active teacher profiles" on teacher_profiles
  for select using (is_active = true);
create policy "Teachers can update own profile" on teacher_profiles
  for update using (auth.uid() = id);
create policy "Teachers can insert own profile" on teacher_profiles
  for insert with check (auth.uid() = id);
create policy "Admin can view all teacher profiles" on teacher_profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Table: teacher_equipment
create table teacher_equipment (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references teacher_profiles(id) on delete cascade,
  brand text not null,
  model text,
  laser_type text not null check (
    laser_type in ('diode', 'co2', 'fiber', 'uv', 'galvo')
  ),
  wattage text,
  notes text,
  created_at timestamptz default now()
);

alter table teacher_equipment enable row level security;
create policy "Anyone can view teacher equipment" on teacher_equipment for select using (true);
create policy "Teachers manage own equipment" on teacher_equipment
  for all using (auth.uid() = teacher_id);

-- Table: teacher_specialties
create table teacher_specialties (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references teacher_profiles(id) on delete cascade,
  specialty text not null
);

alter table teacher_specialties enable row level security;
create policy "Anyone can view specialties" on teacher_specialties for select using (true);
create policy "Teachers manage own specialties" on teacher_specialties
  for all using (auth.uid() = teacher_id);

-- Table: sessions
create table sessions (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references profiles(id) not null,
  maker_id uuid references profiles(id) not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'refunded')
  ),
  duration_minutes integer not null check (duration_minutes in (30, 60)),
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  amount_cents integer not null,
  platform_fee_cents integer not null,
  teacher_payout_cents integer not null,
  stripe_payment_intent_id text,
  stripe_transfer_id text,
  whereby_room_url text,
  whereby_host_room_url text,
  problem_description text,
  machine_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table sessions enable row level security;
create policy "Makers see own sessions" on sessions
  for select using (auth.uid() = maker_id);
create policy "Teachers see own sessions" on sessions
  for select using (auth.uid() = teacher_id);
create policy "Makers can create sessions" on sessions
  for insert with check (auth.uid() = maker_id);
create policy "Participants can update own sessions" on sessions
  for update using (auth.uid() = maker_id or auth.uid() = teacher_id);

-- Table: reviews
create table reviews (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) unique,
  maker_id uuid references profiles(id),
  teacher_id uuid references profiles(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

alter table reviews enable row level security;
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Makers can leave reviews" on reviews
  for insert with check (auth.uid() = maker_id);

-- Table: waitlist
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  role text check (role in ('maker', 'teacher')),
  machine_type text,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;
create policy "Anyone can join waitlist" on waitlist for insert with check (true);
create policy "Admin can view waitlist" on waitlist for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Trigger: Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Function: auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

create trigger teacher_profiles_updated_at
  before update on teacher_profiles
  for each row execute procedure update_updated_at();

create trigger sessions_updated_at
  before update on sessions
  for each row execute procedure update_updated_at();
