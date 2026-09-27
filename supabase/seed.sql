-- Legal aid organizations tenants can share their case with (the share screen's options).
insert into public.organizations (slug, name, short_description, description, callback_phone, languages)
values
  ('pjc', 'Public Justice Center', 'Tenant advocacy', 'Tenant advocacy · Responds by phone', '410-625-9409', 'English, Spanish'),
  ('mla', 'Maryland Legal Aid', 'Income eligibility applies', 'Civil legal services · Income eligibility applies', '888-465-2468', 'English, Spanish'),
  ('mvls', 'Maryland Volunteer Lawyers Service', 'Income eligibility applies', 'Volunteer attorneys · Income eligibility applies', null, 'English')
on conflict (slug) do nothing;
