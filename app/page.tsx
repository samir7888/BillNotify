'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { motion } from 'framer-motion'
import {
  Zap,
  Bell,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Mail,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  MapPin
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '6rem 0 5rem',
          textAlign: 'center',
        }}
      >
        {/* Glow orbs */}
        <div
          className="hero-glow"
          style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)' }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgb(6 182 212 / 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            right: '5%',
            bottom: 0,
            pointerEvents: 'none',
          }}
        />

        <div className="container-page" style={{ position: 'relative' }}>
          <div
            className="animate-fade-in"
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
              marginBottom: '2rem',
            }}
          >
            <span className="pulse-dot" style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />
            Now supporting NEA Electricity Bills
          </div>

          <h1
            className="heading-xl animate-slide-up"
            style={{ marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}
          >
            Never Miss Your{' '}
            <span className="gradient-text">Nepal Electricity Authority (NEA) Utility Bill</span>{' '}
            Again
          </h1>

          <p
            className="animate-slide-up"
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.7',
              animationDelay: '0.1s',
            }}
          >
            Save your NEA consumer IDs. We automatically check when your bill is payable
            in eSewa or Khalti and send you an instant email alert — so you pay on time,
            every time.
          </p>

          <div
            className="animate-slide-up"
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              animationDelay: '0.2s',
            }}
          >
            <Link href="/pricing" className="btn btn-outline btn-lg" id="hero-cta-pricing">
              See Pricing
            </Link>

            <Link href="/dashboard" className="btn btn-primary btn-lg" id="hero-cta-dashboard">
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="animate-fade-in"
            style={{
              marginTop: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              animationDelay: '0.4s',
            }}
          >
            <CheckCircle size={14} color="var(--success)" />
            No credit card required &nbsp;·&nbsp;
            <CheckCircle size={14} color="var(--success)" />
            Free plan available &nbsp;·&nbsp;
            <CheckCircle size={14} color="var(--success)" />
            Setup in 2 minutes
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container-page">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
              Get started in minutes. We handle the checking — you just pay when ready.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                step: '01',
                icon: Shield,
                title: 'Sign Up',
                desc: 'Create your free account with your email. No credit card needed.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Add Your Consumer IDs',
                desc: 'Enter your NEA location code, SC No, and Consumer ID. We verify it instantly.',
              },
              {
                step: '03',
                icon: Clock,
                title: 'We Auto-Check',
                desc: 'Our system checks your bill every 6 hours (Free) or 2 hours (Pro).',
              },
              {
                step: '04',
                icon: Bell,
                title: 'Get Notified',
                desc: 'Receive an email the moment your bill becomes payable in eSewa/Khalti.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card card-hover animate-fade-in" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    background: 'rgb(79 70 229 / 0.1)',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    color: 'var(--primary)',
                  }}
                >
                  <Icon size={22} />
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-xmuted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Step {step}
                </div>
                <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background blur */}
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgb(79 70 229 / 0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgb(6 182 212 / 0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="container-page" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgb(79 70 229 / 0.1)',
                color: 'var(--primary)',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              Powerful Features
            </motion.div>
            <motion.h2 
              className="heading-lg" 
              style={{ marginBottom: '1rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything You Need
            </motion.h2>
            <motion.p
              style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Designed for reliability and simplicity. We provide all the tools you need to stay on top of your utility bills seamlessly.
            </motion.p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              { icon: <Zap size={22} />, title: 'Real-Time NEA Checks', desc: 'Direct integration with NEA billing system. Results are always fresh and accurate.', color: '#eab308' },
              { icon: <Mail size={22} />, title: 'Instant Email Alerts', desc: 'Get notified the moment your bill is available. Never lose a late payment penalty.', color: '#3b82f6' },
              { icon: <ShieldCheck size={22} />, title: 'Bank-Grade Security', desc: 'Your data is encrypted and protected. We only store your consumer IDs, never passwords.', color: '#10b981' },
              { icon: <Smartphone size={22} />, title: 'Multiple Accounts', desc: 'Manage electricity bills for your home, office, and family all in one place.', color: '#8b5cf6' },
              { icon: <RefreshCw size={22} />, title: 'Auto-Recurring Checks', desc: 'Set it and forget it. Our cron jobs keep checking so you don\'t have to.', color: '#ec4899' },
              { icon: <MapPin size={22} />, title: 'Built for Nepal', desc: 'Understands Nepal\'s billing cycles, NEA location codes, and SC numbers natively.', color: '#ef4444' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border)',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Glow behind icon */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`, borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
                
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 54, 
                  height: 54, 
                  borderRadius: '16px', 
                  background: `${feature.color}15`, 
                  color: feature.color, 
                  marginBottom: '1.5rem',
                  border: `1px solid ${feature.color}30`
                }}>
                  {feature.icon}
                </div>
                <h3 className="heading-sm" style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO / AI Definitions (GEO) ───────────────────── */}
      <section style={{ padding: '4rem 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="container-page">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="heading-md w-full text-center" style={{ marginBottom: '1.5rem' }}>Understanding Your NEA Utility Bill</h2>
            <p className='w-full text-center text-balance' style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              BillNotify Nepal is an automated utility notification platform. We help you avoid late fees by tracking your electricity bills.
            </p>
            
            <dl style={{ display: 'grid', gap: '1.5rem', margin: 0 }}>
              <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <dt style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                  What is an NEA SC Number?
                </dt>
                <dd style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                  The SC Number (Service Counter Number) is a unique identifier assigned by the Nepal Electricity Authority (NEA) to a specific meter connection. It is used alongside the Consumer ID to check bill status.
                </dd>
              </div>
              
              <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <dt style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                  How do I pay my NEA bill online?
                </dt>
                <dd style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                  You can pay your NEA electricity bill online in Nepal using digital wallets like eSewa,
                   Khalti, or mobile banking apps. BillNotify Nepal alerts you exactly when the
                    bill is marked as &quot;READY TO PAY&quot; in the NEA system.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container-page" style={{ textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e0a4b 0%, #0c1a3a 100%)',
              borderRadius: '1.5rem',
              padding: '4rem 2rem',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgb(79 70 229 / 0.3)',
            }}
          >
            <div className="hero-glow" style={{ top: '-50%', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🇳🇵</div>
              <h2 className="heading-lg" style={{ color: 'white', marginBottom: '1rem' }}>
                Start Getting Bill Alerts Today
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                Join thousands of Nepali households who never miss a payment deadline.
              </p>
              <Link href="/dashboard" className="btn btn-primary btn-lg" id="cta-bottom-dashboard">
                Open Dashboard <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0' }}>
        <div
          className="container-page flex-col md:flex content-center w-full "
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={13} color="white" />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>
              BillNotify Nepal
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} BillNotify Nepal. Built with ❤️ for Nepal.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/pricing" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
              Pricing
            </Link>
            <Link href="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
