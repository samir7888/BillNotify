import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
]);
// List of known bot user agents
const BOT_USER_AGENTS = [
  "GPTBot",
  "CCBot",
  "anthropic",
  "Claude",
  "Googlebot",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Telegram",
  "curl",
  "wget",
  "python",
  "requests",
  "axios",
  "scrapy",
];

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const acceptHeader = req.headers.get("accept") || "";
  const userAgent = req.headers.get("user-agent") || "";

  // Check if request is from a bot
  const isBot = BOT_USER_AGENTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase()),
  );

  // Check if bot is requesting markdown
  const wantsMarkdown =
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("application/markdown") ||
    acceptHeader.includes("application/vnd.api+markdown");

  // For home page requests from bots requesting markdown
  if ((pathname === "/" || pathname === "") && isBot && wantsMarkdown) {
    try {
      // Try to read the markdown file
      const markdownPath = join(process.cwd(), "public", "site-info.md");
      const markdown = readFileSync(markdownPath, "utf-8");

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (error) {
      console.error("Error reading site-info.md:", error);
      // Fall back to normal page if markdown file not found
    }
  }

  // For direct markdown file requests
  if (pathname === "/site-info.md") {
    try {
      const markdownPath = join(process.cwd(), "public", "site-info.md");
      const markdown = readFileSync(markdownPath, "utf-8");

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (error) {
      console.error("Error reading site-info.md:", error);
    }
  }

  // Protect dashboard and settings routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/", "/site-info.md", "/dashboard(.*)", "/settings(.*)"],
};
