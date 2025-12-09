import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, FileText, Image } from "lucide-react";

export default function DashboardPage() {
  // Placeholder data - will be replaced with Supabase queries
  const recentCampaigns = [
    {
      id: "1",
      topic: "AI in Healthcare",
      status: "review",
      created_at: "2024-01-15",
      platforms: ["blog", "linkedin", "twitter"],
    },
    {
      id: "2",
      topic: "Remote Work Best Practices",
      status: "draft",
      created_at: "2024-01-14",
      platforms: ["linkedin", "twitter", "facebook"],
    },
    {
      id: "3",
      topic: "Sustainable Business",
      status: "approved",
      created_at: "2024-01-13",
      platforms: ["blog", "instagram"],
    },
  ];

  const stats = {
    totalCampaigns: 12,
    contentPieces: 48,
    imagesGenerated: 15,
  };

  const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
    draft: "secondary",
    generating: "warning",
    review: "warning",
    approved: "success",
    published: "default",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your content overview.
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <Plus size={18} className="mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Content Pieces
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentPieces}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Images Generated
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.imagesGenerated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-medium">{campaign.topic}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.platforms.join(", ")} •{" "}
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={statusColors[campaign.status]}>
                    {campaign.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href="/campaigns">
              <Button variant="outline" className="w-full">
                View All Campaigns
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
