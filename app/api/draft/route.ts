import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_BODY_BYTES = 50_000;
const MAX_MESSAGE_CHARS = 12_000;
const MAX_SITUATION_CHARS = 120;
const MAX_TONE_CHARS = 120;
const MAX_REPLY_CHARS = 25_000;

type BodyResult =
  | { kind: "ok"; value: Record<string, unknown> }
  | { kind: "too_large" }
  | { kind: "invalid" };

async function readBoundedJson(request: Request): Promise<BodyResult> {
  const reader = request.body?.getReader();
  if (!reader) return { kind: "invalid" };

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return { kind: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { kind: "invalid" };
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { kind: "invalid" };
    }
    return { kind: "ok", value: value as Record<string, unknown> };
  } catch {
    return { kind: "invalid" };
  }
}

function textField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
}

function validId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ? id
    : null;
}

async function authenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await authenticatedClient();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Could not load saved drafts:", error.message);
    return NextResponse.json({ error: "Could not load saved drafts." }, { status: 500 });
  }

  return NextResponse.json({ drafts: data ?? [] });
}

export async function POST(request: Request) {
  const { supabase, user } = await authenticatedClient();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const parsed = await readBoundedJson(request);
  if (parsed.kind === "too_large") {
    return NextResponse.json({ error: "Draft data is too large." }, { status: 413 });
  }
  if (parsed.kind === "invalid") {
    return NextResponse.json({ error: "Request body must be a valid JSON object." }, { status: 400 });
  }

  const body = parsed.value;
  const originalMessage = textField(
    body.original_message ?? body.originalMessage ?? body.message,
    MAX_MESSAGE_CHARS
  );
  const situation = textField(body.situation, MAX_SITUATION_CHARS);
  const tone = textField(body.tone, MAX_TONE_CHARS);
  const generatedReply = textField(
    body.generated_reply ?? body.generatedReply ?? body.reply,
    MAX_REPLY_CHARS
  );

  if (!originalMessage || !situation || !tone || !generatedReply) {
    return NextResponse.json(
      { error: "Draft fields are missing, invalid, or exceed their allowed length." },
      { status: 400 }
    );
  }

  const draftData = {
    user_id: user.id,
    original_message: originalMessage,
    situation,
    tone,
    generated_reply: generatedReply,
  };

  if (body.id !== undefined && body.id !== null && body.id !== "") {
    const draftId = validId(body.id);
    if (!draftId) {
      return NextResponse.json({ error: "Invalid draft ID." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("drafts")
      .update(draftData)
      .eq("id", draftId)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Could not update saved draft:", error.message);
      return NextResponse.json({ error: "Could not update that draft." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    }

    return NextResponse.json({ draft: data });
  }

  const { data, error } = await supabase
    .from("drafts")
    .insert(draftData)
    .select()
    .single();

  if (error) {
    console.error("Could not save draft:", error.message);
    return NextResponse.json({ error: "Could not save that draft." }, { status: 500 });
  }

  return NextResponse.json({ draft: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { supabase, user } = await authenticatedClient();
  if (!user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const parsed = await readBoundedJson(request);
  if (parsed.kind === "too_large") {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }
  if (parsed.kind === "invalid") {
    return NextResponse.json({ error: "Request body must be a valid JSON object." }, { status: 400 });
  }

  const draftId = validId(parsed.value.id);
  if (!draftId) {
    return NextResponse.json({ error: "A valid draft ID is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("drafts")
    .delete()
    .eq("id", draftId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Could not delete saved draft:", error.message);
    return NextResponse.json({ error: "Could not delete that draft." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
