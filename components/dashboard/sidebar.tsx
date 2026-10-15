"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { LayoutDashboard, Settings, CreditCard, LogOut, Menu, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Upgrade", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close the drawer when the route changes on mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  // Close the drawer on outside click (mobile)
  useEffect(() => {
    if (!(isMobile && isOpen)) return;
    const close = () => setIsOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isOpen, isMobile]);

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="fixed left-4 top-4 z-50 border border-violet-200 bg-white"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-violet-950/50" onClick={() => setIsOpen(false)} />
      )}

      <aside
        onClick={(e) => e.stopPropagation()}
        className={`sidebar h-full w-64 border-r border-violet-100 bg-white transition-transform duration-200 ${
          isMobile ? "fixed left-0 top-0 z-50" : "relative"
        } ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-violet-100 px-5 py-5">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark size={34} />
              <span className="font-display text-lg font-bold tracking-tight text-ink">BillNotify</span>
            </Link>
          </div>

          <nav aria-label="Dashboard" className="flex-1 px-3 py-5">
            <div className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? "bg-violet-100 font-semibold text-ink before:absolute before:-left-3 before:bottom-1.5 before:top-1.5 before:w-1 before:rounded-r before:bg-violet-700"
                        : "text-violet-700 hover:bg-violet-50 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>

            <p className="mt-8 border-t border-violet-100 px-3 pt-5 text-sm leading-relaxed text-violet-700">
              Pro removes the account limit and checks every 2 hours instead of 6.
              <Link href="/pricing" className="mt-2 block font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">
                See plans
              </Link>
            </p>
          </nav>

          <div className="border-t border-violet-100 p-4">
            <div className="flex items-center gap-3">
              <UserButton />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">My account</p>
                <p className="text-xs text-violet-500">Manage profile</p>
              </div>
              <SignOutButton>
                <Button variant="ghost" size="icon" aria-label="Sign out" className="h-8 w-8 text-violet-500 hover:text-ink">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
