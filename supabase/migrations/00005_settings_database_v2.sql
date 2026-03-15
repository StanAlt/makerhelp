-- ============================================
-- Settings Database v2
-- Normalized machines/materials, challenges, votes
-- ============================================

-- ─── Machines ───
create table machines (
  id uuid default gen_random_uuid() primary key,
  brand text not null,
  model text not null,
  type text not null check (type in ('diode', 'co2', 'fiber', 'galvo')),
  wattage text,
  created_at timestamptz default now(),
  unique (brand, model)
);

alter table machines enable row level security;
create policy "Anyone can read machines" on machines for select using (true);

-- ─── Materials ───
create table materials (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  category text not null check (
    category in ('wood', 'acrylic', 'metal', 'leather', 'glass', 'stone', 'fabric', 'other')
  )
);

alter table materials enable row level security;
create policy "Anyone can read materials" on materials for select using (true);

-- ─── Settings ───
create table settings (
  id uuid default gen_random_uuid() primary key,
  machine_id uuid not null references machines(id) on delete cascade,
  material_id uuid not null references materials(id) on delete cascade,
  thickness_mm numeric,
  operation text not null check (operation in ('engrave', 'cut', 'score', 'mark')),
  power_pct integer not null check (power_pct between 1 and 100),
  speed_mmsec integer not null,
  passes integer not null default 1,
  lpi integer,
  interval_mm numeric,
  air_assist boolean not null default false,
  focus_notes text,
  result_notes text,
  source_type text not null default 'community' check (
    source_type in ('community', 'verified', 'staff')
  ),
  source_url text,
  submitted_by uuid references auth.users(id),
  approved boolean not null default false,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_settings_lookup on settings (machine_id, material_id, operation);

alter table settings enable row level security;

-- Anyone can read approved settings
create policy "Public read approved settings"
  on settings for select
  using (approved = true);

-- Authenticated users can insert (always unapproved)
create policy "Auth users can submit settings"
  on settings for insert
  with check (auth.uid() = submitted_by and approved = false);

-- Users can update their own pending submissions
create policy "Users update own pending"
  on settings for update
  using (auth.uid() = submitted_by and approved = false);

-- Users can delete their own pending submissions
create policy "Users delete own pending"
  on settings for delete
  using (auth.uid() = submitted_by and approved = false);

-- Auto-update updated_at
create trigger settings_updated_at
  before update on settings
  for each row execute procedure update_updated_at();

-- ─── Setting Challenges ───
create table setting_challenges (
  id uuid default gen_random_uuid() primary key,
  setting_id uuid not null references settings(id) on delete cascade,
  challenger_id uuid not null references auth.users(id),
  reason text not null,
  suggested_power integer,
  suggested_speed integer,
  suggested_passes integer,
  evidence_url text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected')
  ),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table setting_challenges enable row level security;

create policy "Public read challenges" on setting_challenges
  for select using (true);
create policy "Auth users submit challenges" on setting_challenges
  for insert with check (auth.uid() = challenger_id);

-- ─── Setting Votes ───
create table setting_votes (
  id uuid default gen_random_uuid() primary key,
  setting_id uuid not null references settings(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  vote text not null check (vote in ('helpful', 'not_helpful')),
  created_at timestamptz default now(),
  unique (setting_id, user_id)
);

alter table setting_votes enable row level security;

create policy "Public read votes" on setting_votes for select using (true);
create policy "Auth users can vote" on setting_votes
  for insert with check (auth.uid() = user_id);
create policy "Users update own vote" on setting_votes
  for update using (auth.uid() = user_id);
create policy "Users delete own vote" on setting_votes
  for delete using (auth.uid() = user_id);

-- ─── Seed: Machines ───
insert into machines (id, brand, model, type, wattage) values
  ('a0000001-0000-0000-0000-000000000001', 'xTool', 'D1 Pro 10W', 'diode', '10W'),
  ('a0000001-0000-0000-0000-000000000002', 'xTool', 'D1 Pro 20W', 'diode', '20W'),
  ('a0000001-0000-0000-0000-000000000003', 'xTool', 'P2', 'co2', '55W'),
  ('a0000001-0000-0000-0000-000000000004', 'Glowforge', 'Basic', 'co2', '40W'),
  ('a0000001-0000-0000-0000-000000000005', 'Glowforge', 'Pro', 'co2', '45W'),
  ('a0000001-0000-0000-0000-000000000006', 'OMTech', '60W CO2', 'co2', '60W'),
  ('a0000001-0000-0000-0000-000000000007', 'Sculpfun', 'S30 Pro', 'diode', '10W'),
  ('a0000001-0000-0000-0000-000000000008', 'Atomstack', 'X20 Pro', 'diode', '20W');

-- ─── Seed: Materials ───
insert into materials (id, name, category) values
  ('b0000001-0000-0000-0000-000000000001', '3mm Basswood', 'wood'),
  ('b0000001-0000-0000-0000-000000000002', '6mm Basswood', 'wood'),
  ('b0000001-0000-0000-0000-000000000003', '3mm Baltic Birch', 'wood'),
  ('b0000001-0000-0000-0000-000000000004', '3mm Cast Acrylic', 'acrylic'),
  ('b0000001-0000-0000-0000-000000000005', '6mm Cast Acrylic', 'acrylic'),
  ('b0000001-0000-0000-0000-000000000006', 'Vegetable Tan Leather 3mm', 'leather'),
  ('b0000001-0000-0000-0000-000000000007', 'Slate Tile', 'stone'),
  ('b0000001-0000-0000-0000-000000000008', 'Anodized Aluminum', 'metal'),
  ('b0000001-0000-0000-0000-000000000009', 'Cardstock', 'other'),
  ('b0000001-0000-0000-0000-000000000010', 'Felt', 'fabric');

-- ─── Seed: Settings (40+ entries) ───
-- Abbreviations: m=machine_id prefix a0000001-...-0000000000XX, mat=material_id prefix b0000001-...-0000000000XX

insert into settings (machine_id, material_id, thickness_mm, operation, power_pct, speed_mmsec, passes, lpi, interval_mm, air_assist, focus_notes, result_notes, source_type, source_url, approved) values
-- xTool D1 Pro 10W
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 60, 6000, 1, 318, 0.08, false, 'Focus on surface', 'Clean dark engrave on basswood, minimal char', 'verified', 'https://www.reddit.com/r/lasercutting/comments/xtool_d1_basswood_settings/', true),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 100, 300, 3, null, null, true, 'Focus on surface, air assist critical', 'Clean cut through 3mm basswood with minor charring on edges', 'verified', 'https://www.reddit.com/r/lasercutting/comments/d1_pro_cut_settings/', true),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', 3, 'engrave', 65, 6000, 1, 318, 0.08, false, 'Focus on surface', 'Good contrast on Baltic Birch plywood', 'community', 'https://forum.lightburnsoftware.com/t/xtool-d1-pro-birch-plywood/topic', true),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000006', 3, 'engrave', 30, 6000, 1, 254, 0.10, false, 'Defocus 1mm for wider line', 'Tan leather darkens nicely, no burning at edges', 'community', 'https://www.reddit.com/r/lasercutting/comments/leather_diode_settings/', true),
('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000007', null, 'engrave', 90, 3000, 1, 254, 0.10, false, 'Focus on surface', 'Light gray engrave on slate, contrast depends on slate color', 'community', 'https://www.reddit.com/r/lasercutting/comments/slate_engrave_diode/', true),

-- xTool D1 Pro 20W
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 100, 600, 2, null, null, true, 'Focus on surface', 'Clean single-pass possible at 400mm/s, 2 pass safer for consistency', 'verified', 'https://www.reddit.com/r/lasercutting/comments/d1_pro_20w_basswood/', true),
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 6, 'cut', 100, 300, 4, null, null, true, 'Focus on surface, check after 2 passes', '6mm basswood requires patience — 4 passes clean through', 'community', 'https://forum.lightburnsoftware.com/t/20w-diode-6mm-wood/topic', true),
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 50, 8000, 1, 318, 0.08, false, 'Focus on surface', 'Very fast engrave, good for production runs', 'verified', 'https://www.reddit.com/r/lasercutting/comments/20w_engrave_speed/', true),
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000008', null, 'engrave', 70, 1000, 1, 318, 0.08, false, 'Focus on coating surface', 'Removes anodization cleanly, white mark on black anodized', 'community', 'https://www.reddit.com/r/lasercutting/comments/anodized_aluminum_diode/', true),
('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000009', null, 'cut', 20, 1000, 1, null, null, false, 'Focus on surface', 'Cuts cardstock easily in one pass, no charring', 'community', 'https://www.reddit.com/r/lasercutting/comments/diode_cardstock/', true),

-- xTool P2 (55W CO2)
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 60, 10, 1, null, null, true, 'Auto focus', 'Clean single-pass cut, minimal char with air assist', 'staff', 'https://www.xtool.com/pages/p2-material-settings', true),
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000004', 3, 'cut', 65, 8, 1, null, null, true, 'Auto focus', 'Clean edges on cast acrylic, flame-polished cut', 'staff', 'https://www.xtool.com/pages/p2-material-settings', true),
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000005', 6, 'cut', 75, 5, 1, null, null, true, 'Auto focus', '6mm cast acrylic clean cut in single pass at reduced speed', 'verified', 'https://www.xtool.com/pages/p2-material-settings', true),
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 30, 300, 1, 300, null, false, 'Auto focus', 'Smooth engrave on basswood with good contrast', 'staff', 'https://www.xtool.com/pages/p2-material-settings', true),
('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000006', 3, 'engrave', 20, 300, 1, 300, null, false, 'Auto focus', 'Clean leather engrave, do not exceed 25% or leather burns through', 'verified', 'https://www.reddit.com/r/lasercutting/comments/p2_leather/', true),

-- Glowforge Basic (40W CO2)
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 100, 168, 1, null, null, false, 'Auto focus, Proofgrade or manual', 'Full power + speed 168 for clean cut, proofgrade preset equiv', 'verified', 'https://community.glowforge.com/t/non-proofgrade-basswood-settings/', true),
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003', 3, 'cut', 100, 183, 1, null, null, false, 'Set focus to 0.125in', 'Baltic birch 3mm cuts well, watch for glue layers', 'community', 'https://community.glowforge.com/t/baltic-birch-settings-thread/', true),
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 60, 1000, 1, 270, null, false, 'Auto focus', 'Good engrave at 270 LPI, increase to 340 for photo quality', 'community', 'https://community.glowforge.com/t/engrave-settings-collection/', true),
('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 3, 'cut', 100, 168, 1, null, null, false, 'Auto focus', 'Cast acrylic cuts clean, edges flame-polished', 'verified', 'https://community.glowforge.com/t/acrylic-settings-master/', true),

-- Glowforge Pro (45W CO2)
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 90, 200, 1, null, null, false, 'Auto focus', 'Pro has more power headroom, 90% at higher speed works great', 'verified', 'https://community.glowforge.com/t/pro-vs-basic-settings/', true),
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 6, 'cut', 100, 120, 2, null, null, false, 'Set focus to material surface', '6mm acrylic needs 2 passes even on Pro, clean edges', 'community', 'https://community.glowforge.com/t/thick-acrylic-pro-settings/', true),
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000006', 3, 'engrave', 25, 600, 1, 225, null, false, 'Set focus to surface', 'Low power critical for leather on CO2, test scrap first', 'verified', 'https://community.glowforge.com/t/leather-settings-thread/', true),
('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000010', null, 'cut', 45, 200, 1, null, null, false, 'Set focus to felt thickness', 'Cuts felt cleanly, too much power melts edges', 'community', 'https://community.glowforge.com/t/felt-cutting-settings/', true),

-- OMTech 60W CO2
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 50, 20, 1, null, null, true, 'Focus on surface, 50.8mm lens', 'Clean cut at 50% / 20mm/s with air assist', 'verified', 'https://forum.lightburnsoftware.com/t/omtech-60w-settings-library/topic', true),
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 6, 'cut', 65, 12, 1, null, null, true, 'Focus on surface', '6mm basswood single pass at slow speed', 'community', 'https://www.reddit.com/r/ChineseLaserCutters/comments/omtech_6mm/', true),
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000004', 3, 'cut', 55, 15, 1, null, null, true, 'Focus on surface', 'Cast acrylic flame-polished edge at these settings', 'verified', 'https://forum.lightburnsoftware.com/t/omtech-acrylic/topic', true),
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000005', 6, 'cut', 70, 8, 1, null, null, true, 'Focus on surface', '6mm acrylic in one pass, needs slow speed', 'community', 'https://forum.lightburnsoftware.com/t/omtech-thick-acrylic/topic', true),
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 20, 300, 1, 254, null, false, 'Focus on surface', 'Light engrave at 20%, increase to 30% for deeper burn', 'verified', 'https://forum.lightburnsoftware.com/t/omtech-engrave-settings/topic', true),
('a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000007', null, 'engrave', 30, 200, 1, 300, null, false, 'Focus on surface', 'Slate engraves to light gray, contrast varies by stone', 'community', 'https://www.reddit.com/r/lasercutting/comments/omtech_slate/', true),

-- Sculpfun S30 Pro (10W diode)
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 100, 400, 3, null, null, true, 'Focus on surface', '3 passes recommended for clean through-cut', 'community', 'https://forum.lightburnsoftware.com/t/sculpfun-s30-settings/topic', true),
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 55, 6000, 1, 318, 0.08, false, 'Focus on surface', 'Comparable to xTool D1 Pro 10W results on basswood', 'community', 'https://forum.lightburnsoftware.com/t/sculpfun-s30-engrave/topic', true),
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000006', 3, 'engrave', 25, 6000, 1, 254, 0.10, false, 'Defocus 1mm', 'Nice leather engrave, keep power low', 'community', 'https://www.reddit.com/r/lasercutting/comments/sculpfun_leather/', true),
('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000009', null, 'cut', 15, 1200, 1, null, null, false, 'Focus on surface', 'Cardstock cuts very easily, minimal power needed', 'community', 'https://www.reddit.com/r/lasercutting/comments/sculpfun_cardstock/', true),

-- Atomstack X20 Pro (20W diode)
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000001', 3, 'cut', 100, 500, 2, null, null, true, 'Focus on surface', '20W handles 3mm basswood in 2 passes comfortably', 'community', 'https://www.reddit.com/r/lasercutting/comments/atomstack_x20_basswood/', true),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000001', 3, 'engrave', 50, 8000, 1, 318, 0.08, false, 'Focus on surface', 'Fast engrave with 20W, good detail at 318 LPI', 'verified', 'https://www.reddit.com/r/lasercutting/comments/atomstack_engrave/', true),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000003', 3, 'cut', 100, 400, 3, null, null, true, 'Focus on surface', 'Baltic birch glue layers can cause issues, 3 passes safer', 'community', 'https://www.reddit.com/r/lasercutting/comments/atomstack_birch/', true),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000008', null, 'engrave', 75, 1200, 1, 318, 0.08, false, 'Focus on coating surface', 'Strips anodization cleanly at 75% power', 'community', 'https://www.reddit.com/r/lasercutting/comments/atomstack_anodized/', true),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000007', null, 'engrave', 95, 2000, 1, 254, 0.10, false, 'Focus on surface', 'High power needed for slate on diode lasers', 'community', 'https://www.reddit.com/r/lasercutting/comments/atomstack_slate/', true),
('a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000010', null, 'cut', 30, 800, 1, null, null, false, 'Focus on surface', 'Cuts felt cleanly, watch for melted edges above 35%', 'community', 'https://www.reddit.com/r/lasercutting/comments/atomstack_felt/', true);
