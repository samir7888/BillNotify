# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Nepali households and property managers who:

- Pay NEA (Nepal Electricity Authority) electricity bills through eSewa or Khalti
- Want to be notified when their electricity bills become payable
- Currently check bill status manually on neabilling.com
- Manage one or more electricity consumer accounts

## Product Purpose

BillNotify Nepal automates utility bill checking and sends email alerts when NEA electricity bills become payable. The product eliminates the need for manual checking by monitoring bill status continuously and delivering instant notifications when payment is due.

## Positioning

The only automated bill monitoring service for Nepal's utility system that provides real-time email notifications when NEA bills are payable, using direct integration with official billing portals.

## Operating Context

- Users register by signing up with email via Clerk authentication
- Users add their NEA consumer IDs to their account dashboard
- The system checks bill status against NEA's official billing portal at regular intervals
- Users receive email notifications when bills become payable
- Users can manage multiple consumer accounts and set custom notification emails
- Payment is handled through existing eSewa/Khalti infrastructure

## Capabilities and Constraints

**Current Capabilities:**

- NEA electricity bill monitoring
- Email notifications when bills become payable
- Multi-account management for Pro users
- Dashboard for account management
- Freemium pricing model (Free: 1 account, 6-hour checks; Pro: unlimited accounts, 2-hour checks)

**Planned Features:**

- Water/KUKL bill support
- SMS alert notifications
- Telegram alert notifications

**Technical Constraints:**

- Depends on NEA's public billing portal availability
- Manual payment verification for Pro upgrades
- Email delivery dependent on external service reliability

## Brand Commitments

- Name: "BillNotify Nepal"
- Tagline: "Never Miss a Utility Bill"
- Visual identity: Lightning bolt icon, purple/violet gradient branding
- Pricing commitment: Pro plan as one-time lifetime payment (NPR 49)
- Privacy commitment: Only stores public consumer IDs, no passwords or payment details

## Evidence on Hand

- Existing Next.js/React application with authentication
- Working NEA bill checking integration
- Email notification system via Resend
- Pricing page with Free/Pro tiers
- Dashboard interface for account management
- Clerk authentication integration
- Responsive design system with custom CSS variables

## Product Principles

1. **Automation over Manual Work**: Eliminate repetitive bill checking tasks through reliable automated monitoring
2. **Privacy and Security First**: Store only necessary public information, never passwords or payment credentials
3. **Transparent and Fair Pricing**: One-time Pro upgrade with clear feature boundaries, no hidden fees
4. **Nepal-First Utility Focus**: Purpose-built for Nepal's specific utility payment ecosystem and user needs
5. **Reliable Notifications**: Prioritize delivery reliability over feature complexity for critical bill alerts

## Accessibility & Inclusion

- English interface with Nepal-specific terminology and context
- Responsive design supporting mobile-first usage patterns
- Email notifications accessible to users without smartphone apps
- Clear pricing in local currency (NPR)
