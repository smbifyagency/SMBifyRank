-- ============================================
-- USER SUBSCRIPTIONS TABLE (Pricing & Plans)
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================

-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade unique not null,
    plan_type text default 'free' check (plan_type in ('free', 'monthly', 'lifetime')),
    status text default 'active' check (status in ('active', 'expired', 'canceled', 'past_due')),
    website_limit int default 1,
    websites_created int default 0,
    stripe_customer_id text,
    stripe_subscription_id text,
    source text default 'direct' check (source in ('direct', 'appsumo', 'coupon')),
    expires_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_subscriptions enable row level security;

-- Users can only access their own subscription
create policy "Users own subscriptions" on public.user_subscriptions
    for all using (auth.uid() = user_id);

-- Auto-create free subscription when user is created
create or replace function public.create_free_subscription()
returns trigger as $$
begin
    insert into public.user_subscriptions (user_id, plan_type, website_limit, websites_created)
    values (new.id, 'free', 1, 0);
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create subscription on user creation (fires after handle_new_user)
drop trigger if exists on_user_created_subscription on public.users;
create trigger on_user_created_subscription
    after insert on public.users
    for each row execute function public.create_free_subscription();

-- Function to increment websites_created count
create or replace function public.increment_websites_created(p_user_id uuid)
returns void as $$
begin
    update public.user_subscriptions
    set websites_created = websites_created + 1,
        updated_at = now()
    where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Function to check if user can create website
create or replace function public.can_create_website(p_user_id uuid)
returns boolean as $$
declare
    v_limit int;
    v_created int;
    v_status text;
begin
    select website_limit, websites_created, status
    into v_limit, v_created, v_status
    from public.user_subscriptions
    where user_id = p_user_id;
    
    -- If no subscription found, deny
    if not found then
        return false;
    end if;
    
    -- If not active, deny
    if v_status != 'active' then
        return false;
    end if;
    
    -- Unlimited plans (monthly/lifetime) have limit = 0 or NULL
    if v_limit is null or v_limit = 0 then
        return true;
    end if;
    
    -- Check limit
    return v_created < v_limit;
end;
$$ language plpgsql security definer;

-- Index for performance
create index if not exists idx_user_subscriptions_user_id on public.user_subscriptions(user_id);
create index if not exists idx_user_subscriptions_stripe_customer on public.user_subscriptions(stripe_customer_id);
