import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertServerEnv } from '@/lib/config';

const FREE_DRAFT_LIMIT = 3;
const NUM_OPTIONS = 3;

// Server-side allowlist for isolated preview testing. Never expose this via NEXT_PUBLIC_*.
function isTactfullyTester(email: string | undefined) {
  const testerEmails = (process.env.TACTFULLY_TESTER_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && testerEmails.includes(email.trim().toLowerCase()));
}

export async function POST(req: Request) {
  const requestStartedAt = Date.now();
  try {
    assertServerEnv(['GEMINI_API_KEY'], 'AI generation');

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You need to sign in to draft a reply.' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, draft_count, last_draft_date')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Could not load profile:', profileError);
      return NextResponse.json(
        { error: 'Could not load your account. Try again.' },
        { status: 500 }
      );
    }

    const isTester = isTactfullyTester(user.email);
    const today = new Date().toISOString().slice(0, 10);
    const effectiveDraftCount =
      profile.last_draft_date === today ? profile.draft_count : 0;

    if (!isTester && profile.plan === 'free' && effectiveDraftCount >= FREE_DRAFT_LIMIT) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: `You've used all ${FREE_DRAFT_LIMIT} free drafts for today. They reset tomorrow, or upgrade to Pro for unlimited replies.`,
          upgradeUrl: 'https://smartoolkit.gumroad.com/l/dzlkij',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const message = body.incomingMessage || body.message || body.prompt || '';
    const tone = typeof body.tone === 'string' ? body.tone : 'Formal';
    const situation = typeof body.situation === 'string' ? body.situation : 'A general difficult message';
    const desiredOutcome = typeof body.desiredOutcome === 'string' ? body.desiredOutcome.trim() : '';
    const avoid = typeof body.avoid === 'string' ? body.avoid.trim() : '';

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided to generate a reply for.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in your environment variables.' },
        { status: 500 }
      );
    }

    const prompt = `You are helping a freelancer handle a difficult client conversation.

CLIENT MESSAGE:
"${message}"

SITUATION:
${situation}

PREFERRED WRITING TONE:
${tone}

USER'S DESIRED OUTCOME:
${desiredOutcome || 'Not specified — infer a reasonable, conservative objective from the situation.'}

WHAT THE RESPONSE SHOULD AVOID:
${avoid || 'Do not invent facts, promises, deadlines, prices, contract terms, or concessions.'}

Write exactly three distinct, ready-to-send replies:
1. DIPLOMATIC: warm and relationship-preserving while still addressing the issue.
2. FIRM & PROFESSIONAL: clear boundaries and expectations without sounding hostile.
3. DIRECT: concise and unambiguous, with no unnecessary softening.

All three must respect the user's desired outcome and preferred writing tone. Do not invent facts or agree to unpaid work, discounts, deadlines, refunds, or contractual terms unless the user explicitly provided them. Avoid generic openings and filler. Write in the first person. Return only the three reply strings in the required JSON structure.`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [
          {
            text: 'You are a specialist communication assistant for freelancers. Help users protect professional boundaries, negotiate clearly, and preserve client relationships. Never invent facts or commitments.',
          },
        ],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            replies: {
              type: 'ARRAY',
              minItems: NUM_OPTIONS,
              maxItems: NUM_OPTIONS,
              items: { type: 'STRING' },
            },
          },
          required: ['replies'],
        },
        maxOutputTokens: 512,
      },
    };

    // Start with the lightweight model for lower latency. Fall back to the general Flash
    // model only when Google reports temporary capacity exhaustion (503).
    const models = ['gemini-3.5-flash-lite', 'gemini-flash-latest'];
    let response: Response | null = null;
    let lastErrorMessage = 'The AI service is temporarily unavailable. Please try again shortly.';
    let selectedModel = '';
    const generationStartedAt = Date.now();

    for (const model of models) {
      selectedModel = model;
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(20000),
        }
      );

      if (response.ok) break;

      const errorData = await response.json().catch(() => ({}));
      lastErrorMessage =
        errorData.error?.message || 'The AI service could not generate a reply.';

      console.error(`Gemini model ${model} returned HTTP ${response.status} after ${Date.now() - generationStartedAt}ms:`, errorData);

      if (response.status !== 503 || model === models[models.length - 1]) {
        return NextResponse.json(
          { error: lastErrorMessage },
          { status: response.status }
        );
      }
    }

    if (!response?.ok) {
      return NextResponse.json({ error: lastErrorMessage }, { status: 503 });
    }

    console.info(
      `Gemini generation succeeded using ${selectedModel} in ${Date.now() - generationStartedAt}ms (request total: ${Date.now() - requestStartedAt}ms).`
    );
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let replies: string[] = [];
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed.replies)) {
        replies = parsed.replies.filter((r: unknown) => typeof r === 'string' && r.trim());
      }
    } catch {
      console.error('⚠️ Could not parse Gemini JSON response:', rawText);
    }

    if (replies.length === 0 && rawText.trim()) {
      replies = [rawText.trim()];
    }

    if (replies.length === 0) {
      return NextResponse.json({ error: 'Failed to generate a reply. Try again.' }, { status: 502 });
    }

    // Tester requests do not consume the account's daily free allowance.
    let newCount = effectiveDraftCount;
    if (!isTester) {
      const { data: incrementResult, error: incrementError } = await supabase.rpc(
        'increment_draft_count',
        { user_id: user.id }
      );

      if (incrementError) {
        console.error('⚠️ Failed to increment draft count:', incrementError);
      }

      newCount = incrementResult?.[0]?.new_count ?? effectiveDraftCount + 1;
    }

    console.info(
      `Draft request completed in ${Date.now() - requestStartedAt}ms (model: ${selectedModel}).`
    );

    return NextResponse.json({
      replies,
      reply: replies[0],
      draft: replies[0],
      text: replies[0],
      draftsUsed: newCount,
      draftsRemaining:
        isTester || profile.plan === 'pro'
          ? null
          : Math.max(0, FREE_DRAFT_LIMIT - newCount),
    });
  } catch (error: any) {
    console.error('❌ Server route crashed:', error);
    const isTimeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'The AI service took too long to respond. Please try again.'
          : error?.message || 'Something went wrong generating your reply.',
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
