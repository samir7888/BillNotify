"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

export function AnalyticsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="h-12 w-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25"
        >
          <BarChart3 className="h-6 w-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bill Analytics</h1>
          <p className="text-slate-600">
            Track your utility bill trends over time
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-6 mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
      >
        <div className="flex items-center gap-2 text-blue-700">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Historical Trends</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-700">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Monthly Tracking</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
