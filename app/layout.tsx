import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BillNotify Nepal — Never Miss a Utility Bill',
    template: '%s | BillNotify Nepal',
  },
  description:
    'Get instant email alerts when your Nepal electricity or water bill becomes payable in eSewa or Khalti. Powered by real-time NEA data.',
  keywords: ['NEA bill', 'Nepal electricity bill', 'eSewa', 'Khalti', 'bill notification', 'Nepal'],
  openGraph: {
    title: 'BillNotify Nepal',
    description: 'Auto-check your Nepal utility bills and get notified instantly.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable}`}>
        <ClerkProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              },
            }}
            richColors
          />
        </ClerkProvider>
      </body>
    </html>
  )
}