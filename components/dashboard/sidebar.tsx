'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Settings,
  Zap,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/pricing', label: 'Upgrade', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button - only visible on small screens */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}  
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 45,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
        } as React.CSSProperties}
        className="mobile-menu-btn"
        id="mobile-menu-toggle"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Backdrop - only visible when menu is open on mobile */}
      {isOpen && (
        <div
          className="sidebar-backdrop mobile-open"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgb(0 0 0 / 0.5)',
            zIndex: 40,
            animation: 'fade-in 0.2s ease',
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${isOpen ? ' mobile-open' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            display: 'none',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.5rem',
            zIndex: 51,
          }}
          className="mobile-close-btn"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '2rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.2 }}>
              BillNotify
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              NEPAL
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-xmuted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Menu
          </div>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item${isActive ? ' active' : ''}`}
                id={`nav-${label.toLowerCase()}`}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}

          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-xmuted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 0.875rem',
              marginBottom: '0.5rem',
              marginTop: '1.5rem',
            }}
          >
            System
          </div>
          <Link href="/" className="nav-item" id="nav-home">
            <Bell size={17} />
            Notifications
          </Link>
        </nav>

        {/* User Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <UserButton />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
              My Account
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Manage profile</div>
          </div>
          <LogOut size={15} color="var(--text-xmuted)" />
        </div>
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex !important;
          }

          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
