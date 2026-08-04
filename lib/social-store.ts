import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import type {
  CreateSocialPostInput,
  SocialAudioSelection,
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
  audio: SocialAudioSelection | string | null;
  audio_name: string | null;
  cover_url: string | null;
  collaborators: string[] | string | null;
  first_comment: string | null;
  location_id: string | null;
  alt_text: string | null;
  is_ai_generated: boolean | null;
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

function parseJson<T>(value: T | string | null, fallback: T): T {
  if (value === null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseMedia(value: SocialMediaAsset[] | string): SocialMediaAsset[] {
  const parsed = parseJson(value, [] as SocialMediaAsset[]);
  return Array.isArray(parsed) ? parsed : [];
}

function parseCollaborators(value: string[] | string | null): string[] {
  const parsed = parseJson(value, [] as string[]);
  return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
}

function parseAudio(value: SocialAudioSelection | string | null): SocialAudioSelection | null {
  const parsed = parseJson(value, null as SocialAudioSelection | null);
  if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") return null;
  return parsed;
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
    audio: parseAudio(row.audio),
    audioName: row.audio_name ?? "",
    coverUrl: row.cover_url ?? "",
    collaborators: parseCollaborators(row.collaborators),
    firstComment: row.first_comment ?? "",
    locationId: row.location_id ?? "",
    altText: row.alt_text ?? "",
    isAiGenerated: Boolean(row.is_ai_generated),
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
        audio jsonb,
        audio_name text NOT NULL DEFAULT '',
        cover_url text NOT NULL DEFAULT '',
        collaborators jsonb NOT NULL DEFAULT '[]'::jsonb,
        first_comment text NOT NULL DEFAULT '',
        location_id text NOT NULL DEFAULT '',
        alt_text text NOT NULL DEFAULT '',
        is_ai_generated boolean NOT NULL DEFAULT false,
        published_media_id text,
        qstash_message_id text,
        error_message text NOT NULL DEFAULT '',
        attempt_count integer NOT NULL DEFAULT 0,
        last_attempt_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS audio jsonb`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS audio_name text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS cover_url text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS collaborators jsonb NOT NULL DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS first_comment text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS location_id text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS alt_text text NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE ned_social_posts ADD COLUMN IF NOT EXISTS is_ai_generated boolean NOT NULL DEFAULT false`;
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
  const audio = input.audio ? JSON.stringify(input.audio) : null;
  const collaborators = JSON.stringify(input.collaborators);
  const rows = await sql`
    INSERT INTO ned_social_posts (
      id,
      account_name,
      format,
      caption,
      media,
      scheduled_at,
      status,
      share_to_feed,
      audio,
      audio_name,
      cover_url,
      collaborators,
      first_comment,
      location_id,
      alt_text,
      is_ai_generated
    ) VALUES (
      ${id},
      ${input.accountName},
      ${input.format},
      ${input.caption},
      ${media}::jsonb,
      ${input.scheduledAt},
      ${input.status},
      ${input.shareToFeed},
      ${audio}::jsonb,
      ${input.audioName},
      ${input.coverUrl},
      ${collaborators}::jsonb,
      ${input.firstComment},
      ${input.locationId},
      ${input.altText},
      ${input.isAiGenerated}
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
    audio: input.audio === undefined ? current.audio : input.audio,
    audioName: input.audioName ?? current.audioName,
    coverUrl: input.coverUrl ?? current.coverUrl,
    collaborators: input.collaborators ?? current.collaborators,
    firstComment: input.firstComment ?? current.firstComment,
    locationId: input.locationId ?? current.locationId,
    altText: input.altText ?? current.altText,
    isAiGenerated: input.isAiGenerated ?? current.isAiGenerated,
    qstashMessageId: input.qstashMessageId ?? current.qstashMessageId,
    errorMessage: input.errorMessage ?? current.errorMessage,
  };

  const sql = database();
  const media = JSON.stringify(next.media);
  const audio = next.audio ? JSON.stringify(next.audio) : null;
  const collaborators = JSON.stringify(next.collaborators);
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
      audio = ${audio}::jsonb,
      audio_name = ${next.audioName},
      cover_url = ${next.coverUrl},
      collaborators = ${collaborators}::jsonb,
      first_comment = ${next.firstComment},
      location_id = ${next.locationId},
      alt_text = ${next.altText},
      is_ai_generated = ${next.isAiGenerated},
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
