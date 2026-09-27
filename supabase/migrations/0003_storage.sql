-- Private storage for uploaded summons photos and PDFs.
--
-- Only the app's server (service-role key) reads or writes this bucket, so there
-- are no policies for anon or authenticated. Files are deleted as soon as Gemini
-- has read them ("Documents deleted after reading" on the start screen).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'summons',
  'summons',
  false,
  10485760, -- 10 MB, as the upload screen says
  array['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;
