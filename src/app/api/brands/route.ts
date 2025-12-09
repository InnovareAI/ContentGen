import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: brands, error } = await supabase
    .from("brands")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ brands });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    tone_of_voice,
    brand_guidelines,
    system_prompt,
    default_platforms,
  } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Brand name is required" },
      { status: 400 }
    );
  }

  const { data: brand, error } = await supabase
    .from("brands")
    .insert({
      user_id: user.id,
      name,
      tone_of_voice,
      brand_guidelines,
      system_prompt,
      default_platforms: default_platforms || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ brand });
}
