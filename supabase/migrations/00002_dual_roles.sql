-- ============================================
-- Dual Role Support
-- Allow teachers to also book sessions as makers
-- ============================================

-- The booking flow checks auth.uid() only, not role
-- Update sessions RLS to allow any authenticated user to create a session as maker

drop policy if exists "Makers can create sessions" on sessions;

create policy "Authenticated users can create sessions as maker" on sessions
  for insert with check (auth.uid() = maker_id);

-- Teachers can view sessions where they are the maker too
drop policy if exists "Makers see own sessions" on sessions;
drop policy if exists "Teachers see own sessions" on sessions;

create policy "Users see own sessions" on sessions
  for select using (auth.uid() = maker_id or auth.uid() = teacher_id);

-- Add is_teacher boolean to profiles for quick UI checks
-- (avoids joining teacher_profiles on every page load)
alter table profiles add column if not exists is_teacher boolean default false;

-- Keep existing role field for dashboard routing preference only
comment on column profiles.role is
  'Primary dashboard preference: maker or teacher. is_teacher flag is the real capability check.';

-- Function: set is_teacher = true when teacher_profiles row created
create or replace function handle_teacher_profile_created()
returns trigger as $$
begin
  update public.profiles set is_teacher = true where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_teacher_profile_created
  after insert on teacher_profiles
  for each row execute procedure handle_teacher_profile_created();
