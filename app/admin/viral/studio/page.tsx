import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import StudioTransfer from "./studio-transfer";

export const metadata: Metadata = {
  title: "Finalizar conteúdo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ViralStudioPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <StudioTransfer />;
}
