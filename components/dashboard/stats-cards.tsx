"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Bell,
  CheckCircle,
  Zap,
  TrendingUp,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardsProps {
  totalAccounts: number;
  activeAlerts: number;
  billsReady: number;
  plan: string;
}

export function StatsCards({
  totalAccounts,
  activeAlerts,
  billsReady,
  plan,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Accounts",
      value: totalAccounts,
      icon: Layers,
      theme: "indigo",
      description: "Connected utility accounts",
      trend: totalAccounts > 0 ? "positive" : "neutral",
    },
    {
      label: "Active Alerts",
      value: activeAlerts,
      icon: Bell,
      theme: "cyan",
      description: "Monitoring for new bills",
      trend: activeAlerts > 0 ? "positive" : "neutral",
    },
    {
      label: "Bills Ready",
      value: billsReady,
      icon: CheckCircle,
      theme: "emerald",
      description: "Pending payments found",
      trend: "positive",
    },
    {
      label: "Current Plan",
      value: plan === "PRO" ? "Pro" : "Free",
      icon: Zap,
      theme: plan === "PRO" ? "violet" : "slate",
      description: plan === "PRO" ? "Unlimited access" : "Up to 3 accounts",
      trend: "neutral",
      isText: true,
    },
  ];

  const getThemeClasses = (theme: string) => {
    const themes = {
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        icon: "bg-indigo-100 text-indigo-600",
        accent: "bg-linear-to-r from-indigo-500 to-indigo-600",
      },
      cyan: {
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        icon: "bg-cyan-100 text-cyan-600",
        accent: "bg-linear-to-r from-cyan-500 to-cyan-600",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        icon: "bg-emerald-100 text-emerald-600",
        accent: "bg-linear-to-r from-emerald-500 to-emerald-600",
      },
      violet: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        icon: "bg-violet-100 text-violet-600",
        accent: "bg-linear-to-r from-violet-500 to-violet-600",
      },
      slate: {
        bg: "bg-slate-50",
        text: "text-slate-700",
        icon: "bg-slate-100 text-slate-600",
        accent: "bg-linear-to-r from-slate-400 to-slate-500",
      },
    };
    return themes[theme as keyof typeof themes] || themes.slate;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const themeClasses = getThemeClasses(stat.theme);

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur-sm overflow-hidden">
              {/* Top accent */}
              <div className={`h-1 w-full ${themeClasses.accent}`} />

              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none">
                        {stat.value}
                      </span>
                      {stat.trend === "positive" && Number(stat.value) > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 text-xs"
                        >
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-2 sm:p-3 rounded-xl ${themeClasses.icon} shadow-sm`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {stat.description}
                </p>

                {/* Progress indicator for numeric values */}
                {!stat.isText && Number(stat.value) > 0 && (
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Usage</span>
                      <span className={themeClasses.text}>
                        {stat.label === "Total Accounts" && plan === "FREE"
                          ? `${stat.value}/3`
                          : "Active"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${themeClasses.accent}`}
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            stat.label === "Total Accounts" && plan === "FREE"
                              ? `${Math.min((Number(stat.value) / 3) * 100, 100)}%`
                              : Number(stat.value) > 0
                                ? "100%"
                                : "0%",
                        }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Special content for plan card */}
                {stat.isText && plan === "FREE" && (
                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Upgrade for unlimited accounts
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
