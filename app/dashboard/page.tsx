'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { AccountsTable } from '@/components/dashboard/accounts-table'
import { AddAccountModal } from '@/components/dashboard/add-account-modal'

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

interface AccountsData {
  accounts: Account[]
  plan: string
  totalCount: number
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 32, width: '40%' }} />
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="table-wrap">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
          }}
        >
          <div className="skeleton" style={{ height: 14, flex: 2, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 14, flex: 1, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<AccountsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAccounts = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await fetch('/api/accounts')
      if (!res.ok) throw new Error('Failed to load accounts')
      const json: AccountsData = await res.json()
      setData(json)
    } catch {
      if (!silent) toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const accounts = data?.accounts ?? []
  const plan = data?.plan ?? 'FREE'

  const billsReady = accounts.filter(
    (a) => a.lastAmount != null && a.lastAmount > 0
  ).length

  const activeAlerts = accounts.filter((a) => a.active).length

  return (
    <div className="animate-fade-in">
      {/* ── Page Header ──────────────────────────────────── */}
      <div
        className="dashboard-header"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage your utility accounts and bill alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Plan badge */}
          <span
            className={`badge ${plan === 'PRO' ? 'badge-purple' : 'badge-gray'}`}
            style={{ padding: '0.35rem 0.875rem', fontSize: '0.75rem' }}
          >
            {plan === 'PRO' ? '⚡ Pro Plan' : '🆓 Free Plan'}
          </span>

          <button
            className="btn btn-outline btn-sm"
            id="dashboard-refresh"
            onClick={() => fetchAccounts(true)}
            disabled={refreshing}
          >
            <RefreshCw size={14} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>

          <button
            className="btn btn-primary"
            id="dashboard-add-account"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      {/* ── Stats Cards ───────────────────────────────────── */}
      {loading ? (
        <div
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <StatsCards
          totalAccounts={accounts.length}
          activeAlerts={activeAlerts}
          billsReady={billsReady}
          plan={plan}
        />
      )}

      {/* ── Accounts Section ─────────────────────────────── */}
      <div className="card accounts-section" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          className="accounts-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h2 className="heading-sm">Utility Accounts</h2>
            {!loading && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.125rem 0 0' }}>
                {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                {plan === 'FREE' && ` · ${3 - accounts.length} remaining on free plan`}
              </p>
            )}
          </div>

          {billsReady > 0 && (
            <span className="badge badge-green">
              {billsReady} bill{billsReady !== 1 ? 's' : ''} ready to pay
            </span>
          )}
        </div>

        <div style={{ padding: '0' }}>
          {loading ? (
            <SkeletonTable />
          ) : (
            <AccountsTable
              accounts={accounts}
              onRefresh={() => fetchAccounts(true)}
            />
          )}
        </div>
      </div>

      {/* ── Pro upgrade nudge (only for free users near limit) */}
      {!loading && plan === 'FREE' && accounts.length >= 2 && (
        <div
          style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, rgb(79 70 229 / 0.08), rgb(6 182 212 / 0.05))',
            border: '1px solid rgb(79 70 229 / 0.2)',
            borderRadius: '0.875rem',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0, fontSize: '0.9rem' }}>
              🚀 Upgrade to Pro for unlimited accounts
            </p>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
              Get priority 2-hour checks, unlimited accounts, and future SMS/Telegram alerts.
            </p>
          </div>
          <a href="/pricing" className="btn btn-primary btn-sm" id="dashboard-upgrade-nudge">
            View Plans →
          </a>
        </div>
      )}

      {/* ── Recent Activity ───────────────────────────────── */}
      {!loading && accounts.some((a) => a.lastCheckedAt) && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 className="heading-sm" style={{ marginBottom: '1rem' }}>
            Recent Checks
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {accounts
              .filter((a) => a.lastCheckedAt)
              .sort((x, y) =>
                new Date(y.lastCheckedAt!).getTime() - new Date(x.lastCheckedAt!).getTime()
              )
              .slice(0, 5)
              .map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    background: 'var(--bg)',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                    {a.customerName ?? a.consumerId}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {a.lastAmount != null && a.lastAmount > 0 && (
                      <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                        NPR {a.lastAmount.toLocaleString()}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-xmuted)' }}>
                      {a.lastCheckedAt
                        ? new Date(a.lastCheckedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : '—'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Add Account Modal ─────────────────────────────── */}
      <AddAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchAccounts(true)}
        plan={plan}
        currentCount={accounts.length}
      />
    </div>
  )
}
