"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Building2, Trash2 } from "lucide-react";
import { Brand, Platform } from "@/types";
import { cn } from "@/lib/utils";

// Placeholder data
const mockBrands: Brand[] = [
  {
    id: "1",
    user_id: "user1",
    name: "TechHealth Inc",
    tone_of_voice: "Professional, innovative, trustworthy",
    brand_guidelines:
      "Focus on patient outcomes. Use data-driven language. Avoid jargon.",
    system_prompt: null,
    default_platforms: ["blog", "linkedin"],
    metadata: null,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    user_id: "user1",
    name: "GreenCo",
    tone_of_voice: "Friendly, passionate, educational",
    brand_guidelines:
      "Emphasize sustainability. Use inclusive language. Be optimistic.",
    system_prompt: null,
    default_platforms: ["instagram", "facebook"],
    metadata: null,
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z",
  },
];

const platforms: { id: Platform; label: string }[] = [
  { id: "blog", label: "Blog" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter/X" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tone_of_voice: "",
    brand_guidelines: "",
    system_prompt: "",
    default_platforms: [] as Platform[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      tone_of_voice: "",
      brand_guidelines: "",
      system_prompt: "",
      default_platforms: [],
    });
    setEditingBrand(null);
    setShowForm(false);
  };

  const handleEdit = (brand: Brand) => {
    setFormData({
      name: brand.name,
      tone_of_voice: brand.tone_of_voice || "",
      brand_guidelines: brand.brand_guidelines || "",
      system_prompt: brand.system_prompt || "",
      default_platforms: brand.default_platforms as Platform[],
    });
    setEditingBrand(brand);
    setShowForm(true);
  };

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      default_platforms: prev.default_platforms.includes(platform)
        ? prev.default_platforms.filter((p) => p !== platform)
        : [...prev.default_platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST or PATCH to /api/brands
    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? { ...b, ...formData, updated_at: new Date().toISOString() }
            : b
        )
      );
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        user_id: "user1",
        ...formData,
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBrands((prev) => [newBrand, ...prev]);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    // In production: DELETE to /api/brands/:id
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground">
            Configure brand voices and guidelines for content generation
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-2" />
            Add Brand
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingBrand ? "Edit Brand" : "Create New Brand"}
            </CardTitle>
            <CardDescription>
              Define your brand&apos;s voice and content guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Acme Corp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone of Voice</Label>
                <Input
                  id="tone"
                  value={formData.tone_of_voice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tone_of_voice: e.target.value,
                    }))
                  }
                  placeholder="e.g., Professional, friendly, innovative"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidelines">Brand Guidelines</Label>
                <Textarea
                  id="guidelines"
                  value={formData.brand_guidelines}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      brand_guidelines: e.target.value,
                    }))
                  }
                  placeholder="Key messaging rules, words to use/avoid, style notes..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system_prompt">
                  Custom System Prompt (Advanced)
                </Label>
                <Textarea
                  id="system_prompt"
                  value={formData.system_prompt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      system_prompt: e.target.value,
                    }))
                  }
                  placeholder="Custom instructions for the AI when generating content for this brand..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Default Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-colors",
                        formData.default_platforms.includes(platform.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-slate-100 hover:bg-slate-200"
                      )}
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBrand ? "Save Changes" : "Create Brand"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Brand List */}
      <div className="grid md:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{brand.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(brand.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              {brand.tone_of_voice && (
                <CardDescription>{brand.tone_of_voice}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {brand.brand_guidelines && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {brand.brand_guidelines}
                </p>
              )}
              {brand.default_platforms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(brand.default_platforms as Platform[]).map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleEdit(brand)}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No brands yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first brand to customize content generation
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus size={18} className="mr-2" />
              Add Brand
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
