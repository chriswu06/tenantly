-- Standing: core schema.
--
-- Tenants have no account. The app's server creates and reads their case with
-- the service-role key, after checking the case cookie (see src/lib/cases/session.ts).
-- Advocates sign in with Supabase Auth and see only their organization's cases
-- (row-level security in 0002_rls_policies.sql).

create extension if not exists pgcrypto;

-- Enums

create type public.case_stage as enum (
  'needs_review',        -- summons read, details not yet confirmed
  'verifying',           -- address confirmed, license check under way
  'needs_certification', -- result in, DHCD certification not yet requested
  'ready_for_court',     -- certification requested, preparing for the hearing
  'closed'               -- outcome reported
);

create type public.license_result as enum (
  'pending',          -- not checked yet
  'no_license',       -- no license found for the address
  'expired',          -- a license existed but had lapsed by the filing date
  'active',           -- an active license covered the filing date
  'needs_review',     -- conflicting information; an advocate should look
  'could_not_verify'  -- lookup unavailable and no guided check yet
);

create type public.field_confidence as enum ('confirmed', 'needs_review', 'uncertain', 'missing');

create type public.case_outcome as enum (
  'raised_license_defense',
  'case_dismissed',
  'case_postponed',
  'did_not_raise_defense',
  'did_not_attend'
);

create type public.advocate_role as enum ('staff_attorney', 'supervising_attorney', 'paralegal', 'intake_specialist');

-- Organizations and advocates

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,               -- 'pjc', 'mla', 'mvls'
  name text not null,
  short_description text,                  -- "Tenant advocacy"
  description text,                        -- "Tenant advocacy · Responds by phone"
  callback_phone text,
  languages text,
  accepts_referrals boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.advocates (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete restrict,
  full_name text not null,
  email text not null,
  role public.advocate_role not null default 'staff_attorney',
  is_admin boolean not null default false,
  notify_shared boolean not null default true,
  notify_hearing boolean not null default true,
  notify_lookup boolean not null default false,
  created_at timestamptz not null default now()
);
create index advocates_organization_idx on public.advocates (organization_id);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role public.advocate_role not null default 'staff_attorney',
  is_admin boolean not null default false,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references public.advocates (id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);
create index invitations_organization_idx on public.invitations (organization_id);
create unique index invitations_open_email_idx on public.invitations (organization_id, lower(email)) where accepted_at is null;

-- Cases

create sequence public.case_reference_seq start 1000;

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique
    default 'STD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.case_reference_seq')::text, 4, '0'),
  -- sha256 of the secret in the tenant's case cookie. The secret itself is never stored.
  access_token_hash text not null,
  stage public.case_stage not null default 'needs_review',

  -- Summons details (confirmed by the tenant on the review screen)
  property_address text,
  case_number text,
  court text,
  landlord_name text,
  filing_date date,
  hearing_at timestamptz,
  license_number_on_complaint text,
  -- What Gemini read, with a confidence per field: { "propertyAddress": { "value": "...", "confidence": "confirmed" }, ... }
  extracted jsonb not null default '{}'::jsonb,
  -- Storage path of the uploaded summons; cleared once it has been read and deleted.
  summons_path text,

  -- Address checks
  normalized_address text,
  latitude double precision,
  longitude double precision,
  in_baltimore_city boolean,
  jurisdiction text,

  license_result public.license_result not null default 'pending',

  -- Next steps
  certification_requested_at timestamptz,
  certification_received_at timestamptz,
  checklist jsonb not null default '{}'::jsonb,   -- { "summons": true, "photo-id": false, ... }

  -- Sharing with legal aid (set only with the tenant's consent)
  organization_id uuid references public.organizations (id) on delete set null,
  assignee_id uuid references public.advocates (id) on delete set null,
  tenant_first_name text,
  tenant_phone text,
  tenant_language text,
  shared_at timestamptz,

  outcome public.case_outcome,
  outcome_reported_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cases_organization_idx on public.cases (organization_id, created_at desc);
create index cases_hearing_idx on public.cases (organization_id, hearing_at);

-- One row per license lookup (automatic or the tenant's guided check). Shown in "License lookups".
create table public.license_checks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  method text not null check (method in ('automatic', 'guided')),
  result public.license_result not null,
  source text not null,                  -- 'Baltimore City DHCD', 'Tenant guided check'
  lookup_address text,
  response_ms integer,                   -- null when the lookup timed out or was guided
  error text,
  checked_at timestamptz not null default now()
);
create index license_checks_case_idx on public.license_checks (case_id, checked_at desc);

-- License records found for the address (empty when none were found).
create table public.license_records (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  license_number text not null,
  status text not null check (status in ('active', 'expired')),
  valid_from date,
  valid_to date,
  source text not null
);
create index license_records_case_idx on public.license_records (case_id);

-- Case timeline, shown as "Activity".
create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases (id) on delete cascade,
  actor text not null,                   -- 'Tenant', 'System', or an advocate's name
  advocate_id uuid references public.advocates (id) on delete set null,
  title text not null,
  created_at timestamptz not null default now()
);
create index case_events_case_idx on public.case_events (case_id, created_at);

-- Housekeeping

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger cases_touch_updated_at
  before update on public.cases
  for each row execute function public.touch_updated_at();
