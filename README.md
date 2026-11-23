# Tactfully

Tactfully is an AI-assisted workspace for freelancers handling difficult client conversations. It turns a pasted client message and the user's context into three distinct, editable reply strategies.

## Current product capabilities

- Generate three tactically different reply options: diplomatic, firm and professional, and direct.
- Set the situation, preferred tone, desired outcome, and constraints to avoid.
- Edit, copy, save, reopen, and delete saved drafts.
- Search the latest saved drafts.
- Sign in with Supabase Auth and keep each user's drafts private.
- Enforce a free allowance of 3 generations per day. Each generation returns three response strategies.

**Billing status:** Pro is planned at $12 USD/month, but subscriptions are not open and Tactfully is not currently accepting payments. PayPal checkout endpoints are intentionally disabled until recurring billing and entitlement verification are implemented.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS
- Supabase Auth and Postgres with row-level security
- Google Gemini API for reply generation
- Vercel hosting and Analytics

## Repository layout

- `app/` — routes, landing page, dashboard, auth, legal pages, and API handlers
- `components/` — shared UI components
- `lib/supabase/` — browser, server, and session helpers
- `supabase/migrations/` — ordered database migrations
- `proxy.ts` — Supabase session refresh and route protection

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
cp .env.example .env.local
```

3. Configure these required values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is supported as a fallback. Never expose a Supabase service-role key or other server secret through a `NEXT_PUBLIC_*` variable.

4. Apply every SQL migration in `supabase/migrations/` in ascending filename order to the Supabase project. Do not apply only the original schema migration: later migrations add daily usage tracking, draft history, ownership restrictions, saved context fields, and delete permissions.

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful checks

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

The build script runs the test suite before the Next.js production build. Vercel preview builds also run tests and linting.

## Deployment notes

- Deploy preview branches first and verify sign-in, generation, draft persistence, editing, copying, and deletion before promoting a release.
- Configure Supabase Auth email delivery with a production SMTP provider before opening public registration. Supabase's default email service is limited for production use.
- Pro checkout remains disabled. Do not enable or advertise payment collection until recurring subscriptions, cancellation, webhook verification, and entitlement lifecycle handling are implemented and tested.
- Keep the Supabase service-role key, Gemini key, and any future payment secrets in server-only environment variables.
