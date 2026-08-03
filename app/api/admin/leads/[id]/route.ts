import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteLead,
  getLead,
  isLeadStatus,
  listLeadActivities,
  updateLead,
} from "@/lib/lead-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function authorized() {
  return isAdminAuthenticated();
}

export async function GET(_: Request, { params }: RouteContext) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const [lead, activities] = await Promise.all([getLead(id), listLeadActivities(id)]);
    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error("Failed to load NED lead", error);
    return NextResponse.json({ error: "Não foi possível carregar o lead." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await authorized())) {
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
  const hasFollowUp = Object.prototype.hasOwnProperty.call(body, "nextFollowUpAt");
  const rawFollowUp = body.nextFollowUpAt;

  if (rawStatus !== undefined && !isLeadStatus(rawStatus)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  let nextFollowUpAt: string | null | undefined;
  if (hasFollowUp) {
    if (rawFollowUp === null || rawFollowUp === "") {
      nextFollowUpAt = null;
    } else if (typeof rawFollowUp === "string" && !Number.isNaN(Date.parse(rawFollowUp))) {
      nextFollowUpAt = new Date(rawFollowUp).toISOString();
    } else {
      return NextResponse.json({ error: "Data de follow-up inválida." }, { status: 400 });
    }
  }

  const status = rawStatus !== undefined && isLeadStatus(rawStatus) ? rawStatus : undefined;

  try {
    const lead = await updateLead(id, { status, notes, touchContact, nextFollowUpAt });
    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }
    const activities = await listLeadActivities(id);
    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error("Failed to update NED lead", error);
    return NextResponse.json({ error: "Não foi possível atualizar o lead." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const deleted = await deleteLead(id);
    if (!deleted) {
      return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete NED lead", error);
    return NextResponse.json({ error: "Não foi possível excluir o lead." }, { status: 500 });
  }
}
