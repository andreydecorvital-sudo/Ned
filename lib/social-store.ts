import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import type {
  CreateSocialPostInput,
  SocialMediaAsset,
  SocialPostRecord,
  SocialStatus,
  UpdateSocialPostInput,
} from "@/lib/social-types";

type SocialPostRow = {
  id: string;
  account_name: string;
  format: SocialPostRecord["format"];
  caption: string;
  media: SocialMediaAsset[] | string;
  scheduled_at: string | Date | null;
  status: SocialStatus;
  share_to_feed: boolean;
  published_media_id: string | null;
  qstash_message_id: string | null;
  error_message: string | null;
  attempt_count: number | string;
  last_attempt_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
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

export function isSocialDatabaseConfigured() {
  return Boolean(connectionString());
}

function database() {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

function iso(value: string | Date | null) {
  return value ? new Date(value).toISOString() : null;
}

function parseMedia(value: SocialMediaAsset[] | string): SocialMediaAsset[] {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value) as SocialMediaAsset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapSocialPost(row: SocialPostRow): SocialPostRecord {
  return {
    id: row.id,
    accountName: row.account_name,
    format: row.format,
    caption: row.caption,
    media: parseMedia(row.media),
    scheduledAt: iso(row.scheduled_at),
    status: row.status,
    shareToFeed: Boolean(row.share_to_feed),
    publishedMediaId: row.published_media_id ?? "",
    qstashMessageId: row.qstash_message_id ?? "",
    errorMessage: row.error_message ?? "",
    attemptCount: Number(row.attempt_count ?? 0),
    lastAttemptAt: iso(row.last_attempt_at),
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date().toISOString(),
  };
}

export async function ensureSocialSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const sql = database();
    await sql`
      CREATE TABLE IF NOT EXISTS ned_social_posts (
        id text PRIMARY KEY,
        account_name varchar(120) NOT NULL DEFAULT 'NED Marketing',
        format varchar(24) NOT NULL,
        caption text NOT NULL DEFAULT '',
        media jsonb NOT NULL DEFAULT '[]'::jsonb,
        scheduled_at timestamptz,
        status varchar(24) NOT NULL DEFAULT 'draft',
        share_to_feed boolean NOT NULL DEFAULT true,
        published_media_id text,
        qstash_message_id text,
        error_message text NOT NULL DEFAULT '',
        attempt_count integer NOT NULL DEFAULT 0,
        last_attempt_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS ned_social_posts_schedule_idx
      ON ned_social_posts (status, scheduled_at)
    `;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

export async function listSocialPosts(limit = 120) {
  await ensureSocialSchema();
  const sql = database();
  const rows = await sql`
    SELECT *
    FROM ned_social_posts
    ORDER BY COALESCE(scheduled_at, created_at) DESC
    LIMIT ${Math.max(1, Math.min(limit, 300))}
  `;
  return (rows as SocialPostRow[]).map(mapSocialPost);
}

export async function getSocialPost(id: string) {
  await ensureSocialSchema();
  const sql = database();
  const rows = await sql`SELECT * FROM ned_social_posts WHERE id = ${id} LIMIT 1`;
  const row = (rows as SocialPostRow[])[0];
  return row ? mapSocialPost(row) : null;
}

export async function createSocialPost(input: CreateSocialPostInput) {
  await ensureSocialSchema();
  const sql = database();
  const id = randomUUID();
  const media = JSON.stringify(input.media);
  const rows = await sql`
    INSERT INTO ned_social_posts (
      id,
      account_name,
      format,
      caption,
      media,
      scheduled_at,
      status,
      share_to_feed
    ) VALUES (
      ${id},
      ${input.accountName},
      ${input.format},
      ${input.caption},
      ${media}::jsonb,
      ${input.scheduledAt},
      ${input.status},
      ${input.shareToFeed}
    )
    RETURNING *
  `;
  return mapSocialPost((rows as SocialPostRow[])[0]);
}

export async function updateSocialPost(id: string, input: UpdateSocialPostInput) {
  await ensureSocialSchema();
  const current = await getSocialPost(id);
  if (!current) return null;

  const next = {
    accountName: input.accountName ?? current.accountName,
    format: input.format ?? current.format,
    caption: input.caption ?? current.caption,
    media: input.media ?? current.media,
    scheduledAt: input.scheduledAt === undefined ? current.scheduledAt : input.scheduledAt,
    status: input.status ?? current.status,
    shareToFeed: input.shareToFeed ?? current.shareToFeed,
    qstashMessageId: input.qstashMessageId ?? current.qstashMessageId,
    errorMessage: input.errorMessage ?? current.errorMessage,
  };

  const sql = database();
  const media = JSON.stringify(next.media);
  const rows = await sql`
    UPDATE ned_social_posts
    SET
      account_name = ${next.accountName},
      format = ${next.format},
      caption = ${next.caption},
      media = ${media}::jsonb,
      scheduled_at = ${next.scheduledAt},
      status = ${next.status},
      share_to_feed = ${next.shareToFeed},
      qstash_message_id = ${next.qstashMessageId || null},
      error_message = ${next.errorMessage},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  const row = (rows as SocialPostRow[])[0];
  return row ? mapSocialPost(row) : null;
}

export async function deleteSocialPost(id: string) {
  await ensureSocialSchema();
  const sql = database();
  const rows = await sql`
    DELETE FROM ned_social_posts
    WHERE id = ${id} AND status <> 'publishing'
    RETURNING id
  `;
  return Boolean((rows as Array<{ id: string }>)[0]);
}

export async function claimSocialPost(id: string, includeDraft = false) {
  await ensureSocialSchema();
  const sql = database();
  const rows = includeDraft
    ? await sql`
        UPDATE ned_social_posts
        SET
          status = 'publishing',
          attempt_count = attempt_count + 1,
          last_attempt_at = now(),
          error_message = '',
          updated_at = now()
        WHERE id = ${id}
          AND status IN ('draft', 'scheduled', 'failed')
        RETURNING *
      `
    : await sql`
        UPDATE ned_social_posts
        SET
          status = 'publishing',
          attempt_count = attempt_count + 1,
          last_attempt_at = now(),
          error_message = '',
          updated_at = now()
        WHERE id = ${id}
          AND status IN ('scheduled', 'failed')
          AND (scheduled_at IS NULL OR scheduled_at <= now() + interval '2 minutes')
        RETURNING *
      `;
  const row = (rows as SocialPostRow[])[0];
  return row ? mapSocialPost(row) : null;
}

export async function markSocialPostPublished(id: string, publishedMediaId: string) {
  await ensureSocialSchema();
  const sql = database();
  const rows = await sql`
    UPDATE ned_social_posts
    SET
      status = 'published',
      published_media_id = ${publishedMediaId},
      qstash_message_id = NULL,
      error_message = '',
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  const row = (rows as SocialPostRow[])[0];
  return row ? mapSocialPost(row) : null;
}

export async function markSocialPostFailed(id: string, message: string) {
  await ensureSocialSchema();
  const sql = database();
  const rows = await sql`
    UPDATE ned_social_posts
    SET
      status = 'failed',
      error_message = ${message.slice(0, 1200)},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  const row = (rows as SocialPostRow[])[0];
  return row ? mapSocialPost(row) : null;
}
