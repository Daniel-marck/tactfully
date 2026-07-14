import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, situation, tone } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You help freelancers and consultants respond to awkward client messages professionally. Given a client's message, a situation type, and a desired tone, produce exactly 2 distinct reply drafts the freelancer could send. Each should take a genuinely different strategic angle (e.g. one more accommodating, one more boundary-setting) while both matching the requested tone. Keep each reply concise (3-6 sentences), ready to send as-is, written in first person as the freelancer. Respond ONLY with valid JSON, no markdown fences, no preamble, in this exact shape: {"replies":[{"label":"short 2-4 word label for this approach","reply":"the full reply text","why":"one sentence on why this approach works"},{"label":"...","reply":"...","why":"..."}]}`;

    const userPrompt = `Client's message: "${message}"\nSituation: ${situation}\nDesired tone: ${tone}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || '', 
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic Error:", errText);
      return NextResponse.json({ error: "Failed to generate from Anthropic" }, { status: response.status });
    }

    const data = await response.json();
    const textBlock = data.content.map((b: any) => b.text || '').join('');
    const clean = textBlock.replace(/```json|```/g, '').trim();
    
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
