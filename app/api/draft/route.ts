import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, draft_count')
    .eq('id', user.id)
    .single();

  if (profile.plan === 'free' && profile.draft_count >= 3) {
    return NextResponse.json(
      { error: 'limit_reached', message: 'Upgrade to Pro for unlimited drafts' },
      { status: 402 }
    );
  }

  const { clientMessage } = await req.json();
  if (!clientMessage?.trim()) {
    return NextResponse.json({ error: 'missing_message' }, { status: 400 });
  }

  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Tactfully, an assistant that helps freelancers write professional, tactful replies to awkward client messages. Return only the drafted reply, no preamble.\n\nClient message: ${clientMessage}`
          }]
        }]
      }),
    }
  );

  if (!aiRes.ok) {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  const aiData = await aiRes.json();
  const draft = aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  const { data: updated } = await supabase.rpc('increment_draft_count', { user_id: user.id });

  return NextResponse.json({
    draft,
    draftCount: updated?.[0]?.new_count,
    plan: updated?.[0]?.user_plan,
  });
}
