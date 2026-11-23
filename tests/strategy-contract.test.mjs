import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const route = await readFile(new URL('../app/api/generate/route.ts', import.meta.url), 'utf8');
const landing = await readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
const privacy = await readFile(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8');
const terms = await readFile(new URL('../app/terms/page.tsx', import.meta.url), 'utf8');
const dashboard = await readFile(new URL('../app/dashboard/draft-form.tsx', import.meta.url), 'utf8');

test('generation prompt assigns three distinct tactical jobs', () => {
  assert.match(route, /DIPLOMATIC — RELATIONSHIP \+ COLLABORATION/);
  assert.match(route, /FIRM & PROFESSIONAL — BOUNDARY \+ RATIONALE/);
  assert.match(route, /DIRECT — DECISION \+ CLOSE/);
  assert.match(route, /Diplomatic should reduce friction and open a collaborative route/);
  assert.match(route, /Firm should establish the rule, scope, or condition and why it applies/);
  assert.match(route, /Direct should close the loop with a concise decision or choice/);
  assert.match(route, /If two options use the same tactic, rewrite them/);
});

test('generation prompt differentiates common client-conflict scenarios', () => {
  assert.match(route, /For scope creep, the three moves must be observably different/);
  assert.match(route, /DIPLOMATIC invites a collaborative review/);
  assert.match(route, /FIRM states that the requested items are outside the agreed deliverables/);
  assert.match(route, /DIRECT presents the two paths and asks the client to choose/);
  assert.match(route, /These must not all ask whether the client wants an estimate/);
  assert.match(route, /For low offers, distinguish exploring a scope adjustment/);
  assert.match(route, /For late payment, distinguish a courteous payment check-in/);
  assert.match(route, /For no response, distinguish a warm re-engagement/);
});

test('generation prompt prohibits invented commercial commitments', () => {
  assert.match(route, /HARD FACTUALITY RULE/);
  assert.match(route, /Never introduce a deadline, date, time limit, price, percentage, quantity/);
  assert.match(route, /Do not turn the client's requested deadline into a commitment/);
  assert.match(route, /assuring the client that extra work will not affect the current timeline/);
  assert.match(route, /Do not present reprioritization as a way to include extra work for free/);
  assert.match(route, /Never promise that added work will not affect timelines/);
});

test('API keeps the three-option response contract and sufficient output budget', () => {
  assert.match(route, /const NUM_OPTIONS = 3/);
  assert.match(route, /maxItems: NUM_OPTIONS/);
  assert.match(route, /maxOutputTokens: 900/);
  assert.match(route, /replies.length !== NUM_OPTIONS/);
});


test('AI generation retries transient provider overload across fallback models', () => {
  assert.match(route, /export const maxDuration = 50/);
  assert.match(route, /gemini-3\.5-flash-lite/);
  assert.match(route, /gemini-3\.8-flash/);
  assert.match(route, /new Set\(\[429, 500, 502, 503, 504\]\)/);
  assert.match(route, /AbortSignal\.timeout\(10000\)/);
  assert.match(route, /Your draft allowance was not used/);
});


test('email confirmation callback rejects backslash-based external redirects', async () => {
  const callback = await readFile(new URL('../app/auth/callback/route.ts', import.meta.url), 'utf8');
  assert.ok(callback.includes('requestedNext.includes("\\\\")'));
  assert.ok(callback.includes('requestedNext.startsWith("//")'));
});


test('launch page only advertises implemented product capabilities', () => {
  assert.match(landing, /3 AI replies per day/);
  assert.match(landing, /3 response strategies/);
  assert.match(landing, /Review and approve every reply before sending/);
  assert.doesNotMatch(landing, /sentiment detection|personal communication coach|advanced negotiation support/i);
});


test('legal pages disclose AI provider data handling and daily free limits', () => {
  assert.match(privacy, /free-tier content may be used to improve its products/);
  assert.match(privacy, /paid-tier\s+content is not/);
  assert.match(terms, /3 AI replies per day/);
  assert.match(terms, /Pro subscriptions are not available yet/);
  assert.match(landing, /Pro subscriptions coming soon/);
});


test('generation endpoint validates and bounds untrusted request input', () => {
  assert.match(route, /MAX_MESSAGE_LENGTH = 6000/);
  assert.match(route, /MAX_CONTEXT_FIELD_LENGTH = 500/);
  assert.match(route, /Array\.isArray\(body\)/);
  assert.match(route, /message\.length > MAX_MESSAGE_LENGTH/);
  assert.doesNotMatch(route, /smartoolkit\.gumroad\.com/);
});

test('draft quota enforcement fails closed and checks the atomic increment result', () => {
  assert.match(route, /incrementError \|\| !incrementResult\?\.\[0\]/);
  assert.match(route, /newCount > FREE_DRAFT_LIMIT/);
  assert.match(route, /We couldn't update your draft allowance/);
});


test('workspace signup uses the email confirmation callback and shows a clear next step', () => {
  assert.match(dashboard, /emailRedirectTo: `\$\{window\.location\.origin\}\/auth\/callback\?next=\/dashboard`/);
  assert.match(dashboard, /Account created\. Check your inbox and confirm your email before signing in\./);
  assert.match(dashboard, /role="status"/);
});


test('profile billing state and payment reconciliation records are server-managed', async () => {
  const migration = await readFile(new URL('../supabase/migrations/202611230001_harden_profile_and_payment_record_permissions.sql', import.meta.url), 'utf8');
  assert.match(migration, /drop policy if exists "Users can update own profile"/i);
  assert.match(migration, /revoke all privileges on table public\.profiles from anon, authenticated/i);
  assert.match(migration, /grant select on table public\.profiles to authenticated/i);
  assert.match(migration, /revoke all privileges on table public\.gumroad_unmatched_sales from anon, authenticated/i);
});


test('saved reply edits persist only to the selected owner draft', async () => {
  const migration = await readFile(new URL('../supabase/migrations/202611230002_enable_owner_only_draft_edits.sql', import.meta.url), 'utf8');
  assert.match(migration, /create policy "Users can update own drafts"/i);
  assert.match(migration, /\(select auth\.uid\(\)\) = user_id/i);
  assert.match(migration, /grant update \(original_message, situation, tone, generated_reply\)/i);
  assert.match(dashboard, /\.eq\('id', selectedDraftId\)/);
  assert.match(dashboard, /\.eq\('user_id', user\.id\)/);
  assert.match(dashboard, /Changes saved to your draft history/);
});
