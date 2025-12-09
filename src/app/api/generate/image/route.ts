import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage, getRecommendedSize } from "@/lib/ai/image";
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
  const { topic, platform = "blog", style } = body;

  if (!topic) {
    return NextResponse.json(
      { error: "Topic is required" },
      { status: 400 }
    );
  }

  try {
    const size = getRecommendedSize(platform as Platform);
    const imageUrl = await generateImage({
      topic,
      platform: platform as Platform,
      style,
      size,
    });

    return NextResponse.json({
      imageUrl,
      platform,
      size,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
