import { NextResponse } from "next/server";
import {
  createLead,
  isDatabaseConfigured,
  normalizeWhatsapp,
  type CreateLeadInput,
} from "@/lib/lead-store";

export const runtime = "nodejs";

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function metadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  try {
    const serialized = JSON.stringify(value);
    return serialized.length <= 4000 ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "O banco de leads ainda não foi configurado." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (text(body.website, 120)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { error: "É necessário autorizar o contato para enviar o diagnóstico." },
      { status: 400 },
    );
  }

  const input: CreateLeadInput = {
    name: text(body.name, 120),
    company: text(body.company, 160),
    whatsapp: normalizeWhatsapp(text(body.whatsapp, 32)),
    businessType: text(body.businessType, 300),
    challenge: text(body.challenge, 1000),
    service: text(body.service, 100),
    urgency: text(body.urgency, 100),
    source: text(body.source, 80) || "diagnostico",
    pagePath: text(body.pagePath, 500) || "/",
    pageUrl: text(body.pageUrl, 1000),
    referrer: text(body.referrer, 1000),
    utmSource: text(body.utmSource, 200),
    utmMedium: text(body.utmMedium, 200),
    utmCampaign: text(body.utmCampaign, 200),
    utmContent: text(body.utmContent, 200),
    utmTerm: text(body.utmTerm, 200),
    metadata: metadata(body.metadata),
  };

  const required = [
    input.name,
    input.company,
    input.whatsapp,
    input.businessType,
    input.challenge,
    input.service,
    input.urgency,
  ];

  if (required.some((value) => !value)) {
    return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
  }

  if (input.name.length < 2 || input.company.length < 2) {
    return NextResponse.json({ error: "Informe seu nome e sua empresa." }, { status: 400 });
  }

  if (input.whatsapp.length < 12 || input.whatsapp.length > 13) {
    return NextResponse.json({ error: "Informe um WhatsApp válido com DDD." }, { status: 400 });
  }

  try {
    const result = await createLead(input);
    return NextResponse.json({
      ok: true,
      id: result.lead.id,
      deduplicated: result.deduplicated,
    });
  } catch (error) {
    console.error("Failed to store NED lead", error);
    return NextResponse.json(
      { error: "Não foi possível registrar o contato agora." },
      { status: 500 },
    );
  }
}
