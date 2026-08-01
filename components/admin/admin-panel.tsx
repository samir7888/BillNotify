'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  Shield,
  XCircle,
} from 'lucide-react'

type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface SubmissionUser {
  id: string
  email: string
  name: string | null
  plan: string
}

interface Submission {
  id: string
  userId: string
  status: SubmissionStatus
  submittedAt: string
  reviewedAt: string | null
  hasProofImage: boolean
  user: SubmissionUser
}

const STATUS_FILTERS = ['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const

export function AdminPanel() {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('PENDING')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [proofImage, setProofImage] = useState<string | null>(null)
  const [proofLoading, setProofLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/submissions?status=${filter}`)
      if (res.status === 403) {
        toast.error('Access denied.')
        return
      }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubmissions(data.submissions)
      setSelectedId((current) => {
        if (current && data.submissions.some((s: Submission) => s.id === current)) {
          return current
        }
        return data.submissions[0]?.id ?? null
      })
    } catch {
      toast.error('Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  useEffect(() => {
    if (!selectedId) {
      setProofImage(null)
      return
    }

    let cancelled = false
    setProofLoading(true)
    setProofImage(null)

    fetch(`/api/admin/submissions/${selectedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setProofImage(data.submission?.proofImage ?? null)
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load payment proof.')
      })
      .finally(() => {
        if (!cancelled) setProofLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedId])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    const label = action === 'approve' ? 'approve this payment' : 'reject this payment'
    if (!window.confirm(`Are you sure you want to ${label}?`)) return

    setActionId(id)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? data.error ?? 'Action failed.')
        return
      }

      toast.success(data.message)
      await loadSubmissions()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setActionId(null)
    }
  }

  const selected = submissions.find((s) => s.id === selectedId) ?? null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '0.875rem 0',
        }}
      >
        <div className="container-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--primary)',
              background: 'rgb(79 70 229 / 0.08)',
              border: '1px solid rgb(79 70 229 / 0.15)',
              borderRadius: '9999px',
              padding: '0.3rem 0.75rem',
            }}
          >
            <Shield size={13} />
            Admin
          </div>
        </div>
      </div>

      <div className="container-page" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="heading-lg" style={{ marginBottom: '0.35rem' }}>
            Payment Approvals
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review Pro upgrade payment proofs and approve or reject submissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              className={filter === status ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setFilter(status)}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Loading submissions…
          </div>
        ) : submissions.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              No {filter === 'ALL' ? '' : filter.toLowerCase()} submissions found.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => setSelectedId(submission.id)}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border:
                      selectedId === submission.id
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border)',
                    background:
                      selectedId === submission.id ? 'rgb(79 70 229 / 0.04)' : 'var(--surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>
                      {submission.user.name ?? submission.user.email}
                    </strong>
                    <StatusBadge status={submission.status} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {submission.user.email}
                  </p>
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.72rem', color: 'var(--text-xmuted)' }}>
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>

            {selected && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 className="heading-md" style={{ marginBottom: '0.35rem' }}>
                    {selected.user.name ?? selected.user.email}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    {selected.user.email} · Current plan: <strong>{selected.user.plan}</strong>
                  </p>
                  <p style={{ color: 'var(--text-xmuted)', fontSize: '0.75rem', margin: '0.35rem 0 0' }}>
                    Submitted {new Date(selected.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    marginBottom: '1.25rem',
                    minHeight: 240,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {proofLoading ? (
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
                  ) : proofImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proofImage}
                      alt="Payment proof"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 360,
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                      }}
                    />
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No proof image available
                    </span>
                  )}
                </div>

                {selected.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ flex: 1, color: 'var(--danger, #dc2626)', borderColor: 'rgb(220 38 38 / 0.3)' }}
                      disabled={actionId === selected.id}
                      onClick={() => handleAction(selected.id, 'reject')}
                    >
                      {actionId === selected.id ? (
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <XCircle size={16} />
                          Reject
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ flex: 2 }}
                      disabled={actionId === selected.id}
                      onClick={() => handleAction(selected.id, 'approve')}
                    >
                      {actionId === selected.id ? (
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <Check size={16} />
                          Approve & Upgrade to Pro
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '0.625rem',
                      background: selected.status === 'APPROVED' ? 'rgb(34 197 94 / 0.08)' : 'rgb(239 68 68 / 0.08)',
                      border: `1px solid ${selected.status === 'APPROVED' ? 'rgb(34 197 94 / 0.2)' : 'rgb(239 68 68 / 0.2)'}`,
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {selected.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    {selected.reviewedAt && ` on ${new Date(selected.reviewedAt).toLocaleString()}`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const styles: Record<SubmissionStatus, { bg: string; color: string; border: string }> = {
    PENDING: {
      bg: 'rgb(245 158 11 / 0.1)',
      color: '#b45309',
      border: 'rgb(245 158 11 / 0.25)',
    },
    APPROVED: {
      bg: 'rgb(34 197 94 / 0.1)',
      color: '#15803d',
      border: 'rgb(34 197 94 / 0.25)',
    },
    REJECTED: {
      bg: 'rgb(239 68 68 / 0.1)',
      color: '#dc2626',
      border: 'rgb(239 68 68 / 0.25)',
    },
  }

  const style = styles[status]

  return (
    <span
      style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        padding: '0.2rem 0.5rem',
        borderRadius: '9999px',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
