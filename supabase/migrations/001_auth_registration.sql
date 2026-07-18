-- LinkUp authentication and registration foundation.
-- Provider identities are written only by trusted server code using the
-- service-role key after the provider payload has been verified.

create extension if not exists pgcrypto;

create type public.account_status as enum (
  'active',
  'suspended',
  'blocked',
  'deleted'
);

create type public.onboarding_status as enum (
  'profile_required',
  'location_required',
  'completed'
);

create type public.legal_document_type as enum (
  'terms',
  'privacy',
  'community_guidelines'
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  status public.account_status not null default 'active',
  onboarding_status public.onboarding_status not null default 'profile_required',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table public.auth_identities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  provider text not null check (provider in ('telegram', 'apple', 'google')),
  provider_user_id text not null,
  provider_username text,
  provider_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_authenticated_at timestamptz not null default now(),
  constraint auth_identities_provider_user_unique
    unique (provider, provider_user_id)
);

create table public.profiles (
  account_id uuid primary key references public.accounts(id) on delete cascade,
  display_name text,
  username text,
  avatar_url text,
  bio text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[A-Za-z0-9_]{3,30}$'
  )
);

create unique index profiles_username_case_insensitive_unique
  on public.profiles (lower(username))
  where username is not null;

create table public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  document_type public.legal_document_type not null,
  document_version text not null,
  accepted_at timestamptz not null default now(),
  platform text not null,
  constraint legal_acceptance_version_unique
    unique (account_id, document_type, document_version)
);

create index accounts_auth_user_id_idx on public.accounts (auth_user_id);
create index auth_identities_account_id_idx on public.auth_identities (account_id);
create index legal_acceptances_account_id_idx on public.legal_acceptances (account_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.accounts enable row level security;
alter table public.auth_identities enable row level security;
alter table public.profiles enable row level security;
alter table public.legal_acceptances enable row level security;

create function public.is_own_account(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.accounts
    where accounts.id = target_account_id
      and accounts.auth_user_id = auth.uid()
  );
$$;

create function public.is_approved_public_profile(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.accounts
    where accounts.id = target_account_id
      and accounts.status = 'active'
      and accounts.onboarding_status = 'completed'
  );
$$;

revoke all on function public.is_own_account(uuid) from public;
revoke all on function public.is_approved_public_profile(uuid) from public;
grant execute on function public.is_own_account(uuid) to authenticated;
grant execute on function public.is_approved_public_profile(uuid) to anon, authenticated;

-- Authenticated users can see only their own account. There are deliberately no
-- INSERT, UPDATE, or DELETE policies: status and onboarding transitions are
-- controlled by trusted registration/application code.
create policy accounts_select_own
on public.accounts
for select
to authenticated
using (auth_user_id = (select auth.uid()));

-- Profiles contain only approved public profile fields. Public visibility is
-- limited to active accounts that completed onboarding.
create policy profiles_select_public_approved
on public.profiles
for select
to anon, authenticated
using (
  (select public.is_approved_public_profile(account_id))
);

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (
  (select public.is_own_account(account_id))
);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (
  (select public.is_own_account(account_id))
)
with check (
  (select public.is_own_account(account_id))
);

-- RLS controls rows; column grants additionally limit browser updates to fields
-- that a user is allowed to edit. account_id and timestamps remain immutable.
revoke all on public.accounts from anon, authenticated;
grant select on public.accounts to authenticated;

revoke all on public.auth_identities from anon, authenticated;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (display_name, username, avatar_url, bio, city)
  on public.profiles to authenticated;

revoke all on public.legal_acceptances from anon, authenticated;
grant select on public.legal_acceptances to authenticated;

create policy legal_acceptances_select_own
on public.legal_acceptances
for select
to authenticated
using (
  (select public.is_own_account(account_id))
);

comment on table public.auth_identities is
  'Trusted identity mapping. Never insert or update from a browser client.';
comment on column public.auth_identities.provider_metadata is
  'Provider snapshot for audit only; it must not overwrite user-edited profile fields.';
