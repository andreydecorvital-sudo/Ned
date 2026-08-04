import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import ViralDashboard from "./viral-dashboard";

export const metadata: Metadata = {
  title: "NED Viral Machine",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ViralMachinePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <ViralDashboard />;
}
