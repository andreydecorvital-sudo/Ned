import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LeadDetail from "./lead-detail";

export const metadata: Metadata = {
  title: "Detalhes do lead",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  return <LeadDetail leadId={id} />;
}
