-- =========================================================================
-- EMERGENCY FIX: Drop recursive RLS policies and replace with JWT metadata
-- Run this in Supabase SQL Editor
-- =========================================================================

-- Drop all broken recursive policies
drop policy if exists "Allow admins to do anything to profiles" on public.profiles;
drop policy if exists "Allow employers to insert companies" on public.companies;
drop policy if exists "Allow creators/admins to update companies" on public.companies;
drop policy if exists "Allow creators/admins to delete companies" on public.companies;
drop policy if exists "Allow employers to insert jobs" on public.jobs;
drop policy if exists "Allow creators/admins to update jobs" on public.jobs;
drop policy if exists "Allow creators/admins to delete jobs" on public.jobs;

-- ✅ Profiles - use JWT metadata (no recursion)
create policy "Allow admins to do anything to profiles" on public.profiles
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ✅ Companies - use JWT metadata (no recursion)
create policy "Allow employers to insert companies" on public.companies
  for insert with check (
    auth.uid() is not null and
    (auth.jwt() -> 'user_metadata' ->> 'role') in ('employer', 'admin')
  );

create policy "Allow creators/admins to update companies" on public.companies
  for update using (
    created_by = auth.uid() or
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

create policy "Allow creators/admins to delete companies" on public.companies
  for delete using (
    created_by = auth.uid() or
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- ✅ Jobs - use JWT metadata (no recursion)
create policy "Allow employers to insert jobs" on public.jobs
  for insert with check (
    auth.uid() is not null and
    (auth.jwt() -> 'user_metadata' ->> 'role') in ('employer', 'admin')
  );

create policy "Allow creators/admins to update jobs" on public.jobs
  for update using (
    created_by = auth.uid() or
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

create policy "Allow creators/admins to delete jobs" on public.jobs
  for delete using (
    created_by = auth.uid() or
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
