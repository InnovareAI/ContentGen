import { Platform, GeneratedContent, Brand } from "@/types";
import { generateBatch } from "./claude";
import { generateImage, getRecommendedSize } from "./image";

interface OrchestrateOptions {
  topic: string;
  platforms: Platform[];
  audience?: string;
  intent?: string;
  tone?: string;
  brand?: Brand | null;
  generateImages?: boolean;
}

interface OrchestrationResult {
  content: GeneratedContent[];
  errors: Array<{ platform: Platform; error: string }>;
}

export async function orchestrateGeneration(
  options: OrchestrateOptions
): Promise<OrchestrationResult> {
  const {
    topic,
    platforms,
    audience,
    intent,
    tone,
    brand,
    generateImages = true,
  } = options;

  const content: GeneratedContent[] = [];
  const errors: Array<{ platform: Platform; error: string }> = [];

  // Generate text content for all platforms
  try {
    const textResults = await generateBatch({
      topic,
      platforms,
      audience,
      intent,
      tone,
      brandGuidelines: brand?.brand_guidelines || undefined,
      systemPrompt: brand?.system_prompt || undefined,
    });

    // Add text content to results
    for (const platform of platforms) {
      const text = textResults[platform];
      if (text) {
        content.push({
          platform,
          content_type: "text",
          content: text,
          metadata: {
            char_count: text.length,
            word_count: text.split(/\s+/).length,
          },
        });
      }
    }
  } catch (error) {
    // If batch fails, try individual platforms
    for (const platform of platforms) {
      errors.push({
        platform,
        error: error instanceof Error ? error.message : "Text generation failed",
      });
    }
  }

  // Generate hero image (just one for the campaign, can be resized per platform)
  if (generateImages) {
    try {
      // Use blog size as the hero image (largest, landscape)
      const imageUrl = await generateImage({
        topic,
        platform: "blog",
        size: getRecommendedSize("blog"),
      });

      // Add image as blog content (main hero image)
      content.push({
        platform: "blog",
        content_type: "image",
        content: imageUrl,
        metadata: {
          image_prompt: topic,
          image_url: imageUrl,
        },
      });
    } catch (error) {
      errors.push({
        platform: "blog",
        error: error instanceof Error ? error.message : "Image generation failed",
      });
    }
  }

  return { content, errors };
}
