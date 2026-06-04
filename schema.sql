-- =========================================================================
-- CareerLink Database Schema
-- Run this in your Supabase SQL Editor to set up your database.
-- =========================================================================

-- 1. Create Profiles Table (links to Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  username text,
  role text not null check (role in ('admin', 'candidate', 'employer')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- 2. Create Companies Table
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text not null,
  logo_url text,
  logo_bg text default '#edeff5',
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id) on delete set null
);

-- Enable RLS
alter table public.companies enable row level security;

-- 3. Create Jobs Table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null, -- 'Full Time', 'Contract Base', 'Internship', 'Freelance'
  location text not null,
  salary text not null,
  logo_url text,
  logo_bg text default '#edeff5',
  company_name text not null,
  company_id uuid references public.companies(id) on delete set null,
  description text,
  remaining_days integer default 30,
  created_at timestamptz default now(),
  created_by uuid references public.profiles(id) on delete set null
);

-- Enable RLS
alter table public.jobs enable row level security;


-- =========================================================================
-- Triggers for Auth Syncing
-- Automatically create a profile when a new user signs up in Auth.
-- =========================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'fullName', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', ''),
    coalesce(new.raw_user_meta_data->>'role', 'candidate')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =========================================================================
-- Row Level Security (RLS) Policies
-- Using JWT metadata role checks to avoid infinite recursion loops.
-- =========================================================================

-- Profiles Policies
create policy "Allow public read access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Allow admins to do anything to profiles" on public.profiles
  for all using (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Companies Policies
create policy "Allow public read access to companies" on public.companies
  for select using (true);

create policy "Allow employers to insert companies" on public.companies
  for insert with check (
    auth.uid() is not null and (
      (auth.jwt() -> 'user_metadata' ->> 'role') in ('employer', 'admin')
    )
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

-- Jobs Policies
create policy "Allow public read access to jobs" on public.jobs
  for select using (true);

create policy "Allow employers to insert jobs" on public.jobs
  for insert with check (
    auth.uid() is not null and (
      (auth.jwt() -> 'user_metadata' ->> 'role') in ('employer', 'admin')
    )
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


-- =========================================================================
-- Seed Data
-- Prefills the database with original design mock data.
-- =========================================================================

-- Insert Seed Companies
insert into public.companies (name, location, logo_url, logo_bg) values
  ('Dribbble', 'United States', '/home-assets/company-logo-dribbble.svg', '#ea4c89'),
  ('Upwork', 'United States', '/home-assets/company-logo-upwork.svg', '#6fda44'),
  ('Slack', 'China', '/home-assets/company-logo-slack.svg', '#edeff5'),
  ('Freepik', 'China', '/home-assets/job-logo-blue.svg', '#1e60c6'),
  ('Behance', 'Australia', '/home-assets/company-logo-dribbble.svg', '#1769ff'),
  ('Google', 'Germany', '/home-assets/job-logo-google.svg', '#191f33'),
  ('Twitter', 'United States', '/home-assets/job-logo-blue.svg', '#1da1f2'),
  ('Facebook', 'United States', '/home-assets/job-logo-facebook.svg', '#1877f2');

-- Insert Seed Jobs
insert into public.jobs (title, type, location, salary, logo_url, logo_bg, company_name, remaining_days) values
  ('Senior UX Designer', 'Contract Base', 'Australia', '$30K-$35K', '/home-assets/job-logo-green.svg', '#6fda44', 'Dribbble', 26),
  ('Software Engineer', 'Full Time', 'China', '$50K-$70K', '/home-assets/job-logo-black.svg', '#191f33', 'Upwork', 18),
  ('Junior Graphic Designer', 'Full Time', 'Canada', '$50K-$70K', '/home-assets/job-logo-red.svg', '#eb524f', 'Slack', 12),
  ('Product Designer', 'Full Time', 'United States', '$35K-$40K', '/home-assets/job-logo-blue.svg', '#1877f2', 'Freepik', 4),
  ('Marketing Officer', 'Internship', 'Germany', '$20K-$25K', '/home-assets/job-logo-facebook.svg', '#1877f2', 'Behance', 14),
  ('Interaction Designer', 'Freelance', 'France', '$40K-$45K', '/home-assets/job-logo-google.svg', '#edeff5', 'Google', 9);
