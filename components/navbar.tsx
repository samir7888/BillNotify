'use client'

import Link from 'next/link'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { LogoMark } from '@/components/logo'

export function Navbar() {
  const { user } = useUser()

  return (
    <header className="border-b border-violet-100 bg-white/90 backdrop-blur sticky top-0 z-40">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="font-display text-lg font-bold tracking-tight text-ink">BillNotify</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/pricing" className="hidden rounded-md px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 sm:block">
            Pricing
          </Link>
          {!user ? (
            <>
              <SignInButton mode="modal">
                <button className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="whitespace-nowrap rounded-md bg-violet-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-violet-800">
                  Get started
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="rounded-md bg-violet-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-violet-800">
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
