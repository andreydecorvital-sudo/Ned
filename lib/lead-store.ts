import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import {
  leadStatuses,
  type LeadFilters,
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
  last_contact_at: string | Date | null;
  metadata: Record<string, unknown> | null;
  created_at: string | Date;
  updated_at: string | Date;
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
  if (!url) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }
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
    lastContactAt: iso(row.last_contact_at),
    metadata: row.metadata ?? {},
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date().toISOString(),
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

    await sql`CREATE INDEX IF NOT EXISTS ned_leads_created_at_idx ON ned_leads (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_status_idx ON ned_leads (status)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_service_idx ON ned_leads (service)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_source_idx ON ned_leads (source)`;
    await sql`CREATE INDEX IF NOT EXISTS ned_leads_whatsapp_idx ON ned_leads (whatsapp)`;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

export async function createLead(input: CreateLeadInput) {
  await ensureLeadSchema();
  const sql = database();
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  const metadata = JSON.stringify(input.metadata ?? {});

  const duplicateRows = (await sql`
    SELECT *
    FROM ned_leads
    WHERE whatsapp = ${whatsapp}
      AND created_at > now() - interval '10 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `) as unknown as LeadRow[];

  if (duplicateRows[0]) {
    const updatedRows = (await sql`
      UPDATE ned_leads
      SET
        name = ${input.name},
        company = ${input.company},
        business_type = ${input.businessType},
        challenge = ${input.challenge},
        service = ${input.service},
        urgency = ${input.urgency},
        source = ${input.source},
        page_path = ${input.pagePath},
        page_url = ${input.pageUrl ?? ""},
        referrer = ${input.referrer ?? ""},
        utm_source = ${input.utmSource ?? ""},
        utm_medium = ${input.utmMedium ?? ""},
        utm_campaign = ${input.utmCampaign ?? ""},
        utm_content = ${input.utmContent ?? ""},
        utm_term = ${input.utmTerm ?? ""},
        metadata = ${metadata}::jsonb,
        updated_at = now()
      WHERE id = ${duplicateRows[0].id}
      RETURNING *
    `) as unknown as LeadRow[];

    return { lead: mapLead(updatedRows[0]), deduplicated: true };
  }

  const id = randomUUID();
  const rows = (await sql`
    INSERT INTO ned_leads (
      id,
      name,
      company,
      whatsapp,
      business_type,
      challenge,
      service,
      urgency,
      source,
      page_path,
      page_url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      metadata
    ) VALUES (
      ${id},
      ${input.name},
      ${input.company},
      ${whatsapp},
      ${input.businessType},
      ${input.challenge},
      ${input.service},
      ${input.urgency},
      ${input.source},
      ${input.pagePath},
      ${input.pageUrl ?? ""},
      ${input.referrer ?? ""},
      ${input.utmSource ?? ""},
      ${input.utmMedium ?? ""},
      ${input.utmCampaign ?? ""},
      ${input.utmContent ?? ""},
      ${input.utmTerm ?? ""},
      ${metadata}::jsonb
    )
    RETURNING *
  `) as unknown as LeadRow[];

  return { lead: mapLead(rows[0]), deduplicated: false };
}

export async function listLeads(filters: LeadFilters = {}) {
  await ensureLeadSchema();
  const sql = database();
  const status = filters.status?.trim() ?? "";
  const service = filters.service?.trim() ?? "";
  const source = filters.source?.trim() ?? "";
  const search = filters.search?.trim().toLowerCase() ?? "";
  const searchLike = `%${search}%`;

  const rows = (await sql`
    SELECT *
    FROM ned_leads
    WHERE (${status} = '' OR status = ${status})
      AND (${service} = '' OR service = ${service})
      AND (${source} = '' OR source = ${source})
      AND (
        ${search} = ''
        OR lower(name) LIKE ${searchLike}
        OR lower(company) LIKE ${searchLike}
        OR lower(whatsapp) LIKE ${searchLike}
        OR lower(business_type) LIKE ${searchLike}
        OR lower(challenge) LIKE ${searchLike}
      )
    ORDER BY created_at DESC
    LIMIT 1000
  `) as unknown as LeadRow[];

  return rows.map(mapLead);
}

export async function updateLead(
  id: string,
  changes: { status?: LeadStatus; notes?: string; touchContact?: boolean },
) {
  await ensureLeadSchema();
  const sql = database();
  const status = changes.status ?? null;
  const notes = typeof changes.notes === "string" ? changes.notes.slice(0, 4000) : null;
  const touchContact = Boolean(changes.touchContact);

  const rows = (await sql`
    UPDATE ned_leads
    SET
      status = COALESCE(${status}, status),
      notes = COALESCE(${notes}, notes),
      last_contact_at = CASE WHEN ${touchContact} THEN now() ELSE last_contact_at END,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as LeadRow[];

  return rows[0] ? mapLead(rows[0]) : null;
}

export function isLeadStatus(value: string): value is LeadStatus {
  return leadStatuses.includes(value as LeadStatus);
}
