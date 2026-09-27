-- Privacy promises made in the tenant flow:
--   "Your anonymous court outcome report is never linked to your case."
--   "If you don't share, … it's deleted automatically after your hearing."

-- 1. Anonymous outcome reports: no case, no organization, day-level date only.
create table public.outcome_reports (
  id uuid primary key default gen_random_uuid(),
  outcome public.case_outcome not null,
  reported_on date not null default current_date
);
alter table public.outcome_reports enable row level security;
grant select on public.outcome_reports to authenticated;
create policy "Advocates read anonymous outcome reports"
  on public.outcome_reports for select to authenticated
  using (true);

-- Move any outcomes already stored on cases, then clear them.
insert into public.outcome_reports (outcome, reported_on)
select outcome, coalesce(outcome_reported_at, updated_at)::date from public.cases where outcome is not null;
update public.cases set outcome = null, outcome_reported_at = null where outcome is not null;

-- 2. Delete cases that were never shared, once they're no longer needed:
--    30 days after the hearing, or 60 days after creation when there's no hearing date.
create function public.delete_expired_unshared_cases() returns integer
language plpgsql security definer set search_path = '' as $$
declare
  removed integer;
begin
  delete from public.cases
  where organization_id is null
    and (
      (hearing_at is not null and hearing_at < now() - interval '30 days')
      or (hearing_at is null and created_at < now() - interval '60 days')
    );
  get diagnostics removed = row_count;
  return removed;
end;
$$;
revoke execute on function public.delete_expired_unshared_cases() from public, anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('delete-expired-unshared-cases', '17 4 * * *', 'select public.delete_expired_unshared_cases()');
