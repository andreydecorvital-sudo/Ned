import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";
import type { SocialPostRecord } from "@/lib/social-types";

export type InstagramPublishPhase =
  | "pending"
  | "container_created"
  | "publishing"
  | "published";

export type InstagramPublishState = {
  postId: string;
  fingerprint: string;
  containerId: string;
  childContainerIds: string[];
  publishedMediaId: string;
  phase: InstagramPublishPhase;
  recoveredWithoutMediaId: boolean;
  firstCommentPublished: boolean;
  updatedAt: string;
};

type InstagramPublishStateRow = {
  post_id: string;
  fingerprint: string;
  container_id: string | null;
  child_container_ids: string[] | string | null;
  published_media_id: string | null;
  phase: InstagramPublishPhase;
  recovered_without_media_id: boolean | null;
  first_comment_published: boolean | null;
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

function database() {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

function parseStringArray(value: string[] | string | null) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.length > 0);
  }
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0)
      : [];
  } catch {
    return [];
  }
}

function mapState(row: InstagramPublishStateRow): InstagramPublishState {
  return {
    postId: row.post_id,
    fingerprint: row.fingerprint,
    containerId: row.container_id ?? "",
    childContainerIds: parseStringArray(row.child_container_ids),
    publishedMediaId: row.published_media_id ?? "",
    phase: row.phase,
    recoveredWithoutMediaId: Boolean(row.recovered_without_media_id),
    firstCommentPublished: Boolean(row.first_comment_published),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function ensureInstagramPublishStateSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const sql = database();
    await sql`
      CREATE TABLE IF NOT EXISTS ned_instagram_publish_states (
        post_id text PRIMARY KEY REFERENCES ned_social_posts(id) ON DELETE CASCADE,
        fingerprint varchar(64) NOT NULL,
        container_id text,
        child_container_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
        published_media_id text,
        phase varchar(32) NOT NULL DEFAULT 'pending',
        recovered_without_media_id boolean NOT NULL DEFAULT false,
        first_comment_published boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS ned_instagram_publish_states_phase_idx
      ON ned_instagram_publish_states (phase, updated_at)
    `;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

export function instagramPublishFingerprint(post: SocialPostRecord) {
  const payload = {
    accountName: post.accountName,
    format: post.format,
    caption: post.caption,
    media: post.media.map((asset) => ({
      url: asset.url,
      pathname: asset.pathname,
      contentType: asset.contentType,
      size: asset.size,
    })),
    shareToFeed: post.shareToFeed,
    audio: post.audio,
    audioName: post.audioName,
    coverUrl: post.coverUrl,
    collaborators: post.collaborators,
    locationId: post.locationId,
    altText: post.altText,
    isAiGenerated: post.isAiGenerated,
  };

  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export async function getInstagramPublishState(postId: string) {
  await ensureInstagramPublishStateSchema();
  const sql = database();
  const rows = await sql`
    SELECT *
    FROM ned_instagram_publish_states
    WHERE post_id = ${postId}
    LIMIT 1
  `;
  const row = (rows as InstagramPublishStateRow[])[0];
  return row ? mapState(row) : null;
}

export async function resetInstagramPublishState(post: SocialPostRecord) {
  await ensureInstagramPublishStateSchema();
  const sql = database();
  const fingerprint = instagramPublishFingerprint(post);
  const rows = await sql`
    INSERT INTO ned_instagram_publish_states (
      post_id,
      fingerprint,
      container_id,
      child_container_ids,
      published_media_id,
      phase,
      recovered_without_media_id,
      first_comment_published,
      updated_at
    ) VALUES (
      ${post.id},
      ${fingerprint},
      NULL,
      '[]'::jsonb,
      NULL,
      'pending',
      false,
      false,
      now()
    )
    ON CONFLICT (post_id) DO UPDATE SET
      fingerprint = EXCLUDED.fingerprint,
      container_id = NULL,
      child_container_ids = '[]'::jsonb,
      published_media_id = NULL,
      phase = 'pending',
      recovered_without_media_id = false,
      first_comment_published = false,
      updated_at = now()
    RETURNING *
  `;
  return mapState((rows as InstagramPublishStateRow[])[0]);
}

export async function getOrCreateInstagramPublishState(post: SocialPostRecord) {
  const existing = await getInstagramPublishState(post.id);
  return existing ?? resetInstagramPublishState(post);
}

export async function saveInstagramPublishState(state: InstagramPublishState) {
  await ensureInstagramPublishStateSchema();
  const sql = database();
  const childContainerIds = JSON.stringify(state.childContainerIds);
  const rows = await sql`
    INSERT INTO ned_instagram_publish_states (
      post_id,
      fingerprint,
      container_id,
      child_container_ids,
      published_media_id,
      phase,
      recovered_without_media_id,
      first_comment_published,
      updated_at
    ) VALUES (
      ${state.postId},
      ${state.fingerprint},
      ${state.containerId || null},
      ${childContainerIds}::jsonb,
      ${state.publishedMediaId || null},
      ${state.phase},
      ${state.recoveredWithoutMediaId},
      ${state.firstCommentPublished},
      now()
    )
    ON CONFLICT (post_id) DO UPDATE SET
      fingerprint = EXCLUDED.fingerprint,
      container_id = EXCLUDED.container_id,
      child_container_ids = EXCLUDED.child_container_ids,
      published_media_id = EXCLUDED.published_media_id,
      phase = EXCLUDED.phase,
      recovered_without_media_id = EXCLUDED.recovered_without_media_id,
      first_comment_published = EXCLUDED.first_comment_published,
      updated_at = now()
    RETURNING *
  `;

  return mapState((rows as InstagramPublishStateRow[])[0]);
}

export async function releaseStaleInstagramPublishingClaim(postId: string) {
  const sql = database();
  await sql`
    UPDATE ned_social_posts
    SET
      status = 'failed',
      error_message = 'A tentativa anterior foi interrompida. O contêiner salvo será verificado antes de continuar.',
      updated_at = now()
    WHERE id = ${postId}
      AND status = 'publishing'
      AND last_attempt_at < now() - interval '10 minutes'
  `;
}
