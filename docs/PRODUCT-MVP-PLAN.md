# Tactfully — focused MVP plan

## Product thesis

Tactfully helps freelancers and independent consultants respond to difficult client messages without giving away their leverage, accepting unclear scope, or damaging the relationship.

**Primary user:** solo freelancers and independent consultants who manage client communication themselves.

**Core job to be done:** "When a client sends a difficult or ambiguous message, help me understand what is happening, choose a sensible response strategy, and produce a message I can confidently edit and send."

## Positioning

**Working positioning:** The client-conversation copilot for independent professionals.

Avoid positioning Tactfully as a generic AI writer, a customer-support platform, a sales CRM, or a tool that guarantees negotiation outcomes.

## MVP scope

### P0 — required before public launch

1. **Message analysis**
   - Summarize the client's likely intent.
   - Identify the communication situation.
   - Flag practical risks such as scope creep, payment delay, discount pressure, unclear expectations, or escalation.
   - Recommend a response strategy.
   - Identify the boundary or fact the freelancer should protect.
2. **Strategic reply options**
   - Two genuinely different approaches (for example, collaborative vs. firm).
   - Explain when each approach is useful.
   - Draft editable, ready-to-send language.
   - Never invent dates, prices, contract terms, or promises.
3. **Conversation library**
   - Save the incoming message, optional project context, selected situation, analysis, and reply options.
   - Reopen, edit reply text, copy, and delete saved items.
   - Keep all records private to their owner.
4. **Account and usage controls**
   - Supabase authentication.
   - Server-side plan checks and atomic daily free usage limit.
   - No client-side ability to grant a paid plan.
5. **Trustworthy pricing**
   - Do not advertise a recurring subscription until recurring billing, cancellation, renewal, and payment webhooks are implemented and tested.
   - Never describe a one-time PayPal order as a monthly subscription.
6. **Honest marketing**
   - No invented customer logos, testimonials, statistics, or unsupported feature claims.
   - Landing page language must match working product functionality.

### P1 — after the core loop is validated

- Lightweight client profiles with user-controlled context.
- Reusable response preferences and tone presets.
- Follow-up reminders.
- Export and delete account data.
- Usage and value feedback.

### Explicitly out of scope for the first release

- Shared team inboxes and team seats.
- Gmail/Outlook/WhatsApp integrations.
- Autonomous sending of messages.
- Full CRM, invoicing, contract management, or legal advice.
- Enterprise analytics.

## Primary user journey

1. Visitor understands the product and sees a real, representative example.
2. Visitor creates an account.
3. User pastes a client message and chooses a situation (or accepts a suggested classification).
4. Tactfully returns a concise analysis, risk flags, a recommended strategy, and two distinct draft options.
5. User edits/copies a response and saves the conversation.
6. User returns to the library to reuse context and past work.
7. Free usage limits are explained clearly; paid billing is offered only when the billing lifecycle is real and verified.

## Product quality bar

- Useful output should be more than paraphrasing: analysis must change the user's decision or wording.
- The two options must differ in strategy, not just synonyms.
- User remains in control; nothing is sent automatically.
- Generated content is presented as a draft, not legal, financial, or contractual advice.
- Every saved record is isolated by Supabase RLS.
- Usage limits are enforced atomically on the server.
- Errors are actionable and never expose provider secrets or raw internal stack traces.

## Commercial validation

Before adding more features:
- Interview 10 freelancers/consultants who regularly negotiate scope, deadlines, or payment.
- Run 5 observed usability sessions with realistic client messages.
- Measure: time to usable reply, percentage of drafts copied/edited, repeat use within 7 days, and willingness to pay.
- Seek at least 3 users willing to pay before investing in integrations or team functionality.

## Delivery sequence

1. Repository and product audit.
2. Repair database schema, usage enforcement, and API contracts.
3. Deliver structured message analysis and strategic reply options.
4. Connect analysis to the dashboard and saved conversation library.
5. Remove unsupported marketing claims and align pricing with actual billing.
6. Run typecheck, lint, production build, and end-to-end tests.
7. Deploy a preview; do not promote to production until secrets, Supabase migration, billing, and acceptance tests are verified.

## Implementation status on the MVP branch

- **Implemented in code:** structured message analysis and two strategic reply options; dashboard rendering; saved analysis and reply guidance; optional project context; editable saved replies; conversation deletion; request validation; safer API error handling.
- **Implemented in migration, not yet applied to Supabase:** JSONB analysis storage, daily usage fields, atomic UTC usage metering, and removal of the profile self-update policy that exposed plan escalation.
- **Marketing updated:** freelancer-focused positioning, accurate early-access pricing, removal of unverified customer logos and unsupported feature claims.
- **Billing intentionally disabled:** the former PayPal flow was a one-time capture presented as monthly recurring billing. Reintroduce paid plans only after recurring subscriptions, renewals, cancellations, webhooks, and entitlement reconciliation are implemented and tested.
- **Trust and policy:** privacy and terms pages now describe early access, the actual data sent to Gemini, user responsibilities, and the absence of paid checkout.
- **CI:** GitHub Actions now runs TypeScript, ESLint, and a production build on pull requests. The latest run has passed TypeScript and ESLint; production build is still running.
- **Still unverified:** applying the SQL migration to the connected Supabase project, end-to-end tests against real Supabase/Gemini credentials, and a current Vercel preview deployment.