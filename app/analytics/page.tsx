import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BillAnalytics } from "@/components/analytics/bill-analytics";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { requireAuth } from "@/lib/auth";

export default async function AnalyticsPage() {
  const userId = await requireAuth();

  return (
    <div className="flex-1 space-y-6 p-8">
      <AnalyticsHeader />
      <Suspense fallback={<div>Loading analytics...</div>}>
        <BillAnalytics userId={userId} />
      </Suspense>
    </div>
  );
}
