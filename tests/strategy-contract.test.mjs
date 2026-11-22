import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const route = await readFile(new URL('../app/api/generate/route.ts', import.meta.url), 'utf8');

test('generation prompt assigns three distinct tactical jobs', () => {
  assert.match(route, /DIPLOMATIC — RELATIONSHIP + COLLABORATION/);
  assert.match(route, /FIRM & PROFESSIONAL — BOUNDARY + RATIONALE/);
  assert.match(route, /DIRECT — DECISION + CLOSE/);
  assert.match(route, /Diplomatic should reduce friction and open a collaborative route/);
  assert.match(route, /Firm should establish the rule, scope, or condition and why it applies/);
  assert.match(route, /Direct should close the loop with a concise decision or choice/);
});

test('generation prompt covers the core client-conflict scenarios', () => {
  assert.match(route, /For scope creep, distinguish discussing\/prioritizing additions/);
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
