import type { Metadata } from 'next'
import { AdminPanel } from '@/components/admin/admin-panel'

export const metadata: Metadata = {
  title: 'Admin — Payment Approvals',
  robots: { index: true, follow: true },
}

export default function AdminPage() {
  return <AdminPanel />
}
