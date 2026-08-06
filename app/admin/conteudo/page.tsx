import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getInstagramConnectionSummary } from "@/lib/instagram-oauth";
import ContentDashboard from "./content-dashboard";
import InstagramConnectionControl from "./instagram-connection-control";

export const metadata: Metadata = {
  title: "Agenda de conteúdo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const instagramConnection = await getInstagramConnectionSummary();

  return (
    <>
      <ContentDashboard />
      <InstagramConnectionControl initial={instagramConnection} />
    </>
  );
}
