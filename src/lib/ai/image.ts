import OpenAI from "openai";
import { Platform } from "@/types";
import { getImagePrompt } from "./prompts";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface GenerateImageOptions {
  topic: string;
  platform: Platform;
  style?: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<string> {
  const { topic, platform, style, size = "1024x1024" } = options;

  const prompt = getImagePrompt(topic, platform, style);
  const openai = getOpenAI();

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size,
    quality: "standard",
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("No image data in response");
  }

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error("No image URL in response");
  }

  return imageUrl;
}

// Get recommended image size for platform
export function getRecommendedSize(
  platform: Platform
): "1024x1024" | "1792x1024" | "1024x1792" {
  switch (platform) {
    case "instagram":
      return "1024x1024"; // Square
    case "linkedin":
    case "facebook":
    case "twitter":
    case "blog":
      return "1792x1024"; // Landscape
    default:
      return "1024x1024";
  }
}
