import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { orchestrateGeneration } from "@/lib/ai/orchestrator";
import { Platform } from "@/types";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select(`
      *,
      brand:brands(*),
      content(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaigns });
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
  const { topic, audience, intent, tone, brand_id, platforms } = body;

  if (!topic || !platforms || platforms.length === 0) {
    return NextResponse.json(
      { error: "Topic and at least one platform are required" },
      { status: 400 }
    );
  }

  // Create campaign
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({
      user_id: user.id,
      topic,
      audience,
      intent,
      tone,
      brand_id: brand_id || null,
      status: "generating",
    })
    .select()
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json(
      { error: campaignError?.message || "Failed to create campaign" },
      { status: 500 }
    );
  }

  // Get brand if specified
  let brand = null;
  if (brand_id) {
    const { data } = await supabase
      .from("brands")
      .select()
      .eq("id", brand_id)
      .single();
    brand = data;
  }

  // Generate content
  try {
    const result = await orchestrateGeneration({
      topic,
      platforms: platforms as Platform[],
      audience,
      intent,
      tone,
      brand,
      generateImages: true,
    });

    // Save generated content
    const contentInserts = result.content.map((item) => ({
      campaign_id: campaign.id,
      platform: item.platform,
      content_type: item.content_type,
      content: item.content,
      status: "draft",
      metadata: item.metadata,
    }));

    if (contentInserts.length > 0) {
      const { error: contentError } = await supabase
        .from("content")
        .insert(contentInserts);

      if (contentError) {
        console.error("Error saving content:", contentError);
      }
    }

    // Update campaign status
    await supabase
      .from("campaigns")
      .update({ status: "review" })
      .eq("id", campaign.id);

    // Return campaign with content
    const { data: fullCampaign } = await supabase
      .from("campaigns")
      .select(`
        *,
        brand:brands(*),
        content(*)
      `)
      .eq("id", campaign.id)
      .single();

    return NextResponse.json({
      campaign: fullCampaign,
      errors: result.errors,
    });
  } catch (error) {
    // Update campaign status to draft on error
    await supabase
      .from("campaigns")
      .update({ status: "draft" })
      .eq("id", campaign.id);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
