# Tactfully

Tactfully is an AI-powered client communication assistant for freelancers and support teams. It helps users draft better replies, choose a tone for the situation, and maintain a cleaner communication workflow.

## What it does

- Generate polished client replies from raw incoming messages
- Suggest tone and response strategies based on situation context
- Save drafts in Supabase for later editing
- Gate advanced usage behind a simple Pro plan flow
- Support authentication and protected dashboard access

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- PayPal Checkout
- Vercel Analytics
- Gemini API for reply generation

## Repository structure

```text
app/
  api/                API routes for auth, generation, and PayPal flows
  dashboard/          authenticated workspace and draft management UI
  sign-in/            sign-in pages
  sign-up/            sign-up pages
  privacy/            privacy policy pages
  terms/              terms pages
  globals.css         global styling
  layout.tsx          root layout
  page.tsx            landing page
components/
  ui/                 shadcn-style primitives
  *.tsx               landing-page sections and shared UI
lib/
  supabase/           auth and database client helpers
  utils.ts            utility helpers
public/               static assets and placeholders
middleware.ts         route protection middleware
next.config.mjs       Next.js config
package.json          app metadata and scripts
supabase/
  migrations/         database schema files
```

## Quick start checklist

Before the app works, make sure you have all of these configured:

1. Supabase project created and URL/anon key added to `.env.local`
2. Supabase migration applied: `supabase/migrations/20260920_create_profiles_and_drafts.sql`
3. Gemini key added: `GEMINI_API_KEY`
4. PayPal sandbox credentials added for Pro checkout
5. App started locally with `npm run dev`

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and add real values:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open the app in your browser at `http://localhost:3000`.

## Required environment variables

Create a `.env.local` file using the values from `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_MODE=sandbox
GEMINI_API_KEY=
```

Important: the AI reply generation route requires `GEMINI_API_KEY` in order to work. Without it, the app cannot generate drafts.

## Database setup

This project expects a Supabase project with at least the following schema. The migration file is stored in:

```text
supabase/migrations/20260920_create_profiles_and_drafts.sql
```

Apply it in the Supabase SQL editor or with your migration tool before signing in for the first time.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Deployment

This app is designed for deployment on Vercel with a connected Supabase project and PayPal credentials. Configure the environment variables in the Vercel project settings before deploying.

## Notes

- The repository currently expects a configured Supabase project for authentication and draft persistence.
- The PayPal checkout flow is server-side and verifies the capture before enabling Pro access.
- If you are moving to production, set `PAYPAL_MODE=live` and use your live PayPal credentials.
- If you are testing locally, generate the `.env.local` file first so the app can create drafts immediately.
