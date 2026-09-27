-- Row-level security.
--
-- anon (the public key without a session) gets nothing: tenants never talk to the
-- database directly. Signed-in advocates see and change only their own
-- organization's data. The app's server uses the service-role key, which bypasses
-- these policies, for tenant flows and for work like accepting invitations.

alter table public.organizations enable row level security;
alter table public.advocates enable row level security;
alter table public.invitations enable row level security;
alter table public.cases enable row level security;
alter table public.license_checks enable row level security;
alter table public.license_records enable row level security;
alter table public.case_events enable row level security;

-- Helpers (security definer so policies can read advocates without recursing into its own policy).

create function public.current_organization_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select organization_id from public.advocates where id = (select auth.uid())
$$;

create function public.current_advocate_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select is_admin from public.advocates where id = (select auth.uid())), false)
$$;

revoke execute on function public.current_organization_id() from public, anon;
revoke execute on function public.current_advocate_is_admin() from public, anon;
grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.current_advocate_is_admin() to authenticated;

-- Table privileges: nothing for anon; reads for advocates; writes only where listed.

revoke all on all tables in schema public from anon;
revoke insert, update, delete on all tables in schema public from authenticated;
grant select on all tables in schema public to authenticated;

-- Organizations

create policy "Advocates read their organization"
  on public.organizations for select to authenticated
  using (id = (select public.current_organization_id()));

-- Advocates

create policy "Advocates read their teammates"
  on public.advocates for select to authenticated
  using (organization_id = (select public.current_organization_id()));

-- Advocates edit their own profile, and only these columns.
grant update (full_name, role, notify_shared, notify_hearing, notify_lookup) on public.advocates to authenticated;
create policy "Advocates update their own profile"
  on public.advocates for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Invitations

create policy "Advocates read their organization's invitations"
  on public.invitations for select to authenticated
  using (organization_id = (select public.current_organization_id()));

grant insert (organization_id, email, role, is_admin, invited_by) on public.invitations to authenticated;
create policy "Admins invite to their organization"
  on public.invitations for insert to authenticated
  with check (
    organization_id = (select public.current_organization_id())
    and (select public.current_advocate_is_admin())
    and invited_by = (select auth.uid())
  );

grant delete on public.invitations to authenticated;
create policy "Admins withdraw open invitations"
  on public.invitations for delete to authenticated
  using (
    organization_id = (select public.current_organization_id())
    and (select public.current_advocate_is_admin())
    and accepted_at is null
  );

-- Cases

create policy "Advocates read cases shared with their organization"
  on public.cases for select to authenticated
  using (organization_id = (select public.current_organization_id()));

-- Advocates can move a case along, but not rewrite what the tenant submitted.
grant update (stage, assignee_id, license_result, certification_requested_at, certification_received_at, outcome, outcome_reported_at)
  on public.cases to authenticated;
create policy "Advocates update cases shared with their organization"
  on public.cases for update to authenticated
  using (organization_id = (select public.current_organization_id()))
  with check (organization_id = (select public.current_organization_id()));

-- The tenant's secret hash is never readable, even by advocates on the case. A column
-- revoke doesn't override a table-wide grant, so grant every other column explicitly.
revoke select on public.cases from authenticated;
grant select (
  id, reference, stage, property_address, case_number, court, landlord_name, filing_date, hearing_at,
  license_number_on_complaint, extracted, summons_path, normalized_address, latitude, longitude,
  in_baltimore_city, jurisdiction, license_result, certification_requested_at, certification_received_at,
  checklist, organization_id, assignee_id, tenant_first_name, tenant_phone, tenant_language, shared_at,
  outcome, outcome_reported_at, created_at, updated_at
) on public.cases to authenticated;

-- Case details

create policy "Advocates read lookups for their cases"
  on public.license_checks for select to authenticated
  using (exists (select 1 from public.cases c where c.id = case_id and c.organization_id = (select public.current_organization_id())));

create policy "Advocates read license records for their cases"
  on public.license_records for select to authenticated
  using (exists (select 1 from public.cases c where c.id = case_id and c.organization_id = (select public.current_organization_id())));

create policy "Advocates read activity for their cases"
  on public.case_events for select to authenticated
  using (exists (select 1 from public.cases c where c.id = case_id and c.organization_id = (select public.current_organization_id())));

grant insert (case_id, actor, advocate_id, title) on public.case_events to authenticated;
create policy "Advocates add activity to their cases"
  on public.case_events for insert to authenticated
  with check (
    advocate_id = (select auth.uid())
    and exists (select 1 from public.cases c where c.id = case_id and c.organization_id = (select public.current_organization_id()))
  );
