# Tactfully

Tactfully is a client-conversation copilot for freelancers and independent consultants. It helps independent professionals understand difficult client messages, spot commercial and relationship risks, choose a response strategy, and draft a reply they remain in control of.

## MVP capabilities

- Analyze a client message and summarize the likely request without pretending to know hidden intent.
- Flag practical risks such as scope creep, delayed payment, discount pressure, and unclear expectations.
- Recommend a response strategy and identify a boundary or fact worth protecting.
- Generate two meaningfully different reply approaches with guidance on when each is useful.
- Add optional project context (scope, deadlines, payment terms, or prior agreements) to improve the analysis.
- Save the original message, project context, structured analysis, and reply options in the user's private conversation history.
- Edit saved reply drafts and delete conversations.
- Enforce a daily free usage limit on the server with an atomic database function.

## Product scope

The first market is freelancers and independent consultants. Team inboxes, email/WhatsApp integrations, autonomous sending, full CRM features, and enterprise analytics are deliberately out of scope for the first release.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- Gemini API
- Vercel Analytics

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in the Supabase and Gemini values:

```bash
cp .env.example .env.local
```

3. Apply both SQL migrations in order (or use your Supabase migration workflow):

```text
supabase/migrations/20260920_create_profiles_and_drafts.sql
supabase/migrations/20261122_harden_profiles_and_add_usage_metering.sql
```

4. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Environment variables

Required for the MVP:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

The PayPal order endpoints are disabled while the product uses free early access. Do not enable paid checkout until recurring billing, renewals, cancellations, webhooks, and entitlement reconciliation are implemented and tested.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Security notes

- Profile plan changes are not available to authenticated browser clients.
- The usage counter is incremented by a security-definer Postgres function that checks the caller's authenticated user ID and applies the free limit atomically.
- Saved drafts and analysis are scoped to their owner by Supabase Row Level Security.
- AI output is a suggestion only. Tactfully does not send messages or provide legal advice.

## Delivery notes

See [docs/PRODUCT-MVP-PLAN.md](docs/PRODUCT-MVP-PLAN.md) for product positioning, scope, validation targets, and delivery sequence. Use [docs/QA-ACCEPTANCE-CHECKLIST.md](docs/QA-ACCEPTANCE-CHECKLIST.md) before accepting a preview or release.
