export const leadStatuses = [
  "novo",
  "em_contato",
  "reuniao",
  "proposta",
  "fechado",
  "perdido",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const leadPriorities = ["quente", "potencial", "normal"] as const;
export type LeadPriority = (typeof leadPriorities)[number];

export type LeadSource = "popup" | "rodape" | "pagina_servico" | "ned_lab" | string;

export type LeadAttention = {
  active: boolean;
  level: "high" | "medium" | "none";
  label: string;
};

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
  score: number;
  priority: LeadPriority;
  firstContactAt: string | null;
  lastContactAt: string | null;
  nextFollowUpAt: string | null;
  consentVersion: string;
  consentAt: string | null;
  metadata: Record<string, unknown>;
  attention: LeadAttention;
  createdAt: string;
  updatedAt: string;
};

export type LeadActivityType =
  | "created"
  | "updated"
  | "status_changed"
  | "note_updated"
  | "contact_registered"
  | "follow_up_scheduled";

export type LeadActivityRecord = {
  id: string;
  leadId: string;
  type: LeadActivityType;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type LeadFilters = {
  status?: string;
  service?: string;
  source?: string;
  priority?: string;
  attention?: string;
  search?: string;
};

export type LeadDashboardStats = {
  total: number;
  today: number;
  lastSevenDays: number;
  unattended: number;
  hot: number;
  meetings: number;
  proposals: number;
  closed: number;
  followUpsDue: number;
  averageFirstContactMinutes: number | null;
  conversionRate: number;
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  reuniao: "Reunião",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const leadPriorityLabels: Record<LeadPriority, string> = {
  quente: "Quente",
  potencial: "Potencial",
  normal: "Normal",
};

export const leadSourceLabels: Record<string, string> = {
  popup: "Pop-up",
  rodape: "Rodapé",
  pagina_servico: "Página de serviço",
  ned_lab: "NED LAB",
  diagnostico: "Diagnóstico",
  diagnostico_popup: "Pop-up",
  analise_gratuita: "Análise gratuita",
  ned_score: "NED Score",
  maquina_clientes: "Máquina de Clientes",
  parceiros: "Programa de parceiros",
};
