import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return `NPR ${amount.toLocaleString('ne-NP')}`
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Never'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Never'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function getStatusColor(status: string | null | undefined): string {
  if (!status) return 'gray'
  const s = status.toLowerCase()
  if (s.includes('ready') || s.includes('payable') || s.includes('due')) return 'green'
  if (s.includes('paid')) return 'blue'
  if (s.includes('error') || s.includes('fail')) return 'red'
  return 'yellow'
}

export function shouldNotify(
  lastAmount: number | null,
  lastBillMonth: string | null,
  newAmount: number,
  newBillMonth: string,
  lastNotifiedAt: Date | null,
): boolean {
  // No amount means nothing to notify
  if (!newAmount || newAmount <= 0) return false

  // Same bill month + same amount = already notified
  if (
    lastBillMonth === newBillMonth &&
    lastAmount === newAmount &&
    lastNotifiedAt !== null
  ) {
    return false
  }

  return true
}

export function FREE_ACCOUNT_LIMIT() {
  return 3
}

export function getCheckIntervalHours(plan: string): number {
  return plan === 'PRO' ? 2 : 6
}
