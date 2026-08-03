import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getLeadDashboardStats,
  isDatabaseConfigured,
  listLeads,
} from "@/lib/lead-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "O banco de leads ainda não foi configurado." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);

  try {
    const [leads, stats] = await Promise.all([
      listLeads({
        status: url.searchParams.get("status") ?? "",
        service: url.searchParams.get("service") ?? "",
        source: url.searchParams.get("source") ?? "",
        priority: url.searchParams.get("priority") ?? "",
        attention: url.searchParams.get("attention") ?? "",
        search: url.searchParams.get("search") ?? "",
      }),
      getLeadDashboardStats(),
    ]);

    return NextResponse.json({
      leads,
      stats,
      options: {
        services: [...new Set(leads.map((lead) => lead.service))].sort(),
        sources: [...new Set(leads.map((lead) => lead.source))].sort(),
      },
    });
  } catch (error) {
    console.error("Failed to list NED leads", error);
    return NextResponse.json({ error: "Não foi possível carregar os leads." }, { status: 500 });
  }
}
