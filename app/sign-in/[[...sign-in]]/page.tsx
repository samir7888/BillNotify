import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '22px',
            }}
          >
            ⚡
          </div>
          <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)', margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>
            Sign in to your BillNotify Nepal account
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: {
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
              },
            },
          }}
        />
      </div>
    </div>
  )
}
