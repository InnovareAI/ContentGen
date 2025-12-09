import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function CampaignsPage() {
  // Placeholder data - will be replaced with Supabase queries
  const campaigns = [
    {
      id: "1",
      topic: "AI in Healthcare",
      status: "review",
      created_at: "2024-01-15",
      platforms: ["blog", "linkedin", "twitter"],
      brand: { name: "TechHealth Inc" },
    },
    {
      id: "2",
      topic: "Remote Work Best Practices",
      status: "draft",
      created_at: "2024-01-14",
      platforms: ["linkedin", "twitter", "facebook"],
      brand: null,
    },
    {
      id: "3",
      topic: "Sustainable Business",
      status: "approved",
      created_at: "2024-01-13",
      platforms: ["blog", "instagram"],
      brand: { name: "GreenCo" },
    },
    {
      id: "4",
      topic: "Customer Success Strategies",
      status: "published",
      created_at: "2024-01-12",
      platforms: ["blog", "linkedin", "twitter", "facebook"],
      brand: { name: "SaaS Corp" },
    },
  ];

  const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
    draft: "secondary",
    generating: "warning",
    review: "warning",
    approved: "success",
    scheduled: "default",
    published: "default",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your content campaigns
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <Plus size={18} className="mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{campaign.topic}</h3>
                      {campaign.brand && (
                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                          {campaign.brand.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                    <Badge variant={statusColors[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
