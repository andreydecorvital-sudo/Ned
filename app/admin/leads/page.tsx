import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/lead-store";
import LeadsDashboard from "./leads-dashboard";

export const metadata: Metadata = {
  title: "Painel de leads",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <LeadsDashboard databaseConfigured={isDatabaseConfigured()} />;
}
