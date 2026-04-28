'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { UserProfile } from '@clerk/nextjs'
import { ArrowLeft, Bell, Shield, Zap, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  email: string
  name: string | null
  plan: string
  emailEnabled: boolean
  createdAt: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Profile) => {
        setProfile(data)
        setEmailEnabled(data.emailEnabled)
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggleEmail(enabled: boolean) {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailEnabled: enabled }),
      })
      if (!res.ok) throw new Error()
      setEmailEnabled(enabled)
      toast.success(enabled ? 'Email notifications enabled.' : 'Email notifications disabled.')
    } catch {
      toast.error('Failed to save setting.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your account preferences and notifications.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '100%' }}>

        {/* Account Info Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'rgb(79 70 229 / 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="var(--primary)" />
            </div>
            <div>
              <h2 className="heading-sm">Account Information</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Your profile details</p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: 12, width: '30%' }} />
                  <div className="skeleton" style={{ height: 12, width: '45%' }} />
                </div>
              ))}
            </div>
          ) : profile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { label: 'Name', value: profile.name ?? '—' },
                { label: 'Email', value: profile.email },
                { label: 'Plan', value: profile.plan },
                { label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.625rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: label === 'Plan' ? 700 : 400, color: label === 'Plan' ? 'var(--primary)' : 'var(--text)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'rgb(6 182 212 / 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} color="var(--accent)" />
            </div>
            <div>
              <h2 className="heading-sm">Notification Preferences</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Control how and when you receive alerts</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'var(--bg)',
              borderRadius: '0.625rem',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', margin: 0 }}>
                Email Bill Notifications
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Receive an email when any of your bills become payable
              </p>
            </div>
            <label className="toggle" style={{ flexShrink: 0 }}>
              <input
                type="checkbox"
                id="toggle-email-notifications"
                checked={emailEnabled}
                disabled={saving || loading}
                onChange={(e) => handleToggleEmail(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {saving && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
              Saving…
            </div>
          )}
        </div>

        {/* Plan Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'rgb(245 158 11 / 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="var(--warning)" />
            </div>
            <div>
              <h2 className="heading-sm">Subscription Plan</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Manage your plan and billing</p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgb(79 70 229 / 0.06), rgb(6 182 212 / 0.04))',
              border: '1px solid rgb(79 70 229 / 0.15)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
                {profile?.plan === 'PRO' ? '⚡ Pro Plan' : '🆓 Free Plan'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                {profile?.plan === 'PRO'
                  ? 'Unlimited accounts · Priority 2-hour checks'
                  : '3 accounts · 6-hour checks · Email alerts'}
              </p>
            </div>
            {profile?.plan !== 'PRO' && (
              <Link href="/pricing" className="btn btn-primary btn-sm" id="settings-upgrade-btn">
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>

        {/* Clerk Profile Management */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'rgb(16 185 129 / 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="var(--success)" />
            </div>
            <div>
              <h2 className="heading-sm">Profile &amp; Security</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Update your name, email, and password</p>
            </div>
          </div>
          <UserProfile
            appearance={{
              elements: {
                rootBox: { width: '60%' },
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  borderRadius: 0,
                  padding: 0,
                  margin: 0,
                },
              },
            }}
          />
        </div>

        {/* Danger Zone */}
        <div
          className="card"
          style={{ borderColor: 'rgb(239 68 68 / 0.25)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'rgb(239 68 68 / 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={18} color="var(--danger)" />
            </div>
            <div>
              <h2 className="heading-sm" style={{ color: 'var(--danger)' }}>Danger Zone</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Irreversible actions</p>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              border: '1px solid rgb(239 68 68 / 0.2)',
              borderRadius: '0.625rem',
              background: 'rgb(239 68 68 / 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', margin: 0 }}>
                Delete All Accounts
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Remove all saved utility accounts and notification history
              </p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              id="settings-delete-all-accounts"
              onClick={async () => {
                if (
                  !confirm(
                    'Are you sure? This will delete ALL your utility accounts and cannot be undone.'
                  )
                )
                  return
                try {
                  // Delete each account
                  const res = await fetch('/api/accounts')
                  const data = await res.json()
                  await Promise.all(
                    (data.accounts as { id: string }[]).map((a) =>
                      fetch(`/api/accounts/${a.id}`, { method: 'DELETE' })
                    )
                  )
                  toast.success('All accounts deleted.')
                } catch {
                  toast.error('Failed to delete accounts.')
                }
              }}
            >
              <Trash2 size={14} />
              Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
