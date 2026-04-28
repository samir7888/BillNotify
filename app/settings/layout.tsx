import { Sidebar } from '@/components/dashboard/sidebar'
import { getOrCreateProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsLayout({
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
