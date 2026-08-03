export const leadStatuses = [
  "novo",
  "em_contato",
  "reuniao",
  "proposta",
  "fechado",
  "perdido",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type LeadSource = "popup" | "rodape" | "pagina_servico" | "ned_lab" | string;

export type LeadRecord = {
  id: string;
  name: string;
  company: string;
  whatsapp: string;
  businessType: string;
  challenge: string;
  service: string;
  urgency: string;
  source: LeadSource;
  pagePath: string;
  pageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  status: LeadStatus;
  notes: string;
  lastContactAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type LeadFilters = {
  status?: string;
  service?: string;
  source?: string;
  search?: string;
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  reuniao: "Reunião",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const leadSourceLabels: Record<string, string> = {
  popup: "Pop-up",
  rodape: "Rodapé",
  pagina_servico: "Página de serviço",
  ned_lab: "NED LAB",
  diagnostico: "Diagnóstico",
  diagnostico_popup: "Pop-up",
};
