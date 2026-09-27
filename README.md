# Tenantly

Tenantly helps Baltimore City tenants who've been taken to rent court check whether their landlord had the rental license the law requires to bring the case, and then shows them exactly what to do next.

## Live app

**Deployed on Vercel:** [tenantly-blush.vercel.app](https://tenantly-blush.vercel.app)

## Why we built this

In Baltimore City, a landlord needs an active rental license to file a failure-to-pay-rent case against a tenant. If there was no license on the filing date, the tenant has a defense, and the case can be dismissed.

Most tenants never find out. In the Public Justice Center's study of more than 100 contested eviction cases in Baltimore City rent court, **over 70% of landlords either left the rental license information off the complaint or gave the court invalid information** ([_Justice Diverted_, Public Justice Center, 2015](https://abell.org/publication/justice-diverted-how-renters-are-processed-in-the-baltimore-city-rent-court/)). Tenants face these hearings with little time, usually without a lawyer, and with no easy way to check the city's license records themselves.

Tenantly turns that check into a few minutes on a phone, and connects tenants who have a defense with legal aid organizations that can help them raise it.

## What it does

A tenant photographs or uploads their summons. Tenantly reads it, confirms the property is in Baltimore City, checks the landlord's rental license, and gives them a result, next steps, and documents to bring to court. Legal aid advocates get a console of the cases tenants choose to share with them.

### For tenants (no account needed)

- **Scan or upload the summons.** Take a photo with the phone or webcam, drag in a file, or browse for a photo or PDF (up to 10 MB). Or enter the details by hand.
- **Automatic page detection.** OpenCV finds the summons in the photo and flattens it, like a document scanner, before it's uploaded.
- **AI reading of the summons.** Gemini extracts the property address, case number, landlord, court, filing date, hearing date and time, and the license number written on the complaint. Each field shows how confident the reading is.
- **Review and correct.** The tenant confirms or fixes every field, with clear errors next to anything that needs attention.
- **Address check.** ArcGIS geocodes the address and checks it against the official Baltimore City boundary. Addresses outside the city (for example, in Baltimore County) get their own screen, with resources that apply there.
- **License check.** The tenant is guided through the city's official rental license lookup: the address to copy, a direct link, and what to look for. They then report what they found. (See [Challenges we faced](#challenges-we-faced) for why this isn't automatic yet.)
- **Clear result.** No license found, an expired license, an active license, or not verified, each with what it means for the case.
- **Next steps:**
  - **Request certification:** where and how to request the official DHCD certification the court needs as evidence.
  - **Court preparation:** a checklist that saves as the tenant ticks items, plus add-to-calendar for the hearing.
  - **Free legal help:** volunteer attorneys at the courthouse, and verified phone numbers for Maryland Legal Aid, the Public Justice Center and the Maryland Court Help Center.
- **Downloadable PDFs.** A license check summary and a court preparation checklist, generated from the tenant's own case.
- **Share with legal aid.** With explicit consent, the tenant shares the case with the Public Justice Center, Maryland Legal Aid or Maryland Volunteer Lawyers Service. They can withdraw sharing at any time.
- **Anonymous outcome report.** After the hearing, the tenant can report what happened. The report is stored with no link to their case.
- **Read aloud.** Every page can be read aloud with a natural voice, for tenants who find reading hard.
- **Works on any device.** Every screen is designed for both phone and desktop, meets accessibility basics (labels, keyboard use, visible focus, announced errors), and loads with skeleton placeholders while data arrives.

### For legal aid advocates

- **Invitation-only accounts.** Administrators invite teammates by link; there is no public sign-up. Password reset works by email.
- **Overview.** Key numbers, hearings this week, cases that need attention, and reported outcomes.
- **Cases.** Search by address, case number, landlord or reference; filter by status; page through results.
- **Case detail.** License verification, summons details, next actions and the case's activity timeline. Advocates can record the DHCD certification, re-run the lookup, assign a case to themselves, and export the case as a PDF.
- **License lookups.** Every lookup and its result, with a CSV export.
- **Impact reports.** License checks per month, the share with no license, cases shared, and reported outcomes, with a CSV export.
- **Team and settings.** Invite and withdraw teammates, update your profile and notification preferences, and sign out.

### Privacy by design

- **No tenant accounts.** A tenant's case is tied to their browser by a secure cookie. The database stores only a hash of that cookie's secret.
- **Documents deleted after reading.** The uploaded summons is deleted as soon as it has been read.
- **Only shared with consent.** Advocates can see a case only after the tenant shares it with their organization. Row-level security in the database enforces this, not just the app.
- **Automatic deletion.** Cases that are never shared are deleted automatically after the hearing.
- **Anonymous outcomes.** Outcome reports aren't linked to any case or organization.

## Video demonstration

https://github.com/user-attachments/assets/7b2454f1-0add-486b-87b1-47d42dcb53e8

## Slides

_Slides coming soon._

## Tech stack

| Technology | How we use it |
| --- | --- |
| **Next.js 16** (App Router) | The whole app: server-rendered pages, route groups for the tenant flow, info pages and advocate console, Server Actions for every form and button that changes data, route handlers for PDFs, CSV exports and speech, loading and error boundaries, streaming search results, and the proxy that protects the console. |
| **React 19** | Server Components for data fetching, and Client Components with `useActionState` and `useOptimistic` for forms and instant checklist updates. |
| **TypeScript** | End to end, including database types generated from the Supabase schema. |
| **Tailwind CSS 4** | All styling, driven by design tokens (colors, type scale, radii) taken from our Figma design. |
| **Figma** | The design system and every screen, for mobile and desktop (65+ frames). We built each page against its frames, with the Figma MCP integration. |
| **Supabase** | Postgres database for cases, license checks, license records, activity, organizations, advocates and invitations; row-level security so advocates see only their organization's shared cases; Auth for advocate sign-in, invitations and password reset; private Storage for uploaded summonses; and a scheduled `pg_cron` job that deletes expired unshared cases. |
| **Gemini API** | Reads the summons photo or PDF and returns structured JSON (every field with a confidence level), validated against a schema before we use it. |
| **ArcGIS** | The ArcGIS geocoding service turns the address into a verified, normalized location. Baltimore City's public ArcGIS boundary service then confirms whether it's inside the city. |
| **ElevenLabs** | Text-to-speech for the read-aloud buttons, streamed as MP3 from our own API route. |
| **OpenCV** (OpenCV.js) | In the browser, before upload: edge detection (Canny), finding the page outline, and a perspective warp that flattens angled photos of the summons to a clean, upright page. It loads only when a tenant uploads a photo. |
| **Playwright** | End-to-end tests of the real product against the live services: the full tenant flow from upload to outcome, edge cases (validation errors, out-of-city addresses, expired sessions), advocate sign-in, and the console (search, filters, pagination, case detail, exports), on mobile and desktop screen sizes. We also used it to verify each screen against the Figma designs, and to test the OpenCV scanner on angled photos. |
| **React PDF + pdf-lib** | Generate the downloadable PDFs (summary, court checklist, case export), with page numbers stamped by pdf-lib. |
| **Zod** | Validates every form and API input on the server, and Gemini's output. |
| **Lucide** | Icons. |
| **Vercel** | Hosting, with functions in the region closest to our Supabase database. |

## Challenges we faced

**Automating the DHCD license lookup with Playwright.** The only authoritative source of Baltimore City rental license records is DHCD's public OpenGov "Rental License Look-Up" portal. Our plan was to have Playwright search it automatically for each tenant. It turned out that no automated browser can get through:

1. **Robots policy.** The portal's `robots.txt` disallows all automated access.
2. **Locked API.** The portal's records API answers `forbidden` to requests that don't come from a verified browser session, and Cloudflare rate-limits repeated requests.
3. **Cloudflare human verification.** Every search triggers Cloudflare Turnstile ("Verify you are human"). It blocked us in headless Chromium, in a normal visible browser window, and even when a person ticked the box by hand inside the Playwright-controlled browser. Cloudflare detects the automation and fails the verification.

Getting past it would have meant defeating a CAPTCHA, which we weren't willing to do. So Tenantly uses a guided check today: the tenant runs the official lookup themselves, with the address to copy, a direct link and step-by-step instructions, and reports what they found. The lookup is built behind a single interface (`src/lib/license/verify.ts`), so it can switch to fully automatic results without changing any pages once DHCD provides API access, a data export, or an exemption for our server. Playwright still does a lot of work in the project, as our end-to-end testing tool.

**No public license dataset.** Baltimore's public ArcGIS services have a "Licenses" table, but it turned out to hold liquor licenses. The only rental registration layer has a few hundred rows, all marked "No". We verified this before designing the guided check.

**Getting the AI model running.** Our first Gemini project was restricted and then needed prepaid credits before any request would work. We built the flow so tenants could always enter details by hand, so the app never depended on the model being available.

**Keeping privacy promises honest.** The design promised anonymous outcome reports and that unshared cases wouldn't be kept. We changed the database to match rather than softening the wording: outcome reports now have no link to a case, and unshared cases are deleted automatically after the hearing.

**Smaller technical puzzles.**
- **OpenCV.js never finished loading:** its module object has its own `then`, so passing it straight to `resolve()` made the loading promise wait forever. The fix was to hand it back wrapped in an object.
- **Page numbers vanished from PDFs:** react-pdf drops page-number text whenever the page sets a line height. We stamp the numbers afterwards with pdf-lib instead.

## Running it locally

1. **Install:** `npm install`. This also copies OpenCV.js into `public/vendor`.
2. **Configure:** copy `.env.example` to `.env.local` and fill in the Supabase, Gemini, ArcGIS and ElevenLabs keys.
3. **Set up the database:** `npm run db:push` applies the migrations and seed data to your Supabase project.
4. **Create an advocate account:** either invite someone with `npm run invite -- --org pjc --email you@example.org --admin`, or load demo cases and an admin account with `npm run seed:demo -- --org pjc --email you@example.org --password '<12+ characters>'`.
5. **Run it:** `npm run dev`, then open http://localhost:3000.
6. **Run the tests:** `npm run test:e2e`, which needs `E2E_ADVOCATE_EMAIL` and `E2E_ADVOCATE_PASSWORD` in `.env.local`. To test a deployment instead of your machine, set `E2E_BASE_URL`, e.g. `E2E_BASE_URL=https://tenantly-blush.vercel.app npm run test:e2e`.
