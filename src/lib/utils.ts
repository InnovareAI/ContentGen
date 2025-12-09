import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getPlatformCharLimit(platform: string): number {
  const limits: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    instagram: 2200,
    facebook: 63206,
    blog: Infinity,
  };
  return limits[platform] || 1000;
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    instagram: "#E4405F",
    facebook: "#1877F2",
    blog: "#6366F1",
  };
  return colors[platform] || "#6B7280";
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: "X",
    linkedin: "in",
    instagram: "IG",
    facebook: "f",
    blog: "B",
  };
  return icons[platform] || "?";
}
