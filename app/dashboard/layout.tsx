import { Sidebar } from "@/components/dashboard/sidebar";
import { getOrCreateProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getOrCreateProfile();
  if (!profile) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
