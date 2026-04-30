'use client'

import { Layers, Bell, CheckCircle, Zap } from 'lucide-react'

interface StatsCardsProps {
  totalAccounts: number
  activeAlerts: number
  billsReady: number
  plan: string
}

export function StatsCards({ totalAccounts, activeAlerts, billsReady, plan }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Accounts',
      value: totalAccounts,
      icon: Layers,
      gradient: 'stat-gradient-1',
      suffix: '',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts,
      icon: Bell,
      gradient: 'stat-gradient-2',
      suffix: '',
    },
    {
      label: 'Bills Ready',
      value: billsReady,
      icon: CheckCircle,
      gradient: 'stat-gradient-3',
      suffix: '',
    },
    {
      label: 'Your Plan',
      value: plan,
      icon: Zap,
      gradient: 'stat-gradient-4',
      suffix: '',
      isText: true,
    },
  ]

  return (
    <div
      className="stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {stats.map(({ label, value, icon: Icon, gradient, isText }) => (
        <div
          key={label}
          className="card animate-fade-in"
          style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}
        >
          {/* Accent blob */}
          <div
            style={{
              position: 'absolute',
              right: '-10px',
              top: '-10px',
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, rgb(79 70 229 / 0.08), transparent)',
              borderRadius: '50%',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>
                {label}
              </p>
              <p
                style={{
                  fontSize: isText ? '1.2rem' : '2rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
            </div>
            <div
              className={gradient}
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} color="white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
