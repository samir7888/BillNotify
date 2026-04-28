import * as React from 'react'
import type { BillEmailPayload } from '@/lib/email'

export function BillReadyEmail({
  customerName,
  consumerId,
  amount,
  billMonth,
  status,
  providerName,
}: BillEmailPayload) {
  return (
    <div
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#f8f9fc',
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '32px',
            textAlign: 'center' as const,
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚡</div>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '22px', fontWeight: 700 }}>
            Bill Ready to Pay!
          </h1>
          <p style={{ color: '#c4b5fd', margin: '8px 0 0', fontSize: '14px' }}>
            BillNotify Nepal
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px' }}>
          <p style={{ color: '#374151', fontSize: '16px', margin: '0 0 24px' }}>
            Hello <strong>{customerName}</strong>,<br />
            <br />
            Great news! Your <strong>{providerName}</strong> electricity bill is now available
            and ready to be paid through eSewa or Khalti.
          </p>

          {/* Bill detail card */}
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>Consumer ID</span>
              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{consumerId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>Bill Month</span>
              <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{billMonth}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>Status</span>
              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {status}
              </span>
            </div>
            <div
              style={{
                borderTop: '1px solid #bbf7d0',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#111827', fontSize: '15px', fontWeight: 600 }}>Amount Due</span>
              <span style={{ color: '#15803d', fontSize: '24px', fontWeight: 800 }}>
                NPR {amount.toLocaleString()}
              </span>
            </div>
          </div>

          <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.6' }}>
            Pay through eSewa or Khalti before the due date to avoid late fees.
            Log in to your BillNotify Nepal dashboard to view more details.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            padding: '20px 32px',
            textAlign: 'center' as const,
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
            You received this because you signed up on{' '}
            <strong style={{ color: '#4f46e5' }}>BillNotify Nepal</strong>.
            <br />
            To unsubscribe, update your notification settings in the dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

// Legacy compatibility
export function EmailTemplate({ firstName }: { firstName: string }) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  )
}