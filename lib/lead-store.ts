import { neon } from "@neondatabase/serverless";
import { createHash, randomUUID } from "node:crypto";
import {
  leadStatuses,
  type LeadActivityRecord,
  type LeadActivityType,
  type LeadDashboardStats,
  type LeadFilters,
  type LeadPriority,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/lead-types";

type LeadRow = {
  id: string;
  name: string;
  company: string;
  whatsapp: string;
  business_type: string;
  challenge: string;
  service: string;
  urgency: string;
  source: string;
  page_path: string;
  page_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  status: LeadStatus;
  notes: string | null;
  score: number | string;
  priority: LeadPriority;
  first_contact_at: string | Date | null;
  last_contact_at: string | Date | null;
  next_follow_up_at: string | Date | null;
  consent_version: string | null;
  consent_at: string | Date | null;
  metadata: Record<string, unknown> | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type ActivityRow = {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string | Date;
};

export type CreateLeadInput = {
  name: string;
  company: string;
  whatsapp: string;
  businessType: string;
  challenge: string;
  service: string;
  urgency: string;
  source: string;
  pagePath: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  consentVersion?: string;
  consentAt?: string;
  metadata?: Record<string, unknown>;
};

let schemaReady: Promise<void> | null = null;

function connectionString() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.NEON_DATABASE_URL ??
    ""
  ).trim();
}

export function isDatabaseConfigured() {
  return Boolean(connectionString());
}

function database() {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

export function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return digits.length >= 10 ? `55${digits}` : digits;
}

function iso(value: string | Date | null) {
  return value ? new Date(value).toISOString() : null;
}

function priorityFromScore(score: number): LeadPriority {
  if (score >= 65) return "quente";
  if (score >= 40) return "potencial";
  return "normal";
}

export function calculateLeadScore(input: CreateLeadInput) {
  let score = 10;
  const urgency = input.urgency.toLowerCase();
  const service = input.service.toLowerCase();
  const source = input.source.toLowerCase();

  if (urgency.includes("urgência")) score += 35;
  else if (urgency.includes("breve")) score += 25;
  else if (urgency.includes("melhorar")) score += 20;
  else score += 5;

  if (service.includes("automa")) score += 20;
  else if (service.includes("marketplace")) score += 18;
  else if (service.includes("site")) score += 15;
  else if (service.includes("tráfego")) score += 12;
  else score += 5;

  if (source.includes("pagina_servico")) score += 10;
  else if (source.includes("ned_lab")) score += 8;
  else if (source.includes("popup")) score += 6;

  if (input.challenge.length >= 120) score += 6;
  if (input.utmCampaign) score += 5;
  if (!input.company.toLowerCase().includes("autônomo")) score += 4;

  return Math.min(100, score);
}

function attentionFor(row: LeadRow) {
  const now = Date.now();
  const created = new Date(row.created_at).getTime();
  const updated = new Date(row.updated_at).getTime();
  const followUp = row.next_follow_up_at ? new Date(row.next_follow_up_at).getTime() : null;

  if (followUp && followUp <= now) {
    return { active: true, level: "high" as const, label: "Follow-up vencido" };
  }
  if (row.status === "novo" && !row.last_contact_at && now - created >= 2 * 60 * 60 * 1000) {
    return { active: true, level: "high" as const, label: "Novo há mais de 2h sem contato" };
  }
  if (row.status === "proposta" && now - updated >= 3 * 24 * 60 * 60 * 1000) {
    return { active: true, level: "medium" as const, label: "Proposta há mais de 3 dias sem avanço" };
  }
  if (row.status === "reuniao" && now - updated >= 2 * 24 * 60 * 60 * 1000) {
    return { active: true, level: "medium" as const, label: "Reunião sem próximo passo registrado" };
  }
  return { active: false, level: "none" as const, label: "" };
}

function mapLead(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    whatsapp: row.whatsapp,
    businessType: row.business_type,
    challenge: row.challenge,
    service: row.service,
    urgency: row.urgency,
    source: row.source,
    pagePath: row.page_path,
    pageUrl: row.page_url ?? "",
    referrer: row.referrer ?? "",
    utmSource: row.utm_source ?? "",
    utmMedium: row.utm_medium ?? "",
    utmCampaign: row.utm_campaign ?? "",
    utmContent: row.utm_content ?? "",
    utmTerm: row.utm_term ?? "",
    status: row.status,
    notes: row.notes ?? "",
    score: Number(row.score ?? 0),
    priority: row.priority ?? "normal",
    firstContactAt: iso(row.first_contact_at),
    lastContactAt: iso(row.last_contact_at),
    nextFollowUpAt: iso(row.next_follow_up_at),
    consentVersion: row.consent_version ?? "",
    consentAt: iso(row.consent_at),
    metadata: row.metadata ?? {},
    attention: attentionFor(row),
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date().toISOString(),
  };
}

function mapActivity(row: ActivityRow): LeadActivityRecord {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    description: row.description,
    metadata: row.metadata ?? {},
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
  };
}

export async function ensureLeadSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const sql = database();

    await sql`
      CREATE TABLE IF NOT EXISTS ned_leads (
        id text PRIMARY KEY,
        name varchar(120) NOT NULL,
        company varchar(160) NOT NULL,
        whatsapp varchar(32) NOT NULL,
        business_type text NOT NULL,
        challenge text NOT NULL,
        service varchar(100) NOT NULL,
        urgency varchar(100) NOT NULL,
        source varchar(80) NOT NULL,
        page_path text NOT NULL,
        page_url text,
        referrer text,
        utm_source text,
        utm_medium text,
        utm_campaign text,
        utm_content text,
        utm_term text,
        status varchar(32) NOT NULL DEFAULT 'novo',
        notes text NOT NULL DEFAULT '',
        last_contact_at timestamptz,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS score smallint NOT NULL DEFAULT 0`;
    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS priority varchar(20) NOT NULL DEFAULT 'normal'`;
    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS first_contact_at timestamptz`;
    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz`;
    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS consent_version varchar(40) NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_leads ADD COLUMN IF NOT EXISTS consent_at timestamptz`;

    await sql`
      CREATE TABLE IF NOT EXISTS ned_lead_activities (
        id text PRIMARY KEY,
        lead_id text NOT NULL REFERENCES ned_leads(id) ON DELETE CASCADE,
        type varchar(50) NOT NULL,
        description text NOT NULL,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ned_lead_submissions (
        id text PRIMARY KEY,
        fingerprint_hash varchar(64) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS ned_leads_created_at_idx ON ned_leads (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_status_idx ON ned_leads (status)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_service_idx ON ned_leads (service)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_source_idx ON ned_leads (source)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_priority_idx ON ned_leads (priority)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_follow_up_idx ON ned_leads (next_follow_up_at)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_whatsapp_idx ON ned_leads (whatsapp)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_lead_activities_lead_idx ON ned_lead_activities (lead_id, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_lead_submissions_fingerprint_idx ON ned_lead_submissions (fingerprint_hash, created_at DESC)`;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

async function addActivity(
  leadId: string,
  type: LeadActivityType,
  description: string,
  metadata: Record<string, unknown> = {},
) {
  const sql = database();
  await sql`
    INSERT INTO ned_lead_activities (id, lead_id, type, description, metadata)
    VALUES (${randomUUID()}, ${leadId}, ${type}, ${description}, ${JSON.stringify(metadata)}::jsonb)
  `;
}

export async function registerLeadAttempt(fingerprint: string) {
  await ensureLeadSchema();
  const sql = database();
  const hash = createHash("sha256")
    .update(`ned-lead-rate-limit:v1\0${fingerprint}`)
    .digest("hex");

  await sql`DELETE FROM ned_lead_submissions WHERE created_at < now() - interval '2 days'`;
  const rows = (await sql`
    SELECT count(*)::int AS attempts
    FROM ned_lead_submissions
    WHERE fingerprint_hash = ${hash}
      AND created_at > now() - interval '15 minutes'
  `) as unknown as Array<{ attempts: number | string }>;

  const attempts = Number(rows[0]?.attempts ?? 0);
  if (attempts >= 5) return { allowed: false, retryAfterSeconds: 900 };

  await sql`
    INSERT INTO ned_lead_submissions (id, fingerprint_hash)
    VALUES (${randomUUID()}, ${hash})
  `;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function createLead(input: CreateLeadInput) {
  await ensureLeadSchema();
  const sql = database();
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  const metadata = JSON.stringify(input.metadata ?? {});
  const score = calculateLeadScore(input);
  const priority = priorityFromScore(score);
  const consentVersion = input.consentVersion ?? "diagnostico-2026-08";
  const consentAt = input.consentAt ?? new Date().toISOString();

  const duplicateRows = (await sql`
    SELECT * FROM ned_leads
    WHERE whatsapp = ${whatsapp}
      AND created_at > now() - interval '10 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `) as unknown as LeadRow[];

  if (duplicateRows[0]) {
    const updatedRows = (await sql`
      UPDATE ned_leads SET
        name = ${input.name}, company = ${input.company}, business_type = ${input.businessType},
        challenge = ${input.challenge}, service = ${input.service}, urgency = ${input.urgency},
        source = ${input.source}, page_path = ${input.pagePath}, page_url = ${input.pageUrl ?? ""},
        referrer = ${input.referrer ?? ""}, utm_source = ${input.utmSource ?? ""},
        utm_medium = ${input.utmMedium ?? ""}, utm_campaign = ${input.utmCampaign ?? ""},
        utm_content = ${input.utmContent ?? ""}, utm_term = ${input.utmTerm ?? ""},
        score = ${score}, priority = ${priority}, consent_version = ${consentVersion},
        consent_at = ${consentAt}::timestamptz, metadata = ${metadata}::jsonb, updated_at = now()
      WHERE id = ${duplicateRows[0].id}
      RETURNING *
    `) as unknown as LeadRow[];
    await addActivity(updatedRows[0].id, "updated", "Diagnóstico reenviado e dados atualizados.", { source: input.source });
    return { lead: mapLead(updatedRows[0]), deduplicated: true };
  }

  const id = randomUUID();
  const rows = (await sql`
    INSERT INTO ned_leads (
      id, name, company, whatsapp, business_type, challenge, service, urgency, source,
      page_path, page_url, referrer, utm_source, utm_medium, utm_campaign, utm_content,
      utm_term, score, priority, consent_version, consent_at, metadata
    ) VALUES (
      ${id}, ${input.name}, ${input.company}, ${whatsapp}, ${input.businessType},
      ${input.challenge}, ${input.service}, ${input.urgency}, ${input.source}, ${input.pagePath},
      ${input.pageUrl ?? ""}, ${input.referrer ?? ""}, ${input.utmSource ?? ""},
      ${input.utmMedium ?? ""}, ${input.utmCampaign ?? ""}, ${input.utmContent ?? ""},
      ${input.utmTerm ?? ""}, ${score}, ${priority}, ${consentVersion},
      ${consentAt}::timestamptz, ${metadata}::jsonb
    ) RETURNING *
  `) as unknown as LeadRow[];

  await addActivity(id, "created", "Lead criado pelo diagnóstico.", {
    source: input.source,
    score,
    priority,
  });
  return { lead: mapLead(rows[0]), deduplicated: false };
}

export async function listLeads(filters: LeadFilters = {}) {
  await ensureLeadSchema();
  const sql = database();
  const status = filters.status?.trim() ?? "";
  const service = filters.service?.trim() ?? "";
  const source = filters.source?.trim() ?? "";
  const priority = filters.priority?.trim() ?? "";
  const search = filters.search?.trim().toLowerCase() ?? "";
  const searchLike = `%${search}%`;

  const rows = (await sql`
    SELECT * FROM ned_leads
    WHERE (${status} = '' OR status = ${status})
      AND (${service} = '' OR service = ${service})
      AND (${source} = '' OR source = ${source})
      AND (${priority} = '' OR priority = ${priority})
      AND (
        ${search} = '' OR lower(name) LIKE ${searchLike} OR lower(company) LIKE ${searchLike}
        OR lower(whatsapp) LIKE ${searchLike} OR lower(business_type) LIKE ${searchLike}
        OR lower(challenge) LIKE ${searchLike}
      )
    ORDER BY created_at DESC
    LIMIT 1000
  `) as unknown as LeadRow[];

  const mapped = rows.map(mapLead);
  if (filters.attention === "pending") return mapped.filter((lead) => lead.attention.active);
  return mapped;
}

export async function getLead(id: string) {
  await ensureLeadSchema();
  const sql = database();
  const rows = (await sql`SELECT * FROM ned_leads WHERE id = ${id} LIMIT 1`) as unknown as LeadRow[];
  return rows[0] ? mapLead(rows[0]) : null;
}

export async function listLeadActivities(id: string) {
  await ensureLeadSchema();
  const sql = database();
  const rows = (await sql`
    SELECT * FROM ned_lead_activities
    WHERE lead_id = ${id}
    ORDER BY created_at DESC
    LIMIT 250
  `) as unknown as ActivityRow[];
  return rows.map(mapActivity);
}

export async function getLeadDashboardStats(): Promise<LeadDashboardStats> {
  await ensureLeadSchema();
  const sql = database();
  const rows = (await sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo')::int AS today,
      count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS last_seven_days,
      count(*) FILTER (WHERE status = 'novo' AND last_contact_at IS NULL)::int AS unattended,
      count(*) FILTER (WHERE priority = 'quente')::int AS hot,
      count(*) FILTER (WHERE status = 'reuniao')::int AS meetings,
      count(*) FILTER (WHERE status = 'proposta')::int AS proposals,
      count(*) FILTER (WHERE status = 'fechado')::int AS closed,
      count(*) FILTER (
        WHERE (next_follow_up_at IS NOT NULL AND next_follow_up_at <= now())
          OR (status = 'novo' AND last_contact_at IS NULL AND created_at <= now() - interval '2 hours')
          OR (status = 'proposta' AND updated_at <= now() - interval '3 days')
          OR (status = 'reuniao' AND updated_at <= now() - interval '2 days')
      )::int AS follow_ups_due,
      avg(extract(epoch from (first_contact_at - created_at)) / 60)
        FILTER (WHERE first_contact_at IS NOT NULL) AS average_first_contact_minutes
    FROM ned_leads
  `) as unknown as Array<Record<string, number | string | null>>;

  const row = rows[0] ?? {};
  const total = Number(row.total ?? 0);
  const closed = Number(row.closed ?? 0);
  return {
    total,
    today: Number(row.today ?? 0),
    lastSevenDays: Number(row.last_seven_days ?? 0),
    unattended: Number(row.unattended ?? 0),
    hot: Number(row.hot ?? 0),
    meetings: Number(row.meetings ?? 0),
    proposals: Number(row.proposals ?? 0),
    closed,
    followUpsDue: Number(row.follow_ups_due ?? 0),
    averageFirstContactMinutes:
      row.average_first_contact_minutes === null || row.average_first_contact_minutes === undefined
        ? null
        : Math.round(Number(row.average_first_contact_minutes)),
    conversionRate: total ? Math.round((closed / total) * 1000) / 10 : 0,
  };
}

export async function updateLead(
  id: string,
  changes: {
    status?: LeadStatus;
    notes?: string;
    touchContact?: boolean;
    nextFollowUpAt?: string | null;
  },
) {
  await ensureLeadSchema();
  const sql = database();
  const before = await getLead(id);
  if (!before) return null;

  const status = changes.status ?? null;
  const notes = typeof changes.notes === "string" ? changes.notes.slice(0, 4000) : null;
  const touchContact = Boolean(changes.touchContact);
  const hasFollowUp = Object.prototype.hasOwnProperty.call(changes, "nextFollowUpAt");
  const followUp = changes.nextFollowUpAt || null;

  const rows = (await sql`
    UPDATE ned_leads SET
      status = COALESCE(${status}, status),
      notes = COALESCE(${notes}, notes),
      first_contact_at = CASE WHEN ${touchContact} AND first_contact_at IS NULL THEN now() ELSE first_contact_at END,
      last_contact_at = CASE WHEN ${touchContact} THEN now() ELSE last_contact_at END,
      next_follow_up_at = CASE WHEN ${hasFollowUp} THEN ${followUp}::timestamptz ELSE next_follow_up_at END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as LeadRow[];

  const lead = rows[0] ? mapLead(rows[0]) : null;
  if (!lead) return null;

  if (changes.status && changes.status !== before.status) {
    await addActivity(id, "status_changed", `Status alterado de ${before.status} para ${changes.status}.`, {
      previous: before.status,
      current: changes.status,
    });
  }
  if (notes !== null && notes !== before.notes) {
    await addActivity(id, "note_updated", "Observações do atendimento atualizadas.");
  }
  if (touchContact) {
    await addActivity(id, "contact_registered", "Contato com o lead registrado.");
  }
  if (hasFollowUp) {
    await addActivity(
      id,
      "follow_up_scheduled",
      followUp ? "Próximo follow-up agendado." : "Agendamento de follow-up removido.",
      { nextFollowUpAt: followUp },
    );
  }

  return lead;
}

export async function deleteLead(id: string) {
  await ensureLeadSchema();
  const sql = database();
  const rows = (await sql`DELETE FROM ned_leads WHERE id = ${id} RETURNING id`) as unknown as Array<{ id: string }>;
  return Boolean(rows[0]);
}

export function isLeadStatus(value: string): value is LeadStatus {
  return leadStatuses.includes(value as LeadStatus);
}
