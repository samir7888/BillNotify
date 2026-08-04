import { Sidebar } from '@/components/dashboard/sidebar'
import { getOrCreateProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bill History Analytics',
  description:
    'Review your utility bill history, payment trends, and monthly insights in the BillNotify analytics dashboard.',
  alternates: {
    canonical: '/analytics',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}
