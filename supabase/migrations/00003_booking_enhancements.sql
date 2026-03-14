-- ============================================
-- Booking Enhancements
-- Teacher availability and booking controls
-- ============================================

-- Availability table for teachers (day of week + time slots)
create table teacher_availability (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references teacher_profiles(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sun, 6=Sat
  start_time time not null,
  end_time time not null,
  timezone text not null default 'America/New_York'
);

alter table teacher_availability enable row level security;
create policy "Anyone can view availability" on teacher_availability for select using (true);
create policy "Teachers manage own availability" on teacher_availability
  for all using (auth.uid() = teacher_id);

-- Add fields to teacher_profiles for booking controls
alter table teacher_profiles
  add column if not exists timezone text default 'America/New_York',
  add column if not exists accepts_bookings boolean default true;
