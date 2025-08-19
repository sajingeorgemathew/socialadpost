// src/app/api/social/generate/route.ts
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs"; // Ensure Node runtime

export async function POST(req: Request) {
  try {
    const { topic, platforms = ["instagram"] } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Ensure platforms is an array of strings
    const platformList = Array.isArray(platforms) ? platforms : ["instagram"];

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // fast & cheaper
      messages: [
        {
          role: "system",
          content: "You are a marketing assistant that generates engaging social media posts.",
        },
        {
          role: "user",
          content: `Generate short, engaging social media posts for topic: "${topic}" for platforms: ${platformList.join(", ")}. Include platform-tailored captions, optional headlines, and relevant hashtags.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "social_media_posts",
          schema: {
            type: "object",
            properties: {
              posts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    platform: { type: "string" },
                    headline: { type: "string" },
                    caption: { type: "string" },
                    hashtags: { type: "array", items: { type: "string" } },
                  },
                  required: ["platform", "caption"],
                },
              },
            },
            required: ["posts"],
          },
        },
      },
    });

    // Parse the response content from string to object
    const content = response.choices?.[0]?.message?.content;
    let posts: any[] = [];
    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content;
      posts = parsed?.posts ?? [];
    } catch (e) {
      console.error("Failed to parse response content:", e);
    }

    return NextResponse.json({ posts });
  } catch (err: any) {
    console.error("Error in /api/social/generate:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
