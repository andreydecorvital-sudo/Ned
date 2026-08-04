import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

export const viralReviewVerdicts = ["approved", "revise", "rejected"] as const;
export type ViralReviewVerdict = (typeof viralReviewVerdicts)[number];

export type ViralReview = {
  id: string;
  ideaId: string | null;
  verdict: ViralReviewVerdict;
  tags: string[];
  note: string;
  createdAt: string;
};

export type ViralReviewSummary = {
  total: number;
  approved: number;
  revise: number;
  rejected: number;
  topTags: Array<{ tag: string; count: number }>;
  recent: ViralReview[];
};

type ReviewRow = {
  id: string;
  idea_id: string | null;
  verdict: ViralReviewVerdict;
  tags: string[] | string | null;
  note: string | null;
  created_at: string | Date;
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

export function isViralReviewDatabaseConfigured() {
  return Boolean(connectionString());
}

function database() {
  const value = connectionString();
  if (!value) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(value);
}

function parseTags(value: string[] | string | null) {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function mapReview(row: ReviewRow): ViralReview {
  return {
    id: row.id,
    ideaId: row.idea_id,
    verdict: row.verdict,
    tags: parseTags(row.tags),
    note: row.note ?? "",
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function ensureViralReviewSchema() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    const sql = database();
    await sql`
      CREATE TABLE IF NOT EXISTS ned_viral_reviews (
        id text PRIMARY KEY,
        idea_id text,
        verdict varchar(24) NOT NULL,
        tags jsonb NOT NULL DEFAULT '[]'::jsonb,
        note text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS ned_viral_reviews_created_idx
      ON ned_viral_reviews (created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS ned_viral_reviews_idea_idx
      ON ned_viral_reviews (idea_id, created_at DESC)
    `;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}

export async function saveViralReview(input: {
  ideaId: string | null;
  verdict: ViralReviewVerdict;
  tags: string[];
  note: string;
}) {
  await ensureViralReviewSchema();
  const sql = database();
  const rows = await sql`
    INSERT INTO ned_viral_reviews (id, idea_id, verdict, tags, note)
    VALUES (
      ${randomUUID()},
      ${input.ideaId || null},
      ${input.verdict},
      ${JSON.stringify(input.tags.slice(0, 8))}::jsonb,
      ${input.note.slice(0, 1200)}
    )
    RETURNING *
  `;
  return mapReview((rows as ReviewRow[])[0]);
}

export async function getViralReviewSummary(): Promise<ViralReviewSummary> {
  await ensureViralReviewSchema();
  const sql = database();
  const [countRows, tagRows, recentRows] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE verdict = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE verdict = 'revise')::int AS revise,
        COUNT(*) FILTER (WHERE verdict = 'rejected')::int AS rejected
      FROM ned_viral_reviews
    `,
    sql`
      SELECT item.tag, COUNT(*)::int AS count
      FROM ned_viral_reviews
      CROSS JOIN LATERAL jsonb_array_elements_text(tags) AS item(tag)
      GROUP BY item.tag
      ORDER BY count DESC, item.tag
      LIMIT 8
    `,
    sql`
      SELECT *
      FROM ned_viral_reviews
      ORDER BY created_at DESC
      LIMIT 12
    `,
  ]);

  const counts = (countRows as Array<{
    total: number | string;
    approved: number | string;
    revise: number | string;
    rejected: number | string;
  }>)[0];

  return {
    total: Number(counts?.total ?? 0),
    approved: Number(counts?.approved ?? 0),
    revise: Number(counts?.revise ?? 0),
    rejected: Number(counts?.rejected ?? 0),
    topTags: (tagRows as Array<{ tag: string; count: number | string }>).map((row) => ({
      tag: row.tag,
      count: Number(row.count),
    })),
    recent: (recentRows as ReviewRow[]).map(mapReview),
  };
}
