import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { incomingMessage, tone, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    // Build your prompt
    const prompt = `Draft a business reply to this message: "${incomingMessage}". 
Use a ${tone} tone. 
Additional context: ${userContext || 'None'}`;

    // Direct fetch call to the Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
            parts: [{ text: "You are Tactfully, an AI reply composer for support and revenue teams. Craft highly effective, concise, clear, and professional business communication." }]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini's response structure
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
