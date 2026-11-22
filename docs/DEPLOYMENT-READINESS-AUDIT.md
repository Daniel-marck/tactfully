# Tactfully deployment readiness audit

This document records the configuration required to make the MVP usable. A successful Next.js build does not prove that authentication, Postgres, or Gemini requests work.

## Required Vercel environment variables

Set all three for both **Preview** and **Production** (Production remains untouched until an explicit release approval):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase publishable/anon key.
- `GEMINI_API_KEY` — server-only Gemini API key.

Optional:

- `GEMINI_MODEL` — defaults to `gemini-3.5-flash-lite`.

Do not add the Supabase service-role key to browser code. The MVP uses the authenticated Supabase client and Row Level Security.

## Required database migrations

Apply in this order to the Supabase project used by the Preview deployment:

1. `supabase/migrations/20260920_create_profiles_and_drafts.sql`
2. `supabase/migrations/20261122_harden_profiles_and_add_usage_metering.sql`

Verify that the profile usage columns, draft analysis/context columns, and `increment_draft_count(uuid)` RPC exist. Confirm the profile self-update policy is absent and that draft RLS isolates records by `auth.uid()`.

## Current audit status

- Repository code and deployment configuration inspected.
- Browser Supabase client now fails with an actionable configuration message instead of an opaque client initialization error.
- Sign-in and sign-up surfaces show a deployment configuration warning when public Supabase settings are absent.
- AI route reports missing required environment variable names without exposing secret values.
- Gemini retries now use a fresh timeout signal per attempt. HTTP 429 quota/rate-limit responses are distinguished from transient upstream 5xx failures.
- Supabase environment values and migration state cannot be verified from GitHub or Vercel metadata. Confirm them in the connected Supabase project before treating authentication, saved conversations, or quota enforcement as live.
- Real-user signup, email confirmation, sign-in, RLS isolation, generation, and quota journeys remain blocked pending connected Supabase configuration and test credentials.

## Release gate

Do not merge to `main` or promote a production deployment until the Preview environment has all required variables, both migrations are applied, and the acceptance checklist passes using two separate test users.
