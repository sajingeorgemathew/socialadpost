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
  const [count, setCount] = useState(3);
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
        body: JSON.stringify({ topic, platforms: ["instagram", "facebook", "linkedin"], count }),
      });

      if (!response.ok) throw new Error("Failed to generate posts");

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-start py-16 px-4 text-white">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          AI Social Media Post Generator
        </h1>

        {/* Input Section */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700">
          <Textarea
            placeholder="Enter a topic (e.g., Summer Sale, Eco-Friendly Products)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-lg bg-gray-800 text-white placeholder-gray-400 rounded-lg p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <Input
            placeholder="Enter a tone (e.g., Friendly, Professional, Exciting)"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="text-lg bg-gray-800 text-white placeholder-gray-400 rounded-lg p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            placeholder="Number of posts"
            className="text-lg bg-gray-800 text-white placeholder-gray-400 rounded-lg p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button
            onClick={generatePosts}
            disabled={loading || !topic}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading ? "Generating..." : "Generate Posts"}
          </Button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-400 font-semibold">{error}</p>}

        {/* Generated posts */}
        <div className="space-y-4 mt-8">
          {posts.map((post, idx) => (
            <Card key={idx} className="shadow-2xl rounded-xl border border-gray-700 hover:scale-[1.02] transition-transform bg-gray-900/80 backdrop-blur-md">
              <CardContent className="p-6 space-y-3">
                {post.headline && <h2 className="text-2xl font-bold text-cyan-400">{post.headline}</h2>}
                <p className="text-gray-200">{post.caption}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-sm text-purple-400">
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
                      [post.headline, post.caption, (post.hashtags || []).join(" ")].filter(Boolean).join("\n\n")
                    )
                  }
                  className="flex items-center gap-1 text-cyan-400 border-cyan-400 hover:bg-cyan-500 hover:text-white transition"
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
