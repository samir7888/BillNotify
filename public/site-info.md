# BillNotify - Utility Bill Management & Notifications

## Overview

BillNotify is an intelligent utility bill tracking and notification service for Nepal. We help users stay informed about their electricity and water bills from the Nepal Electricity Authority (NEA) and other utility providers.

## Core Features

### Bill Tracking

- **Automatic Bill Monitoring**: Continuously monitors utility bills from NEA and other providers
- **Multiple Account Support**: Track multiple utility accounts in one place
- **Real-time Notifications**: Get instant alerts when new bills are available
- **Email Alerts**: Receive bill notifications via email for important updates

### Account Management

- **Secure Authentication**: Enterprise-grade security with Clerk authentication
- **User Profiles**: Manage your account information and preferences
- **Email Customization**: Override default email addresses for specific accounts
- **Account Status Tracking**: Monitor the status of all your utility accounts

### Subscription Plans

- **FREE Plan**: Track up to 3 utility accounts with email notifications
- **PRO Plan**: Unlimited account tracking with priority support and advanced features

## Supported Utilities

### Electricity

- Nepal Electricity Authority (NEA)
- Supported through all NEA locations and districts

### Water

- Water supply providers
- Integrated water bill tracking

## Technology Stack

- **Frontend**: Next.js 16 with React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Resend
- **Task Queue**: BullMQ with Redis
- **Web Scraping**: Cheerio for bill extraction

## Key Data Models

### Users

- Email and authentication via Clerk
- Subscription plan (FREE or PRO)
- Email notification preferences

### Utility Accounts

- Account details (customer name, consumer ID)
- Utility type (Electricity, Water)
- Provider information
- Last known bill status and amount

### Notifications

- Email delivery logs
- Bill amount and month tracked
- Notification history and status

### Subscriptions

- Plan type and expiration
- Subscription management

## Main Services

### Account Management

- Add and manage utility accounts
- View account details and history
- Enable/disable account monitoring

### Bill Notifications

- Real-time bill updates
- Email notifications for new bills
- Bill amount and due date information

### Dashboard

- View all utility accounts
- Check recent bills and notifications
- Access account settings

### Pricing Information

- Transparent pricing model
- Compare FREE and PRO features
- Easy plan upgrade options

## Security & Privacy

- **Secure Authentication**: Enterprise-grade security with Clerk
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Privacy First**: User data is never shared with third parties
- **GDPR Compliant**: Respects user privacy and data protection

## Getting Started

1. **Create Account**: Sign up with email or social authentication
2. **Add Utility Account**: Enter your NEA or water utility account details
3. **Receive Notifications**: Get automatic email alerts for new bills
4. **Manage Settings**: Customize notification preferences and account information
5. **Upgrade Plan**: Upgrade to PRO for unlimited accounts and priority support

## API Endpoints

### Accounts Management

- `GET /api/accounts` - List user's utility accounts
- `POST /api/accounts` - Add new utility account
- `GET /api/accounts/[id]` - Get specific account details
- `PUT /api/accounts/[id]` - Update account information

### Account Verification

- `GET /api/check-account/[id]` - Verify account status
- `POST /api/check-account/[id]` - Check for new bills

### Settings

- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings

### Scheduled Tasks

- `POST /api/cron/check-bills` - Automated bill checking cron job

## Contact & Support

For questions, feature requests, or support:

- Visit our dashboard for in-app support
- Check your account settings for help resources

## About

BillNotify simplifies utility bill management for Nepali users by providing automated tracking and timely notifications. We're committed to making bill payments easier and helping users avoid late fees through intelligent reminders.

---

**Last Updated**: May 2026
**Service**: BillNotify - Utility Bill Management Platform
**Version**: 0.1.0
