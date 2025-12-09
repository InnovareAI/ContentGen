"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPreview } from "@/components/content/ContentPreview";
import { Campaign, Content, Platform } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Placeholder data for the prototype
const mockCampaign: Campaign & { content: Content[] } = {
  id: "1",
  user_id: "user1",
  brand_id: null,
  topic: "AI in Healthcare: Transforming Patient Care Through Innovation",
  audience: "Healthcare professionals and tech enthusiasts",
  intent: "Educate and inspire",
  tone: "Professional",
  status: "review",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
  content: [
    {
      id: "c1",
      campaign_id: "1",
      platform: "blog" as Platform,
      content_type: "text",
      content: `# AI in Healthcare: Transforming Patient Care Through Innovation

The healthcare industry is experiencing a profound transformation, driven by the rapid advancement of artificial intelligence technologies. From diagnostic imaging to personalized treatment plans, AI is reshaping how we approach patient care.

## The Current Landscape

Today's healthcare systems face unprecedented challenges: aging populations, rising costs, and increasing demand for personalized care. AI offers solutions to these challenges by:

- **Enhancing Diagnostic Accuracy**: Machine learning algorithms can analyze medical images with remarkable precision, often detecting conditions that human eyes might miss.
- **Streamlining Administrative Tasks**: Natural language processing automates documentation, freeing healthcare providers to focus on patient interaction.
- **Predicting Patient Outcomes**: Predictive analytics help identify at-risk patients before conditions become critical.

## Real-World Applications

Hospitals worldwide are already implementing AI solutions. For example, AI-powered systems are being used to:

1. Detect early signs of diabetic retinopathy
2. Predict sepsis hours before clinical symptoms appear
3. Personalize cancer treatment based on genetic profiles

## The Road Ahead

While the potential is immense, successful AI implementation requires careful consideration of ethics, data privacy, and the human element in healthcare. The future isn't about replacing healthcare providers—it's about empowering them with tools that enhance their capabilities.

**Ready to explore how AI can transform your healthcare organization?** The journey starts with understanding the possibilities.`,
      status: "draft",
      scheduled_for: null,
      published_at: null,
      metadata: { char_count: 1523, word_count: 234 },
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "c2",
      campaign_id: "1",
      platform: "linkedin" as Platform,
      content_type: "text",
      content: `AI isn't replacing healthcare professionals. It's empowering them.

I've been closely following the AI revolution in healthcare, and here's what excites me most:

A radiologist using AI can detect cancers 30% faster.
Predictive algorithms are preventing hospital readmissions.
Personalized medicine is becoming a reality, not just a buzzword.

But here's what many get wrong: AI in healthcare isn't about efficiency metrics. It's about giving doctors more time with patients. More accurate diagnoses. Better outcomes.

The healthcare organizations winning right now? They're not asking "Should we use AI?" They're asking "How do we implement it responsibly?"

What's your take on AI in healthcare?

#HealthcareInnovation #AIinHealthcare #DigitalHealth #FutureOfMedicine #HealthTech`,
      status: "draft",
      scheduled_for: null,
      published_at: null,
      metadata: { char_count: 756, word_count: 118 },
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "c3",
      campaign_id: "1",
      platform: "twitter" as Platform,
      content_type: "text",
      content: `AI in healthcare isn't about replacing doctors—it's about giving them superpowers.

Faster diagnoses. Personalized treatments. Better patient outcomes.

The future of medicine is here. #HealthTech #AIinHealthcare`,
      status: "draft",
      scheduled_for: null,
      published_at: null,
      metadata: { char_count: 214, word_count: 30 },
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
  ],
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<(Campaign & { content: Content[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("blog");

  useEffect(() => {
    // In prototype, use mock data
    // In production, fetch from API: GET /api/campaigns/:id
    setTimeout(() => {
      setCampaign(mockCampaign);
      setLoading(false);
      // Set active tab to first available platform
      if (mockCampaign.content.length > 0) {
        setActiveTab(mockCampaign.content[0].platform);
      }
    }, 500);
  }, [params.id]);

  const handleUpdateContent = async (contentId: string, newContent: string) => {
    if (!campaign) return;
    // In production: PATCH /api/content/:id
    setCampaign({
      ...campaign,
      content: campaign.content.map((c) =>
        c.id === contentId ? { ...c, content: newContent } : c
      ),
    });
  };

  const handleApprove = async (contentId: string) => {
    if (!campaign) return;
    // In production: PATCH /api/content/:id
    setCampaign({
      ...campaign,
      content: campaign.content.map((c) =>
        c.id === contentId ? { ...c, status: "approved" } : c
      ),
    });
  };

  const handleReject = async (contentId: string) => {
    if (!campaign) return;
    // In production: PATCH /api/content/:id
    setCampaign({
      ...campaign,
      content: campaign.content.map((c) =>
        c.id === contentId ? { ...c, status: "rejected" } : c
      ),
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8">
        <p>Campaign not found</p>
      </div>
    );
  }

  const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
    draft: "secondary",
    generating: "warning",
    review: "warning",
    approved: "success",
    published: "default",
  };

  const platforms = campaign.content
    .filter((c) => c.content_type === "text")
    .map((c) => c.platform);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Campaigns
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{campaign.topic}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant={statusColors[campaign.status]}>
                {campaign.status}
              </Badge>
              <span>
                Created {new Date(campaign.created_at).toLocaleDateString()}
              </span>
              {campaign.audience && <span>Audience: {campaign.audience}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {platforms.map((platform) => (
                <TabsTrigger key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {campaign.content
              .filter((c) => c.content_type === "text")
              .map((content) => (
                <TabsContent key={content.id} value={content.platform}>
                  <ContentPreview
                    content={content}
                    onUpdate={handleUpdateContent}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </TabsContent>
              ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
