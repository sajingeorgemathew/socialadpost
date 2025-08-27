"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        body: JSON.stringify({
          topic,
          platforms: ["instagram", "facebook", "linkedin"],
          count,
        }),
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
    <main className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
      {/* 🔹 Grid Background */}
      <div className="grid-bg"></div>

      <div className="relative z-10 w-full max-w-3xl text-center space-y-10 px-4">
        <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          AI Social Media Post Generator
        </h1>

        {/* 🔹 Futuristic Input Card */}
        <div id="poda" className="flex flex-col gap-6 items-center">
          <div className="glow"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="darkBorderBg"></div>
          <div className="white"></div>
          <div className="border"></div>

          <div id="main" className="relative w-full max-w-lg space-y-4">
            <Textarea
              placeholder="Enter a topic (e.g., Summer Sale, Eco-Friendly Products)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input resize-none h-24"
            />
            <input
              type="text"
              placeholder="Enter a tone (e.g., Friendly, Professional, Exciting)"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input"
            />
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              placeholder="Number of posts"
              className="input"
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
        </div>

        {/* 🔹 Error */}
        {error && <p className="text-red-400 font-semibold">{error}</p>}

        {/* 🔹 Generated Posts */}
        <div className="space-y-6 mt-10">
          {posts.map((post, idx) => (
            <Card
              key={idx}
              className="shadow-2xl rounded-xl border border-gray-700 hover:scale-[1.02] transition-transform bg-gray-900/80 backdrop-blur-md"
            >
              <CardContent className="p-6 space-y-3">
                {post.headline && (
                  <h2 className="text-2xl font-bold text-cyan-400">
                    {post.headline}
                  </h2>
                )}
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
                      [
                        post.headline,
                        post.caption,
                        (post.hashtags || []).join(" "),
                      ]
                        .filter(Boolean)
                        .join("\n\n")
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
