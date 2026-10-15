interface StatsCardsProps {
  totalAccounts: number;
  activeAlerts: number;
  billsReady: number;
  plan: string;
}

/** One strip, led by the number that needs action: bills ready to pay. */
export function StatsCards({ totalAccounts, activeAlerts, billsReady, plan }: StatsCardsProps) {
  const secondary = [
    { label: "Accounts", value: totalAccounts, note: "connected" },
    { label: "Monitoring", value: activeAlerts, note: "alerts on" },
    { label: "Plan", value: plan === "PRO" ? "Pro" : "Free", note: plan === "PRO" ? "no account limit" : "up to 3 accounts" },
  ];

  return (
    <section
      aria-label="Account summary"
      className="mb-6 grid divide-y divide-violet-100 overflow-hidden rounded-lg border border-violet-200 bg-white sm:mb-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:divide-x lg:divide-y-0"
    >
      <div className={`p-5 lg:p-6 ${billsReady > 0 ? "border-l-4 border-l-signal" : ""}`}>
        <div className="text-sm font-medium text-violet-500">Bills ready to pay</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold tracking-tight text-ink">{billsReady}</span>
          <span className="text-sm text-violet-700">{billsReady > 0 ? "pay in eSewa or Khalti" : "nothing due right now"}</span>
        </div>
      </div>
      {secondary.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-4 px-5 py-3.5 lg:block lg:p-6">
          <div className="text-sm font-medium text-violet-500">{s.label}</div>
          <div className="font-display text-xl font-bold tracking-tight text-ink lg:mt-1 lg:text-3xl">{s.value}</div>
          <div className="hidden text-sm text-violet-500 lg:mt-1 lg:block">{s.note}</div>
        </div>
      ))}
    </section>
  );
}
