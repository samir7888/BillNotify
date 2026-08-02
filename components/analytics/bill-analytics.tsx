"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UtilityAccount {
  id: string;
  utilityType: "ELECTRICITY" | "WATER";
  providerName: string;
  customerName?: string;
  scNo: string;
  consumerId: string;
}

interface BillData {
  billMonth: string;
  amount: number;
  status?: string;
  detectedAt: string;
}

interface BillAnalyticsProps {
  userId: string;
}
export function BillAnalytics({ userId }: BillAnalyticsProps) {
  const [selectedAccount, setSelectedAccount] = useState<UtilityAccount | null>(
    null
  );
  const [accounts, setAccounts] = useState<UtilityAccount[]>([]);
  const [billData, setBillData] = useState<BillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBills, setLoadingBills] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/analytics/accounts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch accounts");
        }

        setAccounts(data.accounts || []);

        // Auto-select first account if available
        if (data.accounts && data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        } else {
          setSelectedAccount(null);
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load accounts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  // Fetch bill data when account changes
  useEffect(() => {
    const fetchBillData = async () => {
      if (!selectedAccount) {
        setBillData([]);
        return;
      }

      try {
        setLoadingBills(true);
        setError(null);

        const response = await fetch(
          `/api/analytics/bill-history?accountId=${selectedAccount.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch bill history");
        }

        setBillData(data.billHistory || []);
      } catch (err) {
        console.error("Error fetching bill data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load bill data"
        );
        setBillData([]);
      } finally {
        setLoadingBills(false);
      }
    };

    fetchBillData();
  }, [selectedAccount]);

  const formatBillData = (data: BillData[]) => {
    return data.map((bill) => ({
      ...bill,
      monthLabel: formatMonth(bill.billMonth),
      formattedAmount: `Rs ${bill.amount.toLocaleString()}`,
    }));
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  const calculateTrend = (data: BillData[]) => {
    if (data.length < 2) return { trend: "neutral", percentage: 0 };

    const recent = data[data.length - 1].amount;
    const previous = data[data.length - 2].amount;
    const percentage = ((recent - previous) / previous) * 100;

    if (percentage > 5)
      return { trend: "up", percentage: Math.round(percentage) };
    if (percentage < -5)
      return { trend: "down", percentage: Math.round(Math.abs(percentage)) };
    return { trend: "neutral", percentage: 0 };
  };

  const renderUtilityIcon = (
    type: "ELECTRICITY" | "WATER" | undefined,
    className: string
  ) => {
    if (type === "WATER") {
      return <Droplets className={className} />;
    }

    return <Zap className={className} />;
  };

  const getUtilityColor = (type: "ELECTRICITY" | "WATER") => {
    return type === "ELECTRICITY"
      ? "from-yellow-400 to-orange-500"
      : "from-blue-400 to-cyan-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded-lg"></div>
          <div className="h-96 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="h-24 w-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-slate-600 mb-6">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-linear-to-r from-red-500 to-red-600"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  if (accounts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="h-24 w-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <BarChart3 className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No Utility Accounts
        </h3>
        <p className="text-slate-600 mb-6">
          Add utility accounts to start tracking your bill analytics.
        </p>
        <Button asChild className="bg-linear-to-r from-blue-500 to-indigo-600">
          <a href="/dashboard">Add Account</a>
        </Button>
      </motion.div>
    );
  }

  const chartData = formatBillData(billData);
  const trend = calculateTrend(billData);
  const currentUtilityType = selectedAccount?.utilityType ?? "ELECTRICITY";
  const totalAmount = billData.reduce((sum, bill) => sum + bill.amount, 0);
  const averageAmount = billData.length > 0 ? totalAmount / billData.length : 0;
  return (
    <div className="space-y-6">
      {/* Account Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Select
          value={selectedAccount?.id ?? ""}
          onValueChange={(value) => {
            const account = accounts.find((item) => item.id === value) ?? null;
            setSelectedAccount(account);
          }}
        >
          <SelectTrigger className="w-full max-w-md h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
          <span>{selectedAccount?.customerName ?? "Select Account"}</span>
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => {
              return (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 bg-linear-to-r ${getUtilityColor(account.utilityType)} rounded-lg flex items-center justify-center`}
                    >
                      {renderUtilityIcon(account.utilityType, "h-4 w-4 text-white")}
                    </div>
                    <div>
                      <p className="font-medium">{account.providerName}</p>
                      <p className="text-xs text-slate-500">
                        {account.customerName}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </motion.div>{" "}
      {selectedAccount && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Current Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 bg-linear-to-r ${getUtilityColor(selectedAccount.utilityType)} rounded-lg flex items-center justify-center`}
                  >
                    {renderUtilityIcon(currentUtilityType, "h-5 w-5 text-white")}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      Rs{" "}
                      {billData[billData.length - 1]?.amount.toLocaleString() ||
                        0}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {trend.trend === "up" && (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      )}
                      {trend.trend === "down" && (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                      {trend.trend === "neutral" && (
                        <Minus className="h-3 w-3 text-slate-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${trend.trend === "up"
                            ? "text-red-600"
                            : trend.trend === "down"
                              ? "text-green-600"
                              : "text-slate-500"
                          }`}
                      >
                        {trend.percentage > 0
                          ? `${trend.percentage}%`
                          : "No change"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Average Bill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-slate-900">
                  Rs{" "}
                  {averageAmount.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {billData.length} months
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Provider</span>
                    <span className="text-xs font-medium">
                      {selectedAccount.providerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">SC No</span>
                    <span className="text-xs font-medium">
                      {selectedAccount.scNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Type</span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedAccount.utilityType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>{" "}
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="border-slate-200 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Bill Amount Trend
                  <Badge variant="outline" className="text-xs">
                    {chartData.length} months
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Track your {selectedAccount.utilityType.toLowerCase()} bill
                  amounts over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBills ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="monthLabel"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(value) =>
                            `Rs ${value.toLocaleString()}`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => {
                            const numericValue =
                              typeof value === "number"
                                ? value
                                : typeof value === "string"
                                  ? Number(value)
                                  : 0;

                            return [`Rs ${numericValue.toLocaleString()}`, "Amount"];
                          }}
                          labelStyle={{ color: "#64748b", fontSize: "12px" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke={
                            selectedAccount.utilityType === "ELECTRICITY"
                              ? "#f59e0b"
                              : "#0ea5e9"
                          }
                          strokeWidth={3}
                          dot={{
                            fill:
                              selectedAccount.utilityType === "ELECTRICITY"
                                ? "#f59e0b"
                                : "#0ea5e9",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                            stroke:
                              selectedAccount.utilityType === "ELECTRICITY"
                                ? "#f59e0b"
                                : "#0ea5e9",
                            strokeWidth: 2,
                            fill: "white",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">
                        No bill history found
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Bills will appear here once detected
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
