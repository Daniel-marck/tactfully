import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FREE_DRAFT_LIMIT = 3;
const NUM_OPTIONS = 2; // Start with 2 -- can raise later without touching anything else.

export async function POST(req: Request) {
  try {
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
      .select('plan, draft_count')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Could not load profile:', profileError);
      return NextResponse.json(
        { error: 'Could not load your account. Try again.' },
        { status: 500 }
      );
    }

    if (profile.plan === 'free' && profile.draft_count >= FREE_DRAFT_LIMIT) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: `You've used all ${FREE_DRAFT_LIMIT} free drafts. Upgrade to Pro for unlimited replies.`,
          upgradeUrl: 'https://smartoolkit.gumroad.com/l/dzlkij',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const message = body.incomingMessage || body.message || body.prompt || '';
    const tone = body.tone || 'Formal';
    const context = body.userContext || body.situation || '';

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

    const prompt = `Draft ${NUM_OPTIONS} distinct professional business replies to this client message: "${message}".
Desired tone: ${tone}.
Additional context: ${context || 'None'}.

Each reply should take a genuinely different approach (e.g. different opening, different level of detail, different phrasing) while staying in the requested tone -- don't just reword the same sentence.

Keep each reply concise, polite, and ready to send. Write in the first person.

Respond with ONLY valid JSON in exactly this shape, no markdown fences, no preamble:
{"replies": ["first reply text", "second reply text"]}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [
              {
                text: 'You help freelancers and support teams write professional, concise email and message replies. You always respond with strictly valid JSON when asked to.',
              },
            ],
          },
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API returned an error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let replies: string[] = [];
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed.replies)) {
        replies = parsed.replies.filter((r: unknown) => typeof r === 'string' && r.trim());
      }
    } catch (parseErr) {
      console.error('⚠️ Could not parse Gemini JSON response, falling back to raw text:', rawText);
    }

    // Fallback: if parsing failed or the model returned fewer than expected,
    // don't leave the user with nothing -- use whatever raw text we got.
    if (replies.length === 0 && rawText.trim()) {
      replies = [rawText.trim()];
    }

    if (replies.length === 0) {
      return NextResponse.json({ error: 'Failed to generate a reply. Try again.' }, { status: 502 });
    }

    // Only increment on a SUCCESSFUL generation -- don't charge failed attempts
    // against the free quota. One generation event = one credit, regardless
    // of how many options came back.
    const { data: incrementResult, error: incrementError } = await supabase.rpc(
      'increment_draft_count',
      { user_id: user.id }
    );

    if (incrementError) {
      console.error('⚠️ Failed to increment draft count:', incrementError);
    }

    const newCount = incrementResult?.[0]?.new_count ?? profile.draft_count + 1;

    return NextResponse.json({
      replies,
      // Keep these for backward compatibility with anything still reading a single reply.
      reply: replies[0],
      draft: replies[0],
      text: replies[0],
      draftsUsed: newCount,
      draftsRemaining:
        profile.plan === 'pro' ? null : Math.max(0, FREE_DRAFT_LIMIT - newCount),
    });
  } catch (error: any) {
    console.error('❌ Server route crashed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
