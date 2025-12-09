import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Content Engine</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold mb-6">
            One Idea, Complete Content Campaign
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform a single topic into optimized content for every platform.
            Blog posts, LinkedIn, Twitter, Instagram, Facebook - all generated
            with AI, tailored for each channel.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Start Creating</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Log in
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Multi-Platform</h3>
              <p className="text-muted-foreground">
                Generate content for blog, LinkedIn, Twitter, Instagram, and
                Facebook from one input.
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Brand Voice</h3>
              <p className="text-muted-foreground">
                Configure tone-of-voice and brand guidelines that shape every
                piece of content.
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Powered by Claude for text and DALL-E for images. Quality
                content in seconds.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
