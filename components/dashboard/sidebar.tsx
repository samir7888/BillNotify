"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  Zap,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {/* Sidebar Backdrop - Mobile Only */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : "-100%") : 0,
        }}
        className={`sidebar ${
          isMobile ? "fixed top-0 left-0 z-50 shadow-xl" : "relative z-auto"
        } h-full w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="h-11 w-11 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300"
              >
                <Zap className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 group-hover:text-violet-600 transition-colors duration-200">
                  BillNotify
                </span>
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                  Nepal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Menu
              </p>
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <motion.div
                    key={href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group
                        ${
                          isActive
                            ? "bg-linear-to-r from-violet-50 to-purple-50 text-violet-700 shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-linear-to-b from-violet-500 to-purple-600 rounded-r-full"
                        />
                      )}

                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-violet-600" : ""
                        }`}
                      />
                      {label}

                      {label === "Upgrade" && (
                        <Badge className="ml-auto bg-linear-to-r from-violet-500 to-purple-600 text-white text-xs">
                          Pro
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Feature highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-linear-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-semibold text-violet-900">
                  Pro Features
                </span>
              </div>
              <p className="text-xs text-violet-700 leading-relaxed mb-3">
                Unlimited accounts, priority 2-hour checks, and future SMS
                alerts.
              </p>
              <Button
                asChild
                size="sm"
                className="w-full bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
              >
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
            </motion.div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
              <UserButton />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  My Account
                </p>
                <p className="text-xs text-slate-500">Manage profile</p>
              </div>
              <SignOutButton>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-slate-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
