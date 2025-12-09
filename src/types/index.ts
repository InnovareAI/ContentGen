// Database types

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  tone_of_voice: string | null;
  brand_guidelines: string | null;
  system_prompt: string | null;
  default_platforms: string[];
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  brand_id: string | null;
  topic: string;
  audience: string | null;
  intent: string | null;
  tone: string | null;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand?: Brand;
  content?: Content[];
}

export type CampaignStatus =
  | 'draft'
  | 'generating'
  | 'review'
  | 'approved'
  | 'scheduled'
  | 'published';

export interface Content {
  id: string;
  campaign_id: string;
  platform: Platform;
  content_type: ContentType;
  content: string | null;
  status: ContentStatus;
  scheduled_for: string | null;
  published_at: string | null;
  metadata: ContentMetadata | null;
  created_at: string;
  updated_at: string;
}

export type Platform =
  | 'blog'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook';

export type ContentType = 'text' | 'image';

export type ContentStatus =
  | 'draft'
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'published';

export interface ContentMetadata {
  char_count?: number;
  word_count?: number;
  hashtags?: string[];
  image_prompt?: string;
  image_url?: string;
  [key: string]: unknown;
}

export interface PromptTemplate {
  id: string;
  user_id: string;
  brand_id: string | null;
  name: string;
  type: 'system' | 'user';
  platform: Platform | null;
  prompt_text: string;
  created_at: string;
}

// API types

export interface GenerateRequest {
  topic: string;
  audience?: string;
  intent?: string;
  tone?: string;
  brand_id?: string;
  platforms: Platform[];
}

export interface GenerateTextRequest {
  topic: string;
  platform: Platform;
  audience?: string;
  intent?: string;
  tone?: string;
  brand_guidelines?: string;
  system_prompt?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  style?: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface GeneratedContent {
  platform: Platform;
  content_type: ContentType;
  content: string;
  metadata?: ContentMetadata;
}

// UI types

export interface CampaignFormData {
  topic: string;
  audience: string;
  intent: string;
  tone: string;
  brand_id: string;
  platforms: Platform[];
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}
