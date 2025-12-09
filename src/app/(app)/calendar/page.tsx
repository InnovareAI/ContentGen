"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Content, Platform } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Placeholder data
const mockContent: (Content & { campaign_topic: string })[] = [
  {
    id: "1",
    campaign_id: "c1",
    campaign_topic: "AI in Healthcare",
    platform: "linkedin" as Platform,
    content_type: "text",
    content: "AI isn't replacing healthcare professionals...",
    status: "approved",
    scheduled_for: "2024-01-20T10:00:00Z",
    published_at: null,
    metadata: null,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    campaign_id: "c1",
    campaign_topic: "AI in Healthcare",
    platform: "twitter" as Platform,
    content_type: "text",
    content: "AI in healthcare isn't about replacing doctors...",
    status: "approved",
    scheduled_for: "2024-01-20T14:00:00Z",
    published_at: null,
    metadata: null,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    campaign_id: "c2",
    campaign_topic: "Remote Work Best Practices",
    platform: "linkedin" as Platform,
    content_type: "text",
    content: "The future of work is hybrid...",
    status: "scheduled",
    scheduled_for: "2024-01-22T09:00:00Z",
    published_at: null,
    metadata: null,
    created_at: "2024-01-14T10:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
];

const platformColors: Record<Platform, string> = {
  blog: "bg-indigo-500",
  linkedin: "bg-blue-600",
  twitter: "bg-sky-500",
  instagram: "bg-pink-500",
  facebook: "bg-blue-700",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const scheduledContent = mockContent.filter((c) => c.scheduled_for);

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const statusColors: Record<string, "default" | "success" | "warning" | "secondary"> = {
    draft: "secondary",
    approved: "success",
    scheduled: "warning",
    published: "default",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            View and manage scheduled content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            Calendar
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Content</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No scheduled content yet.</p>
                <p className="text-sm mt-1">
                  Approve content from campaigns to schedule it.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledContent.map((item) => (
                  <Link
                    key={item.id}
                    href={`/campaigns/${item.campaign_id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                      <div
                        className={`w-2 h-12 rounded-full ${platformColors[item.platform]}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {item.campaign_topic}
                          </span>
                          <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                            {item.platform}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.content}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.scheduled_for && formatDate(item.scheduled_for)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="bg-slate-50 p-2 text-center text-sm font-medium"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const firstDay = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1
                ).getDay();
                const daysInMonth = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0
                ).getDate();
                const dayNum = i - firstDay + 1;
                const isValidDay = dayNum > 0 && dayNum <= daysInMonth;

                const dayContent = scheduledContent.filter((c) => {
                  if (!c.scheduled_for) return false;
                  const d = new Date(c.scheduled_for);
                  return (
                    d.getDate() === dayNum &&
                    d.getMonth() === currentDate.getMonth() &&
                    d.getFullYear() === currentDate.getFullYear()
                  );
                });

                return (
                  <div
                    key={i}
                    className={`bg-white p-2 min-h-[80px] ${
                      !isValidDay ? "bg-slate-50" : ""
                    }`}
                  >
                    {isValidDay && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {dayNum}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayContent.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className={`text-xs text-white px-1.5 py-0.5 rounded truncate ${platformColors[item.platform]}`}
                            >
                              {item.platform}
                            </div>
                          ))}
                          {dayContent.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{dayContent.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
