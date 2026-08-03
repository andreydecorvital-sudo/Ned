import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeads } from "@/lib/lead-store";
import {
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
} from "@/lib/lead-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return new Response("Não autorizado.", { status: 401 });
  }

  const url = new URL(request.url);
  const leads = await listLeads({
    status: url.searchParams.get("status") ?? "",
    service: url.searchParams.get("service") ?? "",
    source: url.searchParams.get("source") ?? "",
    priority: url.searchParams.get("priority") ?? "",
    attention: url.searchParams.get("attention") ?? "",
    search: url.searchParams.get("search") ?? "",
  });

  const headers = [
    "Data",
    "Nome",
    "Empresa",
    "WhatsApp",
    "Tipo de negócio",
    "Principal desafio",
    "Serviço",
    "Urgência",
    "Prioridade",
    "Score",
    "Pendência",
    "Origem",
    "Página",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "Status",
    "Observações",
    "Primeiro contato",
    "Último contato",
    "Próximo follow-up",
    "Versão do consentimento",
    "Data do consentimento",
  ];

  const rows = leads.map((lead) => [
    lead.createdAt,
    lead.name,
    lead.company,
    lead.whatsapp,
    lead.businessType,
    lead.challenge,
    lead.service,
    lead.urgency,
    leadPriorityLabels[lead.priority],
    lead.score,
    lead.attention.label,
    leadSourceLabels[lead.source] ?? lead.source,
    lead.pagePath,
    lead.utmSource,
    lead.utmMedium,
    lead.utmCampaign,
    leadStatusLabels[lead.status],
    lead.notes,
    lead.firstContactAt ?? "",
    lead.lastContactAt ?? "",
    lead.nextFollowUpAt ?? "",
    lead.consentVersion,
    lead.consentAt ?? "",
  ]);

  const csv = `\uFEFF${[headers, ...rows]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n")}`;

  const fileDate = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ned-leads-${fileDate}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
