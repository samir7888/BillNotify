"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Trash2,
  RefreshCw,
  Zap,
  Droplets,
  User,
  Clock,
  CreditCard,
} from "lucide-react";
import {
  formatCurrency,
  formatRelativeTime,
  getStatusColor,
} from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Account {
  id: string;
  customerName: string | null;
  utilityType: string;
  consumerId: string;
  scNo: string;
  providerName: string;
  lastStatus: string | null;
  lastAmount: number | null;
  lastCheckedAt: string | null;
  lastBillMonth: string | null;
  active: boolean;
}

interface AccountsTableProps {
  accounts: Account[];
  onRefresh: () => void;
}

export function AccountsTable({ accounts, onRefresh }: AccountsTableProps) {
  console.log(accounts);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCheckNow(id: string) {
    setCheckingId(id);
    try {
      const res = await fetch(`/api/check-account/${id}`, { method: "POST" });
      const data = await res.json();
      console.log(data, "data");

      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Check failed. Please try again.");
      } else if (data.notified) {
        toast.success("✅ Bill is ready! Email notification sent.");
      } else if (data.result?.payableAmount > 0) {
        toast.info(
          `Bill found: NPR ${data.result.payableAmount?.toLocaleString()}. Already notified previously.`
        );
      } else {
        toast.success("Check complete. No payable bill found yet.");
      }

      onRefresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setCheckingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this account? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted.");
        onRefresh();
      } else {
        toast.error("Failed to delete account.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeletingId(null);
    }
  }

  if (accounts.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No accounts yet
          </h3>
          <p className="text-slate-600 text-center max-w-sm">
            Add your first NEA consumer ID to start receiving bill alerts and
            manage your utility payments effortlessly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {accounts.map((account) => {
        let displayStatus = account.lastStatus || "";
        if (account.lastAmount === 0) {
          displayStatus = "Paid";
        } else if (account.lastAmount && account.lastAmount > 0) {
          displayStatus = "Pending to Pay";
        }
        const statusColor = getStatusColor(displayStatus);
        const isChecking = checkingId === account.id;
        const isDeleting = deletingId === account.id;

        return (
          <Card
            key={account.id}
            className="group hover:shadow-md transition-all duration-200 border-slate-200 bg-white"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      account.utilityType === "ELECTRICITY"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {account.utilityType === "ELECTRICITY" ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Droplets className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      {account.customerName ?? "Unknown Customer"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {account.utilityType === "ELECTRICITY"
                        ? "Electricity"
                        : "Water"}{" "}
                      Account
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end gap-2">
                  {displayStatus ? (
                    <Badge
                      variant={
                        statusColor === "green"
                          ? "default"
                          : statusColor === "red"
                          ? "destructive"
                          : "secondary"
                      }
                      className="whitespace-nowrap"
                    >
                      {displayStatus.length > 20
                        ? displayStatus.substring(0, 20) + "…"
                        : displayStatus}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Checked</Badge>
                  )}

                  {/* Amount */}
                  {account.lastAmount !== null && (
                    <div className="text-right">
                      <span
                        className={`text-lg font-bold ${
                          account.lastAmount > 0
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {formatCurrency(account.lastAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Consumer ID */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Consumer ID
                  </label>
                  <code className="block px-2 py-1 bg-slate-100 rounded text-sm font-mono text-slate-800 border">
                    {account.consumerId}
                  </code>
                </div>

                {/* SC Number */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    SC Number
                  </label>
                  <code className="block px-2 py-1 bg-slate-100 rounded text-sm font-mono text-slate-800 border">
                    {account.scNo}
                  </code>
                </div>

                {/* Last Checked */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last Checked
                  </label>
                  <p className="text-sm text-slate-700">
                    {formatRelativeTime(account.lastCheckedAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCheckNow(account.id)}
                  disabled={isChecking || isDeleting}
                  className="flex-1"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isChecking ? "animate-spin" : ""
                    }`}
                  />
                  {isChecking ? "Checking…" : "Check Now"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(account.id)}
                  disabled={isChecking || isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "..." : ""}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
