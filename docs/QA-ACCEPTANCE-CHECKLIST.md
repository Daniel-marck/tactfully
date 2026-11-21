# Tactfully MVP — QA and release checklist

Use synthetic client messages and test accounts. Do not test with confidential client information.

## 1. Environment and database

- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in the preview environment.
- [ ] Apply `20260920_create_profiles_and_drafts.sql` to a clean Supabase project.
- [ ] Apply `20261122_harden_profiles_and_add_usage_metering.sql` after the first migration.
- [ ] Confirm `profiles.draft_count`, `profiles.last_draft_date`, `drafts.analysis`, and `drafts.user_context` exist.
- [ ] Confirm `increment_draft_count(uuid)` exists and is executable by authenticated users only.
- [ ] Confirm the authenticated profile update policy is absent.

## 2. Authentication

- [ ] Create a new account and complete email verification if enabled.
- [ ] Sign in and refresh the dashboard.
- [ ] Sign out and confirm saved conversation history is no longer visible.
- [ ] Sign back in and confirm the user's own history loads.

## 3. Message analysis

Use a synthetic message such as: "Could you add two extra pages and keep the original price and delivery date?"

- [ ] Submit the message with no project context.
- [ ] Confirm the result includes a summary, situation label, up to three risk flags, recommended strategy, and boundary to protect.
- [ ] Confirm exactly two reply approaches are shown and are meaningfully different.
- [ ] Confirm each reply has a short explanation of when it is useful.
- [ ] Add project context describing the agreed scope and confirm the analysis reflects it.
- [ ] Confirm the UI allows editing the reply text before copying.
- [ ] Confirm the application never sends a message automatically.
- [ ] Submit a message containing instructions directed at the AI and confirm they are treated as quoted client content, not system instructions.

## 4. Conversation library

- [ ] Generate a conversation and confirm it appears in history.
- [ ] Refresh the page and reopen it.
- [ ] Confirm the original message, project context, analysis, and reply options are restored.
- [ ] Edit a reply, save it, refresh, and confirm the edit persists.
- [ ] Delete the conversation and confirm it disappears after refresh.
- [ ] Cancel the browser confirmation and confirm the conversation remains.

## 5. Daily usage limits

- [ ] Confirm a new Free user starts with three analyses available.
- [ ] Complete three successful analyses and confirm the counter reaches zero.
- [ ] Confirm the next analysis is rejected with a clear daily-limit message.
- [ ] Confirm a provider error or malformed provider response does not increment usage.
- [ ] Confirm the allowance resets at 00:00 UTC.
- [ ] Confirm a Pro profile, if one exists from a previous test, is not blocked by the Free limit.

## 6. Data isolation and security

- [ ] Create two test users.
- [ ] Save conversations as User A.
- [ ] Sign in as User B and confirm User A's conversations cannot be read, edited, or deleted.
- [ ] Attempt to update User B's profile plan from the browser client and confirm RLS rejects it.
- [ ] Confirm no service-role key or Gemini API key is exposed to browser JavaScript.
- [ ] Confirm API requests without a valid authenticated session return 401.
- [ ] Confirm empty and over-limit message/context inputs return clear 4xx responses.

## 7. Release gates

- [ ] GitHub Actions TypeScript check passes.
- [ ] GitHub Actions ESLint passes.
- [ ] GitHub Actions production build passes on the latest PR head.
- [ ] Supabase migration is applied and the database checks above pass.
- [ ] Preview deployment is available and the end-to-end checks pass.
- [ ] Privacy Policy and Terms of Service have been reviewed for the actual hosting, AI provider, retention, and jurisdictional requirements.
- [ ] At least five target freelancers complete observed usability sessions.
- [ ] Do not enable paid checkout until recurring billing, cancellation, renewal, webhooks, and entitlement reconciliation are implemented and tested.

**Release rule:** a green build is necessary, not sufficient. Do not promote to production while the database migration, data isolation, or end-to-end workflow remains unverified.
