-- SMBify Rank - Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS TABLE (synced from auth.users)
-- ============================================
create table if not exists public.users (
    id uuid references auth.users(id) on delete cascade primary key,
    email text unique,
    name text,
    avatar_url text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Users can only read/update their own data
create policy "Users can view own profile" on public.users
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
    for update using (auth.uid() = id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on auth signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ============================================
-- SITES TABLE (each generated website)
-- ============================================
create table if not exists public.sites (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    site_name text not null,
    brand_name text not null,
    main_keyword text,
    industry text,
    status text default 'draft' check (status in ('draft', 'published', 'archived')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.sites enable row level security;

-- Users can only access their own sites
create policy "Users own their sites" on public.sites
    for all using (auth.uid() = user_id);

-- ============================================
-- SITE_CONFIG TABLE (single source of truth)
-- ============================================
create table if not exists public.site_config (
    id uuid default uuid_generate_v4() primary key,
    site_id uuid references public.sites(id) on delete cascade unique not null,
    pages_data jsonb default '{"pages": []}'::jsonb,
    blog_data jsonb default '{"posts": []}'::jsonb,
    seo_data jsonb default '{}'::jsonb,
    theme_data jsonb default '{}'::jsonb,
    images_data jsonb default '{}'::jsonb,
    last_saved_at timestamptz default now()
);

-- Enable RLS
alter table public.site_config enable row level security;

-- Users can only access config for their own sites
create policy "Users own site config" on public.site_config
    for all using (
        site_id in (select id from public.sites where user_id = auth.uid())
    );

-- ============================================
-- NETLIFY_ACCOUNTS TABLE (per-user tokens)
-- ============================================
create table if not exists public.netlify_accounts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    encrypted_access_token text not null,
    netlify_team_slug text,
    created_at timestamptz default now(),
    unique(user_id)
);

-- Enable RLS
alter table public.netlify_accounts enable row level security;

-- Users can only access their own Netlify account
create policy "Users own netlify accounts" on public.netlify_accounts
    for all using (auth.uid() = user_id);

-- ============================================
-- DEPLOYMENTS TABLE (deploy history)
-- ============================================
create table if not exists public.deployments (
    id uuid default uuid_generate_v4() primary key,
    site_id uuid references public.sites(id) on delete cascade not null,
    netlify_site_id text,
    deploy_status text default 'pending' check (deploy_status in ('pending', 'building', 'ready', 'error')),
    deploy_url text,
    last_deployed_at timestamptz,
    deploy_logs text
);

-- Enable RLS
alter table public.deployments enable row level security;

-- Users can only access deployments for their own sites
create policy "Users own deployments" on public.deployments
    for all using (
        site_id in (select id from public.sites where user_id = auth.uid())
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Update updated_at timestamp on sites table
create or replace function public.update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger sites_updated_at
    before update on public.sites
    for each row execute procedure public.update_updated_at();

-- Update last_saved_at on site_config table
create trigger site_config_last_saved
    before update on public.site_config
    for each row execute procedure public.update_updated_at();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index if not exists idx_sites_user_id on public.sites(user_id);
create index if not exists idx_site_config_site_id on public.site_config(site_id);
create index if not exists idx_deployments_site_id on public.deployments(site_id);
