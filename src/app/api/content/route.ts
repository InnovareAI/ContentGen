import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, content, status, scheduled_for } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Content ID is required" },
      { status: 400 }
    );
  }

  // Build update object
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (content !== undefined) {
    updates.content = content;
    updates.metadata = {
      char_count: content.length,
      word_count: content.split(/\s+/).length,
    };
  }
  if (status !== undefined) updates.status = status;
  if (scheduled_for !== undefined) updates.scheduled_for = scheduled_for;

  // Verify ownership through campaign
  const { data: contentItem } = await supabase
    .from("content")
    .select(`
      *,
      campaign:campaigns(user_id)
    `)
    .eq("id", id)
    .single();

  if (!contentItem || contentItem.campaign?.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: updated, error } = await supabase
    .from("content")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: updated });
}
