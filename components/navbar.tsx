'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
    SignInButton,
    SignUpButton,
    UserButton,
} from '@clerk/nextjs'
import { Zap } from 'lucide-react'

export function Navbar() {
    const { user } = useUser()

    return (
        <nav
            style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 30,
            }}
        >
            <div
                className="container-page"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Zap size={18} color="white" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                        BillNotify <span style={{ color: 'var(--primary)' }}>Nepal</span>
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                        href="/pricing"
                        style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}
                    >
                        Pricing
                    </Link>

                    {!user ? (
                        <>
                            <SignInButton mode="modal">
                                {/* <button className="btn btn-outline btn-sm">Sign In</button> */}
                            </SignInButton>
                            <SignUpButton mode="modal">
                                {/* <button className="btn btn-primary btn-sm">Get Started Free</button> */}
                            </SignUpButton>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="btn btn-primary btn-sm">
                                Dashboard
                            </Link>
                            <UserButton />
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}