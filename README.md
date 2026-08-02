# BillNotify

BillNotify is a Nepal-focused utility bill monitoring platform that helps users stay on top of NEA bill availability and payment reminders.

## Features

- Track utility bill status and payment readiness
- Show bill history analytics with charts and trends
- Send email-based alerts when bills become payable
- Manage accounts, settings, and billing from a dashboard

## Project structure

- app/: Next.js routes, layouts, and API endpoints
- components/: UI and feature components
- lib/: authentication, Prisma, email, and helper utilities
- prisma/: Prisma schema and migrations

## Development

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start the development server
   ```bash
   pnpm dev
   ```
3. Build for production
   ```bash
   pnpm build
   ```

## Environment variables

Set the following environment variables before running the app:

- NEXT_PUBLIC_APP_URL
- CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- DATABASE_URL
- RESEND_API_KEY

## SEO notes

The app includes SEO-friendly metadata and sitemap entries for the main marketing pages as well as the analytics route.
