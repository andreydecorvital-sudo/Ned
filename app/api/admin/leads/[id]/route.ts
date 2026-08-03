import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isLeadStatus, updateLead } from "@/lib/lead-store";
import type { LeadStatus } from "@/lib/lead-types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const rawStatus = typeof body.status === "string" ? body.status : undefined;
  const notes = typeof body.notes === "string" ? body.notes : undefined;
  const touchContact = body.touchContact === true;

  if (rawStatus && !isLeadStatus(rawStatus)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const status: LeadStatus | undefined = rawStatus;

  try {
    const lead = await updateLead(id, { status, notes, touchContact });
    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Failed to update NED lead", error);
    return NextResponse.json({ error: "Não foi possível atualizar o lead." }, { status: 500 });
  }
}
