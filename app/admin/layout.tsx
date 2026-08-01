import { getAdminSession } from '@/lib/admin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()
  if (!admin) redirect('/dashboard')

  return <>{children}</>
}
