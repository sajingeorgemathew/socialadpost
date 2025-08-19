"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";

type Post = {
  platform: string;
  headline?: string;
  caption: string;
  hashtags?: string[];
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const generatePosts = async () => {
    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const response = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platforms: ["instagram", "facebook", "linkedin"],
        }),
      });

      if (!response.ok) throw new Error("Failed to generate posts");

      // Type-safe parsing
      const data: { posts: Post[] } = await response.json();
      setPosts(data.posts ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">AI Social Media Post Generator</h1>

        {/* Input Section */}
        <Card className="p-4 shadow-lg">
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter a topic (e.g., Summer Sale, Eco-Friendly Products)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Input
              placeholder="Enter a tone (e.g., Friendly, Professional, Exciting)"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
            <Button
              onClick={generatePosts}
              disabled={loading || !topic}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? "Generating..." : "Generate Posts"}
            </Button>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}

        {/* Generated posts */}
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <Card key={idx} className="shadow-md">
              <CardContent className="p-4 space-y-2">
                {post.headline && <h2 className="text-xl font-semibold">{post.headline}</h2>}
                <p className="text-gray-700">{post.caption}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-sm text-blue-600">
                    {post.hashtags.map((tag) => `#${tag}`).join(" ")}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Platform: <span className="font-medium">{post.platform}</span>
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      [post.headline, post.caption, (post.hashtags || []).join(" ")]
                        .filter(Boolean)
                        .join("\n\n")
                    )
                  }
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" /> Copy Post
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
