'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2, RefreshCw, Zap, Droplets } from 'lucide-react'
import { formatCurrency, formatRelativeTime, getStatusColor } from '@/lib/utils'

interface Account {
  id: string
  customerName: string | null
  utilityType: string
  consumerId: string
  providerName: string
  lastStatus: string | null
  lastAmount: number | null
  lastCheckedAt: string | null
  lastBillMonth: string | null
  active: boolean
}

interface AccountsTableProps {
  accounts: Account[]
  onRefresh: () => void
}

export function AccountsTable({ accounts, onRefresh }: AccountsTableProps) {
  console.log(accounts)
  const [checkingId, setCheckingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleCheckNow(id: string) {
    setCheckingId(id)
    try {
      const res = await fetch(`/api/check-account/${id}`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data.error ?? 'Check failed. Please try again.')
      } else if (data.notified) {
        toast.success('✅ Bill is ready! Email notification sent.')
      } else if (data.result?.payableAmount > 0) {
        toast.info(`Bill found: NPR ${data.result.payableAmount?.toLocaleString()}. Already notified previously.`)
      } else {
        toast.success('Check complete. No payable bill found yet.')
      }

      onRefresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setCheckingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this account? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Account deleted.')
        onRefresh()
      } else {
        toast.error('Failed to delete account.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setDeletingId(null)
    }
  }

  if (accounts.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '2px dashed var(--border)',
          borderRadius: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
        <h3 className="heading-sm" style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>
          No accounts yet
        </h3>
        <p style={{ fontSize: '0.875rem' }}>
          Add your first NEA consumer ID to start receiving bill alerts.
        </p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Type</th>
            <th>Consumer ID</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Last Checked</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => {
            const statusColor = getStatusColor(account.lastStatus)
            const isChecking = checkingId === account.id
            const isDeleting = deletingId === account.id

            return (
              <tr key={account.id}>
                {/* Customer Name */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {account.customerName ?? '—'}
                  </div>
                  
                </td>

                {/* Utility Type */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {account.utilityType === 'ELECTRICITY' ? (
                      <Zap size={14} color="var(--warning)" />
                    ) : (
                      <Droplets size={14} color="var(--accent)" />
                    )}
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {account.utilityType === 'ELECTRICITY' ? 'Electricity' : 'Water'}
                    </span>
                  </div>
                </td>

                {/* Consumer ID */}
                <td>
                  <code
                    style={{
                      background: 'var(--bg)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {account.consumerId}
                  </code>
                </td>

                {/* Status */}
                <td>
                  {account.lastStatus ? (
                    <span
                      className={`badge badge-${statusColor}`}
                      id={`status-${account.id}`}
                    >
                      {account.lastStatus.length > 30
                        ? account.lastStatus.substring(0, 30) + '…'
                        : account.lastStatus}
                    </span>
                  ) : (
                    <span className="badge badge-gray">Not Checked</span>
                  )}
                </td>

                {/* Amount */}
                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        account.lastAmount && account.lastAmount > 0
                          ? 'var(--success)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {formatCurrency(account.lastAmount)}
                  </span>
                </td>

                {/* Last Checked */}
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {formatRelativeTime(account.lastCheckedAt)}
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      id={`check-now-${account.id}`}
                      onClick={() => handleCheckNow(account.id)}
                      disabled={isChecking || isDeleting}
                      title="Check Now"
                    >
                      <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} style={isChecking ? { animation: 'spin 1s linear infinite' } : {}} />
                      {isChecking ? 'Checking…' : 'Check'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      id={`delete-${account.id}`}
                      onClick={() => handleDelete(account.id)}
                      disabled={isChecking || isDeleting}
                      title="Delete"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={14} />
                      {isDeleting ? '…' : ''}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
