import { Platform } from "@/types";

interface PlatformPromptConfig {
  systemPrompt: string;
  formatInstructions: string;
  charLimit: number;
}

const platformConfigs: Record<Platform, PlatformPromptConfig> = {
  blog: {
    systemPrompt: `You are an expert content writer specializing in engaging blog posts.
Write comprehensive, well-structured blog content that educates and engages readers.
Use clear headings, subheadings, and bullet points where appropriate.
Include an introduction that hooks the reader and a conclusion with a call-to-action.`,
    formatInstructions: `Format the blog post with:
- A compelling headline
- An engaging introduction (2-3 paragraphs)
- 3-5 main sections with subheadings
- Bullet points or numbered lists where helpful
- A conclusion with key takeaways
- A call-to-action

Target length: 800-1500 words`,
    charLimit: 10000,
  },
  linkedin: {
    systemPrompt: `You are a LinkedIn content strategist creating professional thought leadership posts.
Write in a conversational yet professional tone that encourages engagement.
Use short paragraphs and strategic line breaks for readability.
Include a hook in the first line to capture attention in the feed.`,
    formatInstructions: `Format the LinkedIn post with:
- A strong hook in the first 1-2 lines (this shows before "see more")
- Short paragraphs (2-3 sentences max)
- Use line breaks between key points
- Include 1-2 relevant insights or data points
- End with a question or call-to-action to drive engagement
- Add 3-5 relevant hashtags at the end

Target length: 1200-1500 characters`,
    charLimit: 3000,
  },
  twitter: {
    systemPrompt: `You are a Twitter/X content creator crafting punchy, engaging tweets.
Be concise, witty, and direct. Every word must earn its place.
Create content that's shareable and sparks conversation.`,
    formatInstructions: `Format the tweet with:
- A strong opening hook
- One clear message or insight
- Optional: 1-2 relevant hashtags (don't overdo it)
- Make it quotable and shareable

Maximum: 280 characters (including spaces and hashtags)`,
    charLimit: 280,
  },
  instagram: {
    systemPrompt: `You are an Instagram content strategist creating visually-inspired captions.
Write captions that complement visual content and encourage saves and shares.
Use a warm, authentic voice that connects with the audience.`,
    formatInstructions: `Format the Instagram caption with:
- A hook in the first line (shows before "more")
- Storytelling or value-packed content
- Use emojis sparingly and strategically
- End with a call-to-action (save this, share with someone, comment below)
- Add 5-10 relevant hashtags at the end (can go up to 30 but quality over quantity)

Target length: 125-2200 characters`,
    charLimit: 2200,
  },
  facebook: {
    systemPrompt: `You are a Facebook content creator writing engaging community posts.
Write in a conversational, relatable tone that encourages comments and shares.
Balance being informative with being personable.`,
    formatInstructions: `Format the Facebook post with:
- A conversational opening that stops the scroll
- Medium-length paragraphs (more text-friendly than LinkedIn)
- Tell a story or share a valuable insight
- End with a question or engagement prompt
- Optional: 1-3 hashtags (less important on Facebook)

Target length: 100-500 words`,
    charLimit: 63206,
  },
};

export function getSystemPrompt(
  platform: Platform,
  brandGuidelines?: string,
  customSystemPrompt?: string
): string {
  const config = platformConfigs[platform];

  let prompt = config.systemPrompt;

  if (customSystemPrompt) {
    prompt = customSystemPrompt + "\n\n" + prompt;
  }

  if (brandGuidelines) {
    prompt += `\n\nBrand Guidelines:\n${brandGuidelines}`;
  }

  return prompt;
}

export function getUserPrompt(
  platform: Platform,
  topic: string,
  options: {
    audience?: string;
    intent?: string;
    tone?: string;
  } = {}
): string {
  const config = platformConfigs[platform];
  const { audience, intent, tone } = options;

  let prompt = `Create a ${platform} post about the following topic:\n\n"${topic}"`;

  if (audience) {
    prompt += `\n\nTarget Audience: ${audience}`;
  }

  if (intent) {
    prompt += `\n\nIntent/Goal: ${intent}`;
  }

  if (tone) {
    prompt += `\n\nTone: ${tone}`;
  }

  prompt += `\n\n${config.formatInstructions}`;

  return prompt;
}

export function getImagePrompt(
  topic: string,
  platform: Platform,
  style?: string
): string {
  const sizeHints: Record<Platform, string> = {
    blog: "wide landscape banner format, 16:9 aspect ratio",
    linkedin: "professional business style, 1200x627 optimal",
    twitter: "eye-catching, 16:9 aspect ratio",
    instagram: "square format 1:1, visually stunning",
    facebook: "engaging visual, 1200x630 optimal",
  };

  let prompt = `Create a professional, high-quality image for ${platform} about: "${topic}". `;
  prompt += `${sizeHints[platform]}. `;

  if (style) {
    prompt += `Style: ${style}. `;
  } else {
    prompt += "Style: modern, clean, professional. ";
  }

  prompt += "No text in the image. Suitable for business/professional use.";

  return prompt;
}

export { platformConfigs };
