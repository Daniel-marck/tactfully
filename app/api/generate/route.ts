import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertServerEnv } from '@/lib/config';

const NUM_OPTIONS = 2;

export async function POST(req: Request) {
  try {
    assertServerEnv(
      ['GEMINI_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
      'AI generation'
    );

    // Authenticate with the user's session before using the privileged client.
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

    const body = await req.json();
    const message = body.incomingMessage || body.message || body.prompt || '';
    const tone = body.tone || 'Formal';
    const context = body.userContext || body.situation || '';

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'No message provided to generate a reply for.' },
        { status: 400 }
      );
    }

    // Fast preflight: reject users already at the daily limit before paying for
    // a Gemini request. The service-role RPC below remains the authoritative,
    // atomic quota check for concurrent requests.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, draft_count, last_draft_date')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Could not load account quota profile:', profileError);
      return NextResponse.json(
        { error: 'Could not verify your daily draft allowance. Please try again.' },
        { status: 503 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const usedToday = profile.last_draft_date === today
      ? Number(profile.draft_count) || 0
      : 0;

    if (profile.plan !== 'pro' && usedToday >= 3) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: "You've used all 3 free drafts for today. Your allowance resets tomorrow.",
        },
        { status: 403 }
      );
    }

    const prompt = `Draft ${NUM_OPTIONS} distinct professional business replies to this client message: "${message}".
Desired tone: ${tone}.
Additional context: ${context || 'None'}.

Each reply must take a genuinely different approach -- a different opening, a different level of detail, or a different way of framing the same point -- while staying in the requested tone. Do not simply rewrite the user message. Keep each reply concise, polite, and ready to send. Write in the first person.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { error: 'AI generation is not configured.' },
        { status: 503 }
      );
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [
              {
                text: 'You help freelancers and support teams write professional, concise email and message replies.',
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
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Gemini API returned an error:', {
        status: response.status,
        message: errorData?.error?.message,
      });
      return NextResponse.json(
        { error: 'AI generation is temporarily unavailable. Please try again shortly.' },
        { status: response.status >= 500 ? 503 : response.status }
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let replies: string[] = [];
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed.replies)) {
        replies = parsed.replies
          .filter((reply: unknown) => typeof reply === 'string' && reply.trim())
          .slice(0, NUM_OPTIONS);
      }
    } catch {
      console.error('Could not parse Gemini JSON response.');
    }

    if (replies.length === 0 && rawText.trim()) {
      replies = [rawText.trim()];
    }

    if (replies.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate a reply. Please try again.' },
        { status: 502 }
      );
    }

    // This RPC is restricted to service_role and performs the quota check and
    // increment atomically under a row lock. Never call it with the user's
    // session client, and never treat an RPC failure as permission to proceed.
    const admin = createAdminClient();
    const { data: quotaRows, error: quotaError } = await admin.rpc(
      'increment_draft_count',
      { user_id: user.id }
    );

    if (quotaError || !Array.isArray(quotaRows) || quotaRows.length === 0) {
      console.error('Atomic draft quota check failed:', quotaError);
      return NextResponse.json(
        { error: 'We could not verify your daily draft allowance. Please try again.' },
        { status: 503 }
      );
    }

    const quota = quotaRows[0];
    if (quota.allowed !== true) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: "You've used all 3 free drafts for today. Your allowance resets tomorrow.",
        },
        { status: 403 }
      );
    }

    const newCount = Number(quota.new_count);
    const isPro = quota.user_plan === 'pro';

    return NextResponse.json({
      replies,
      reply: replies[0],
      draft: replies[0],
      text: replies[0],
      draftsUsed: newCount,
      draftsRemaining: isPro ? null : Math.max(0, 3 - newCount),
    });
  } catch (error: unknown) {
    console.error('AI generation route failed:', error);
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json(
      { error: message || 'Unable to generate a reply.' },
      { status: 500 }
    );
  }
}
