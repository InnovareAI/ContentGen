"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Content, Platform } from "@/types";
import { cn, getPlatformCharLimit } from "@/lib/utils";
import { Check, X, Edit2, Copy, RefreshCw } from "lucide-react";

interface ContentPreviewProps {
  content: Content;
  onUpdate?: (id: string, newContent: string) => Promise<void>;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onRegenerate?: (id: string) => Promise<void>;
}

const platformStyles: Record<Platform, { bg: string; border: string }> = {
  blog: { bg: "bg-indigo-50", border: "border-indigo-200" },
  linkedin: { bg: "bg-blue-50", border: "border-blue-200" },
  twitter: { bg: "bg-sky-50", border: "border-sky-200" },
  instagram: { bg: "bg-pink-50", border: "border-pink-200" },
  facebook: { bg: "bg-blue-50", border: "border-blue-300" },
};

const platformLabels: Record<Platform, string> = {
  blog: "Blog Post",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  instagram: "Instagram",
  facebook: "Facebook",
};

export function ContentPreview({
  content,
  onUpdate,
  onApprove,
  onReject,
  onRegenerate,
}: ContentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content || "");
  const [saving, setSaving] = useState(false);

  const style = platformStyles[content.platform];
  const charLimit = getPlatformCharLimit(content.platform);
  const charCount = editedContent.length;
  const isOverLimit = charCount > charLimit;

  const handleSave = async () => {
    if (!onUpdate) return;
    setSaving(true);
    await onUpdate(content.id, editedContent);
    setSaving(false);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content || "");
  };

  const statusColors: Record<string, "default" | "secondary" | "success" | "destructive"> = {
    draft: "secondary",
    approved: "success",
    rejected: "destructive",
    published: "default",
  };

  return (
    <div className={cn("rounded-lg border p-4", style.bg, style.border)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{platformLabels[content.platform]}</h3>
          <Badge variant={statusColors[content.status]}>{content.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                title="Copy content"
              >
                <Copy size={16} />
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerate(content.id)}
                  title="Regenerate"
                >
                  <RefreshCw size={16} />
                </Button>
              )}
              {onUpdate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[200px] bg-white"
          />
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-sm",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {charCount.toLocaleString()}
              {charLimit !== Infinity && ` / ${charLimit.toLocaleString()}`} characters
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedContent(content.content || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="prose prose-sm max-w-none mb-4 whitespace-pre-wrap bg-white/50 p-3 rounded">
            {content.content}
          </div>

          {content.status === "draft" && (onApprove || onReject) && (
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm text-muted-foreground">
                {charCount.toLocaleString()} characters
              </span>
              <div className="flex gap-2">
                {onReject && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(content.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </Button>
                )}
                {onApprove && (
                  <Button
                    size="sm"
                    onClick={() => onApprove(content.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
