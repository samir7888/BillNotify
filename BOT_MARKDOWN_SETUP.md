# 🤖 Bot-Friendly Markdown Content Setup Guide

## Overview

This guide explains how the website serves markdown content to AI bots and crawlers while maintaining the normal HTML experience for human users.

## Files Created

### 1. **public/site-info.md**

Comprehensive markdown file containing:

- Website overview and features
- Technology stack
- Supported utilities
- Data models
- API endpoints
- Security information
- Getting started guide

This file is automatically served to AI bots that request markdown content.

### 2. **public/robots.txt**

Updated robots.txt file that:

- ✅ Allows ALL bots to crawl the website
- ✅ Explicitly allows AI crawlers (GPTBot, Claude, CCBot, etc.)
- ✅ Allows the markdown files to be accessed
- ✅ Allows API endpoints to be crawled
- ✅ Sets reasonable crawl delays
- ✅ Includes sitemap reference

## How It Works

### Three Access Methods for Bots

#### Method 1: Direct Markdown File Access

```
GET /site-info.md
```

Bots can directly download the markdown file from the public directory.

#### Method 2: Content Negotiation via Middleware

```
GET /
Accept: text/markdown
```

When bots request the homepage with `Accept: text/markdown` header, the middleware intercepts and serves the markdown file instead of HTML.

#### Method 3: Dedicated API Endpoint

```
GET /api/site-info
Accept: text/markdown
```

Bots can use this endpoint for explicit markdown requests. Supports multiple content types:

- `Accept: text/markdown` → Returns markdown
- `Accept: application/json` → Returns JSON with markdown content
- `Accept: text/html` → Returns HTML with rendered markdown

## Bot Detection

The middleware recognizes these bot user agents:

- GPTBot (OpenAI)
- CCBot (Common Crawl)
- anthropic (Anthropic)
- Claude (Anthropic)
- Googlebot
- Bingbot
- Slurp (Yahoo)
- DuckDuckBot
- Baiduspider
- YandexBot
- And more...

## How to Test

### Test with curl (simulating a bot):

```bash
# Request markdown from home page
curl -H "Accept: text/markdown" \
     -H "User-Agent: GPTBot/1.0" \
     http://localhost:3000/

# Request from API endpoint
curl -H "Accept: text/markdown" \
     http://localhost:3000/api/site-info

# Request as JSON
curl -H "Accept: application/json" \
     http://localhost:3000/api/site-info

# Direct markdown file access
curl http://localhost:3000/site-info.md
```

### Test with different headers:

```bash
# As a regular human visitor (HTML)
curl http://localhost:3000/

# As an AI bot (markdown)
curl -H "User-Agent: CCBot/2.1" \
     -H "Accept: text/markdown" \
     http://localhost:3000/
```

## File Structure

```
nea/
├── public/
│   ├── robots.txt           ← Updated with all bot permissions
│   └── site-info.md         ← Website information in markdown
├── app/
│   └── api/
│       └── site-info/
│           └── route.ts     ← API endpoint for site info
├── middleware.ts            ← Content negotiation logic
└── ...
```

## SEO & Bot Optimization

### robots.txt Configuration

- ✅ Allows: `/` (homepage)
- ✅ Allows: `/site-info.md` (markdown file)
- ✅ Allows: `/api/` (API endpoints)
- ✅ Crawl-delay: 1 second
- ✅ Disallow: Sensitive admin routes
- ✅ Sitemap: Reference included

### Cache Headers

All markdown responses include:

- `Cache-Control: public, max-age=3600` (1 hour cache)
- `X-Content-Type-Options: nosniff`
- Proper `Content-Type` headers for each format

## Use Cases

### 1. **AI Training & LLMs**

- GPTBot can crawl and learn from your site structure
- Claude can access comprehensive markdown documentation
- Provides structured information for model training

### 2. **Search Engine Optimization**

- Search engines can crawl both HTML and markdown versions
- Better indexing of structured content
- Improved SEO metadata

### 3. **API Crawlers**

- Automated documentation scrapers can get markdown
- Data aggregators can access formatted content
- Content repurposing becomes easier

### 4. **Accessibility**

- Screen readers can process markdown more effectively
- Simplified document structure for accessibility tools
- Better compatibility with various tools

## Maintenance

### To Update Website Information

1. Edit `public/site-info.md` with new information
2. Changes are immediately available to bots
3. Cache will refresh within 1 hour (or force refresh)

### To Allow New Bots

1. Edit `middleware.ts` - Add bot user agent to `BOT_USER_AGENTS` array
2. Update `public/robots.txt` - Add bot-specific rules if needed

### To Change Cache Duration

1. Edit `middleware.ts` line: `'Cache-Control': 'public, max-age=3600'`
2. Change `3600` to desired seconds (e.g., `86400` for 24 hours)

## Headers Sent to Bots

### For Markdown Requests

```
Content-Type: text/markdown; charset=utf-8
X-Content-Type-Options: nosniff
Cache-Control: public, max-age=3600
Access-Control-Allow-Origin: *
```

### For JSON Requests

```
Content-Type: application/json
Cache-Control: public, max-age=3600
```

### For HTML Requests

```
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
```

## Security Considerations

✅ **Safe for Bots**: Public information only  
✅ **No Private Data**: Credentials not exposed  
✅ **Rate Limited**: Crawl delay set in robots.txt  
✅ **Access Controlled**: Sensitive endpoints disallowed  
✅ **Content-Type Headers**: Prevents MIME sniffing

## Monitoring Bot Requests

You can add logging to track bot requests by updating `middleware.ts`:

```typescript
if (isBot && wantsMarkdown) {
  console.log(`Bot request: ${userAgent} - ${pathname}`);
  // Your monitoring/analytics here
}
```

## Benefits

🎯 **Better AI Integration**: LLMs and bots get clean, structured data  
🎯 **Improved Crawlability**: Search engines better understand your content  
🎯 **Multiple Formats**: JSON, Markdown, and HTML all supported  
🎯 **Easy Maintenance**: Single markdown file to update  
🎯 **Future-Proof**: Compatible with next-generation AI crawlers  
🎯 **Performance**: Proper caching for bot requests

## Troubleshooting

### Markdown file not found

- Ensure `public/site-info.md` exists
- Check file permissions
- Verify Next.js is configured to serve public directory

### Bots still receiving HTML

- Verify user agent contains one from `BOT_USER_AGENTS`
- Check that `Accept: text/markdown` header is being sent
- Look for middleware errors in console

### Cache not updating

- Clear browser cache
- Wait for TTL expiration (1 hour default)
- Or manually invalidate cache if using CDN

---

**Setup Date**: May 2026  
**Documentation Version**: 1.0  
**Next.js Version**: 16+
