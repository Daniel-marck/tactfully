import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("👉 Backend received request body:", body);

    // 1. Robustly extract parameters (supports both 'incomingMessage' and 'message')
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
      console.error("❌ Error: GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in your environment variables.' },
        { status: 500 }
      );
    }

    // 2. Format a high-quality prompt for Gemini
    const prompt = `Draft a professional business reply to this client message: "${message}".
Desired tone: ${tone}.
Additional context: ${context || 'None'}.

Keep the reply concise, polite, and ready to send. Write it in the first person.`;

    // 3. Query the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: "You help freelancers and support teams write professional, concise email and message replies." }]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Gemini API returned an error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log("✅ Successfully generated reply:", replyText);

    // 4. Return in multiple key formats to guarantee frontend compatibility
    return NextResponse.json({
      reply: replyText,
      draft: replyText,
      text: replyText
    });

  } catch (error: any) {
    console.error("❌ Server route crashed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
