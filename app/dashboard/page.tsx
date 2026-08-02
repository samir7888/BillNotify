"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Users, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AccountsTable } from "@/components/dashboard/accounts-table";
import { AddAccountModal } from "@/components/dashboard/add-account-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Account {
  id: string;
  customerName: string | null;
  utilityType: string;
  scNo: string;
  consumerId: string;
  providerName: string;
  lastStatus: string | null;
  lastAmount: number | null;
  lastCheckedAt: string | null;
  lastBillMonth: string | null;
  active: boolean;
}

interface AccountsData {
  accounts: Account[];
  plan: string;
  totalCount: number;
}

function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-12 w-12 bg-slate-200 rounded-xl" />
        </div>
        <div className="mt-4 h-1.5 bg-slate-200 rounded-full" />
      </CardContent>
    </Card>
  );
}

function SkeletonTable() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-4 p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded flex-2" />
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-6 bg-slate-200 rounded-full w-16" />
              <div className="h-4 bg-slate-200 rounded w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<AccountsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccounts = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to load accounts");
      const json: AccountsData = await res.json();
      setData(json);
    } catch {
      if (!silent) toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchAccounts();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const accounts = data?.accounts ?? [];
  const plan = data?.plan ?? "FREE";

  const billsReady = accounts.filter(
    (a) => a.lastAmount != null && a.lastAmount > 0
  ).length;

  const activeAlerts = accounts.filter((a) => a.active).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-3 sm:space-y-4"
      >
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
            Manage your utility accounts and bill alerts with ease.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Badge
            variant={plan === "PRO" ? "default" : "secondary"}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm self-start ${
              plan === "PRO"
                ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {plan === "PRO" ? "⚡ Pro Plan" : "🆓 Free Plan"}
          </Badge>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAccounts(true)}
              disabled={refreshing}
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white shadow-sm text-sm"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 font-semibold text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <StatsCards
          totalAccounts={accounts.length}
          activeAlerts={activeAlerts}
          billsReady={billsReady}
          plan={plan}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Accounts Table - Takes up 3 columns on lg screens, full width on smaller */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1 sm:space-y-2">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 sm:gap-3 text-slate-900">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />
                    Utility Accounts
                  </CardTitle>
                  {!loading && (
                    <CardDescription className="text-sm sm:text-base text-slate-600">
                      {accounts.length} account
                      {accounts.length !== 1 ? "s" : ""} connected
                      {plan === "FREE" && (
                        <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                          {Math.max(0, 3 - accounts.length)} remaining on free
                          plan
                        </span>
                      )}
                    </CardDescription>
                  )}
                </div>

                {billsReady > 0 && (
                  <Badge className="bg-linear-to-r from-emerald-500 to-green-600 text-white px-3 py-1 text-xs sm:text-sm font-semibold self-start">
                    {billsReady} bill{billsReady !== 1 ? "s" : ""} ready
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <SkeletonTable />
              ) : (
                <AccountsTable
                  accounts={accounts}
                  onRefresh={() => fetchAccounts(true)}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes up 1 column on lg screens, full width on mobile */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Recent Activity Card */}
          {!loading && accounts.some((a) => a.lastCheckedAt) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-slate-200 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts
                    .filter((a) => a.lastCheckedAt)
                    .sort(
                      (x, y) =>
                        new Date(y.lastCheckedAt!).getTime() -
                        new Date(x.lastCheckedAt!).getTime()
                    )
                    .slice(0, 5)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {a.customerName ?? a.consumerId}
                          </p>
                          <p className="text-xs text-slate-500">
                            {a.lastCheckedAt
                              ? new Date(a.lastCheckedAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "—"}
                          </p>
                        </div>
                        {a.lastAmount != null && a.lastAmount > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                          >
                            NPR {a.lastAmount.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Pro Upgrade Card */}
          {!loading && plan === "FREE" && accounts.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        🚀 Upgrade to Pro
                      </h3>
                      <p className="text-violet-100 text-sm leading-relaxed">
                        Get unlimited accounts, priority 2-hour checks, and
                        future SMS/Telegram alerts.
                      </p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-white text-violet-600 hover:bg-slate-50 w-full shadow-sm"
                    >
                      <a href="/pricing">View Plans →</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchAccounts(true)}
        plan={plan}
        currentCount={accounts.length}
      />
    </div>
  );
}
