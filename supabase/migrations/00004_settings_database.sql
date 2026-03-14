-- ============================================
-- Laser Settings Database
-- Crowd-sourced, expert-verified laser settings
-- ============================================

create table laser_settings (
  id uuid default gen_random_uuid() primary key,
  contributor_id uuid references profiles(id),

  -- Machine
  machine_brand text not null,
  machine_model text,
  laser_type text not null check (laser_type in ('diode', 'co2', 'fiber', 'uv', 'galvo')),
  machine_wattage text,

  -- Material
  material text not null,
  material_thickness_mm numeric,
  material_brand text,
  material_finish text,

  -- Operation
  operation_type text not null check (
    operation_type in ('cut', 'engrave', 'score', 'fill')
  ),

  -- Settings
  speed integer,
  power_percent integer check (power_percent between 1 and 100),
  passes integer default 1,
  line_interval_mm numeric,
  focus_offset_mm numeric,
  air_assist boolean default false,

  -- Software
  software text,
  dpi integer,

  -- Result
  result_quality text check (
    result_quality in ('perfect', 'good', 'ok', 'poor')
  ),
  result_notes text,
  image_url text,

  -- Meta
  slug text unique not null,
  is_verified boolean default false,
  verified_by uuid references profiles(id),
  upvotes integer default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table laser_settings enable row level security;

create policy "Anyone can view settings" on laser_settings for select using (true);
create policy "Authenticated users can submit settings" on laser_settings
  for insert with check (auth.uid() = contributor_id);
create policy "Contributors can update own settings" on laser_settings
  for update using (auth.uid() = contributor_id);

-- Upvotes table
create table settings_upvotes (
  user_id uuid references profiles(id),
  setting_id uuid references laser_settings(id) on delete cascade,
  primary key (user_id, setting_id)
);

alter table settings_upvotes enable row level security;
create policy "Anyone can view upvotes" on settings_upvotes for select using (true);
create policy "Authenticated users can upvote" on settings_upvotes
  for insert with check (auth.uid() = user_id);
create policy "Users can remove own upvote" on settings_upvotes
  for delete using (auth.uid() = user_id);

-- Function: increment/decrement upvotes count
create or replace function handle_settings_upvote()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update laser_settings set upvotes = upvotes + 1 where id = new.setting_id;
  elsif TG_OP = 'DELETE' then
    update laser_settings set upvotes = upvotes - 1 where id = old.setting_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_settings_upvote
  after insert or delete on settings_upvotes
  for each row execute procedure handle_settings_upvote();

-- Auto-update updated_at
create trigger laser_settings_updated_at
  before update on laser_settings
  for each row execute procedure update_updated_at();
