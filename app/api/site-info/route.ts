import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/site-info
 *
 * Returns website information as markdown for AI bots and crawlers.
 * Supports content negotiation based on Accept header.
 *
 * Supported accept types:
 * - text/markdown
 * - application/markdown
 * - application/json
 * - text/html (default)
 */
export async function GET(request: NextRequest) {
  try {
    const acceptHeader = request.headers.get("accept") || "text/html";

    // Read the markdown file
    const markdownPath = join(process.cwd(), "public", "site-info.md");
    const markdown = readFileSync(markdownPath, "utf-8");

    // Determine response format based on Accept header
    if (
      acceptHeader.includes("application/json") ||
      acceptHeader.includes("json")
    ) {
      // Return as JSON
      const lines = markdown.split("\n");
      return NextResponse.json({
        title: "BillNotify - Website Information",
        format: "markdown",
        content: markdown,
        description:
          "BillNotify is a utility bill tracking and notification service for Nepal.",
        lastUpdated: new Date().toISOString(),
      });
    }

    if (
      acceptHeader.includes("text/markdown") ||
      acceptHeader.includes("application/markdown") ||
      acceptHeader.includes("application/vnd.api+markdown")
    ) {
      // Return as Markdown
      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Default: Return as HTML with markdown content in a pre tag
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BillNotify - Site Information</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 2rem; }
    pre { background: #f4f4f4; padding: 1.5rem; border-radius: 4px; overflow-x: auto; border-left: 4px solid #0ea5e9; }
    code { font-family: 'Courier New', monospace; font-size: 14px; }
    h1 { color: #0ea5e9; margin-bottom: 1rem; }
    .note { background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📄 BillNotify - Website Information (Markdown)</h1>
    <div class="note">
      <strong>For AI Bots & Crawlers:</strong> This endpoint serves website information in multiple formats. 
      Send <code>Accept: text/markdown</code> header to receive markdown format.
    </div>
    <pre><code>${markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
  </div>
</body>
</html>
    `;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error in site-info API route:", error);
    return NextResponse.json(
      { error: "Failed to retrieve site information" },
      { status: 500 },
    );
  }
}

export const metadata = {
  title: "BillNotify - Site Information",
  description: "Website information for AI bots and crawlers",
};
