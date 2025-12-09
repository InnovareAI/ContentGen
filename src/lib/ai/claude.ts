import Anthropic from "@anthropic-ai/sdk";
import { Platform } from "@/types";
import { getSystemPrompt, getUserPrompt } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateTextOptions {
  topic: string;
  platform: Platform;
  audience?: string;
  intent?: string;
  tone?: string;
  brandGuidelines?: string;
  systemPrompt?: string;
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const {
    topic,
    platform,
    audience,
    intent,
    tone,
    brandGuidelines,
    systemPrompt: customSystemPrompt,
  } = options;

  const systemPrompt = getSystemPrompt(platform, brandGuidelines, customSystemPrompt);
  const userPrompt = getUserPrompt(platform, topic, { audience, intent, tone });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  // Extract text from response
  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in response");
  }

  return textContent.text;
}

interface GenerateBatchOptions {
  topic: string;
  platforms: Platform[];
  audience?: string;
  intent?: string;
  tone?: string;
  brandGuidelines?: string;
  systemPrompt?: string;
}

export async function generateBatch(
  options: GenerateBatchOptions
): Promise<Record<Platform, string>> {
  const { platforms, ...rest } = options;

  // Generate content for all platforms in parallel
  const results = await Promise.all(
    platforms.map(async (platform) => {
      const content = await generateText({ ...rest, platform });
      return { platform, content };
    })
  );

  // Convert array to record
  return results.reduce(
    (acc, { platform, content }) => {
      acc[platform] = content;
      return acc;
    },
    {} as Record<Platform, string>
  );
}
