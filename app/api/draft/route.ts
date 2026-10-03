import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ drafts: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const originalMessage = normalizeText(body.original_message ?? body.originalMessage ?? body.message);
  const situation = normalizeText(body.situation);
  const tone = normalizeText(body.tone);
  const generatedReply = normalizeText(body.generated_reply ?? body.generatedReply ?? body.reply);

  if (!originalMessage || !situation || !tone || !generatedReply) {
    return NextResponse.json(
      { error: "Missing required draft data." },
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

  const draftId = body.id ? String(body.id) : null;

  if (draftId) {
    const { data, error } = await supabase
      .from("drafts")
      .update(draftData)
      .eq("id", draftId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ draft: data }, { status: 200 });
  }

  const { data, error } = await supabase
    .from("drafts")
    .insert(draftData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ draft: data }, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "You need to sign in first." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const draftId = body.id ? String(body.id) : null;

  if (!draftId) {
    return NextResponse.json({ error: "Draft ID is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("drafts")
    .delete()
    .eq("id", draftId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
