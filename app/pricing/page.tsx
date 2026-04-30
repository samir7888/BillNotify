import Link from 'next/link'
import { Check, Zap, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the BillNotify Nepal plan that fits your needs.',
}

const FREE_FEATURES = [
  'Up to 3 utility accounts',
  'Bill checks every 6 hours',
  'Email notifications',
  'NEA electricity support',
  'Dashboard access',
]

const PRO_FEATURES = [
  'Unlimited utility accounts',
  'Priority checks every 2 hours',
  'Email notifications',
  'NEA electricity support',
  'Dashboard access',
  'Future: SMS alerts',
  'Future: Telegram alerts',
  'Priority support',
]

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Back nav */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '0.875rem 0',
        }}
      >
        <div className="container-page">
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
              transition: 'color 0.15s',
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container-page" style={{ padding: '5rem 1.5rem' }}>
        {/* Header */}
        <div className="pricing-header" style={{ textAlign: 'center', marginBottom: '4rem', padding: '0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgb(79 70 229 / 0.08)',
              border: '1px solid rgb(79 70 229 / 0.2)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}
          >
            Simple, transparent pricing
          </div>
          <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>
            Choose Your Plan
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Start free and upgrade when you need more accounts or faster checks.
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          className="pricing-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '760px',
            margin: '0 auto',
          }}
        >
          {/* FREE Card */}
          <div
            className="card animate-fade-in"
            style={{ padding: '2rem' }}
            id="pricing-free-card"
          >
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🆓</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Free Plan
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)' }}>NPR 0</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/month</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Perfect for a single household managing a few utility connections.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FREE_FEATURES.map((feat) => (
                <li
                  key={feat}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text)' }}
                >
                  <Check size={15} color="var(--success)" strokeWidth={2.5} />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="btn btn-outline"
              id="pricing-free-cta"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Get Started Free
            </Link>
          </div>

          {/* PRO Card */}
          <div
            className="card pricing-card-pro animate-fade-in"
            style={{ padding: '2rem', animationDelay: '0.1s' }}
            id="pricing-pro-card"
          >
            {/* Popular badge */}
            <div
              style={{
                position: 'absolute',
                top: '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.3rem 1rem',
                borderRadius: '0 0 0.5rem 0.5rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Most Popular
            </div>

            <div style={{ marginBottom: '2rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Zap size={20} color="#a78bfa" />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#a78bfa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Pro Plan
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#f1f5f9' }}>
                  NPR 49
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/month</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                For power users, landlords, and businesses managing multiple properties.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PRO_FEATURES.map((feat) => (
                <li
                  key={feat}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: feat.startsWith('Future') ? '#6366f1' : '#e2e8f0' }}
                >
                  <Check size={15} color={feat.startsWith('Future') ? '#6366f1' : '#a78bfa'} strokeWidth={2.5} />
                  {feat}
                </li>
              ))}
            </ul>

            <button
              className="btn btn-primary"
              id="pricing-pro-cta"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 20px rgb(79 70 229 / 0.4)',
                fontSize: '0.95rem',
                padding: '0.75rem',
              }}
              disabled
            >
              <Zap size={16} />
              Upgrade to Pro — Coming Soon
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '0.75rem' }}>
              Payment integration coming soon. Join the waitlist.
            </p>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="comparison-table-wrap hidden md:flex md:flex-col  " style={{ maxWidth: '700px', margin: '4rem auto 0' }}>
          <h2
            className="heading-md"
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            Plan Comparison
          </h2>
          <div className="table-wrap">
            <table className="data-table comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ textAlign: 'center' }}>Free</th>
                  <th style={{ textAlign: 'center' }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Utility Accounts', free: '3', pro: 'Unlimited' },
                  { feature: 'Bill Check Frequency', free: 'Every 6 hours', pro: 'Every 2 hours' },
                  { feature: 'Email Notifications', free: '✓', pro: '✓' },
                  { feature: 'NEA Electricity', free: '✓', pro: '✓' },
                  { feature: 'Water / KUKL (Soon)', free: '✓', pro: '✓' },
                  { feature: 'SMS Alerts (Soon)', free: '—', pro: '✓' },
                  { feature: 'Telegram Alerts (Soon)', free: '—', pro: '✓' },
                  { feature: 'Priority Support', free: '—', pro: '✓' },
                ].map(({ feature, free, pro }) => (
                  <tr key={feature}>
                    <td style={{ fontWeight: 500 }} data-plan="Feature">{feature}</td>
                    <td style={{ textAlign: 'center', color: free === '—' ? 'var(--text-xmuted)' : 'var(--text)' }} data-plan="Free">
                      {free}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        color: pro === '—' ? 'var(--text-xmuted)' : 'var(--primary)',
                        fontWeight: pro !== '—' ? 600 : 400,
                      }}
                      data-plan="Pro"
                    >
                      {pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '600px', margin: '4rem auto 0' }}>
          <h2 className="heading-md" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          <div className="faq-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: 'How does the bill check work?',
                a: "We send a request to NEA's billing portal on your behalf, parse the response, and notify you when a payable amount appears. It's the same check you'd do manually on neabilling.com.",
              },
              {
                q: 'Is my consumer ID safe?',
                a: 'Yes. We only store your public consumer identifiers — the same information printed on your electricity bill. We never store passwords or payment details.',
              },
              {
                q: 'When will Pro be available?',
                a: 'Pro plan with payment integration is coming soon. Until then, all users enjoy Free plan features with no restrictions on the check frequency.',
              },
              {
                q: 'Can I set a different email for alerts?',
                a: 'Yes! Each account can have its own notification email override. This is useful for managing bills on behalf of family or tenants.',
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="card faq-card"
                style={{ padding: '1.25rem' }}
              >
                <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                  {q}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
