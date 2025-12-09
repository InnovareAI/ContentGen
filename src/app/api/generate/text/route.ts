import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateText } from "@/lib/ai/claude";
import { Platform } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { topic, platform, audience, intent, tone, brand_id } = body;

  if (!topic || !platform) {
    return NextResponse.json(
      { error: "Topic and platform are required" },
      { status: 400 }
    );
  }

  // Validate platform
  const validPlatforms: Platform[] = [
    "blog",
    "linkedin",
    "twitter",
    "instagram",
    "facebook",
  ];
  if (!validPlatforms.includes(platform)) {
    return NextResponse.json(
      { error: "Invalid platform" },
      { status: 400 }
    );
  }

  // Get brand if specified
  let brandGuidelines: string | undefined;
  let systemPrompt: string | undefined;

  if (brand_id) {
    const { data: brand } = await supabase
      .from("brands")
      .select()
      .eq("id", brand_id)
      .single();

    if (brand) {
      brandGuidelines = brand.brand_guidelines || undefined;
      systemPrompt = brand.system_prompt || undefined;
    }
  }

  try {
    const content = await generateText({
      topic,
      platform,
      audience,
      intent,
      tone,
      brandGuidelines,
      systemPrompt,
    });

    return NextResponse.json({
      content,
      platform,
      metadata: {
        char_count: content.length,
        word_count: content.split(/\s+/).length,
      },
    });
  } catch (error) {
    console.error("Text generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
