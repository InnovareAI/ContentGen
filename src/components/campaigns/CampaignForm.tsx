"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Platform, CampaignFormData } from "@/types";
import { cn } from "@/lib/utils";

const platforms: { id: Platform; label: string; description: string }[] = [
  { id: "blog", label: "Blog", description: "Long-form article (800-1500 words)" },
  { id: "linkedin", label: "LinkedIn", description: "Professional post (1300 chars)" },
  { id: "twitter", label: "Twitter/X", description: "Punchy tweet (280 chars)" },
  { id: "instagram", label: "Instagram", description: "Visual caption + hashtags" },
  { id: "facebook", label: "Facebook", description: "Conversational post" },
];

const toneOptions = [
  "Professional",
  "Casual",
  "Educational",
  "Inspirational",
  "Conversational",
  "Authoritative",
];

export function CampaignForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    topic: "",
    audience: "",
    intent: "",
    tone: "Professional",
    brand_id: "",
    platforms: ["blog", "linkedin", "twitter"],
  });

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    if (formData.platforms.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create campaign");
      }

      const { campaign } = await response.json();
      router.push(`/campaigns/${campaign.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Topic Input */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">What do you want to create content about?</Label>
            <Textarea
              id="topic"
              placeholder="e.g., The future of AI in healthcare, 5 productivity tips for remote workers, How to build a sustainable business..."
              value={formData.topic}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors",
                  formData.platforms.includes(platform.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{platform.label}</div>
                <div className="text-sm text-muted-foreground">
                  {platform.description}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Content Settings (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Marketing professionals, Startup founders..."
                value={formData.audience}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, audience: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intent">Content Intent</Label>
              <Input
                id="intent"
                placeholder="e.g., Educate, Inspire, Promote, Engage..."
                value={formData.intent}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, intent: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, tone }))
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors",
                    formData.tone === tone
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Campaign..." : "Generate Content"}
        </Button>
      </div>
    </form>
  );
}
