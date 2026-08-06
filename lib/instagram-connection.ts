import { neon } from "@neondatabase/serverless";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export type StoredInstagramConnection = {
  igUserId: string;
  username: string;
  pageId: string;
  pageName: string;
  accessToken: string;
  userAccessToken: string;
  expiresAt: string | null;
  scopes: string[];
  connectedAt: string;
};

type InstagramConnectionRow = {
  ig_user_id: string;
  username: string | null;
  page_id: string | null;
  page_name: string | null;
  encrypted_access_token: string;
  encrypted_user_access_token: string | null;
  token_expires_at: string | Date | null;
  scopes: string[] | string | null;
  connected_at: string | Date;
};

let schemaReady: Promise<void> | null = null;
let cachedConnection:
  | { expiresAt: number; value: StoredInstagramConnection | null }
  | null = null;

function connectionString() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.NEON_DATABASE_URL ??
    ""
  ).trim();
}

function encryptionSecret() {
  return (
    process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY ??
    process.env.META_APP_SECRET ??
    ""
  ).trim();
}

export function isInstagramConnectionStoreConfigured() {
  return Boolean(connectionString() && encryptionSecret());
}

function database() {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

function encryptionKey() {
  const secret = encryptionSecret();
  if (!secret) throw new Error("INSTAGRAM_ENCRYPTION_NOT_CONFIGURED");
  return createHash("sha256")
    .update(`ned-instagram-token:v1\0${secret}`)
    .digest();
}

function encryptToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

function decryptToken(value: string) {
  const [version, ivValue, tagValue, encryptedValue] = value.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !encryptedValue) {
    throw new Error("INSTAGRAM_TOKEN_INVALID");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function iso(value: string | Date | null) {
  return value ? new Date(value).toISOString() : null;
}

function parseScopes(value: string[] | string | null) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
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

async function ensureInstagramConnectionSchema() {
  if (!isInstagramConnectionStoreConfigured()) {
    throw new Error("INSTAGRAM_CONNECTION_STORE_NOT_CONFIGURED");
  }
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const sql = database();
    await sql`
      CREATE TABLE IF NOT EXISTS ned_instagram_connections (
        connection_key varchar(40) PRIMARY KEY,
        ig_user_id text NOT NULL,
        username varchar(120) NOT NULL DEFAULT '',
        page_id text NOT NULL DEFAULT '',
        page_name varchar(180) NOT NULL DEFAULT '',
        encrypted_access_token text NOT NULL,
        encrypted_user_access_token text,
        token_expires_at timestamptz,
        scopes jsonb NOT NULL DEFAULT '[]'::jsonb,
        connected_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      ALTER TABLE ned_instagram_connections
      ADD COLUMN IF NOT EXISTS encrypted_user_access_token text
    `;
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

export async function getStoredInstagramConnection() {
  if (!isInstagramConnectionStoreConfigured()) return null;
  if (cachedConnection && cachedConnection.expiresAt > Date.now()) {
    return cachedConnection.value;
  }

  await ensureInstagramConnectionSchema();
  const sql = database();
  const rows = await sql`
    SELECT
      ig_user_id,
      username,
      page_id,
      page_name,
      encrypted_access_token,
      encrypted_user_access_token,
      token_expires_at,
      scopes,
      connected_at
    FROM ned_instagram_connections
    WHERE connection_key = 'primary'
    LIMIT 1
  `;
  const row = (rows as InstagramConnectionRow[])[0];
  if (!row) {
    cachedConnection = { expiresAt: Date.now() + 15_000, value: null };
    return null;
  }

  try {
    const pageToken = decryptToken(row.encrypted_access_token);
    const connection: StoredInstagramConnection = {
      igUserId: row.ig_user_id,
      username: row.username ?? "",
      pageId: row.page_id ?? "",
      pageName: row.page_name ?? "",
      accessToken: pageToken,
      userAccessToken: row.encrypted_user_access_token
        ? decryptToken(row.encrypted_user_access_token)
        : pageToken,
      expiresAt: iso(row.token_expires_at),
      scopes: parseScopes(row.scopes),
      connectedAt: iso(row.connected_at) ?? new Date().toISOString(),
    };
    cachedConnection = {
      expiresAt: Date.now() + 30_000,
      value: connection,
    };
    return connection;
  } catch (error) {
    console.error("Unable to decrypt the stored Instagram token", error);
    return null;
  }
}

export async function saveInstagramConnection(input: {
  igUserId: string;
  username: string;
  pageId: string;
  pageName: string;
  accessToken: string;
  userAccessToken: string;
  expiresAt: string | null;
  scopes: string[];
}) {
  await ensureInstagramConnectionSchema();
  const sql = database();
  const encryptedAccessToken = encryptToken(input.accessToken);
  const encryptedUserAccessToken = encryptToken(input.userAccessToken);
  const scopes = JSON.stringify(input.scopes);
  await sql`
    INSERT INTO ned_instagram_connections (
      connection_key,
      ig_user_id,
      username,
      page_id,
      page_name,
      encrypted_access_token,
      encrypted_user_access_token,
      token_expires_at,
      scopes,
      connected_at,
      updated_at
    ) VALUES (
      'primary',
      ${input.igUserId},
      ${input.username},
      ${input.pageId},
      ${input.pageName},
      ${encryptedAccessToken},
      ${encryptedUserAccessToken},
      ${input.expiresAt},
      ${scopes}::jsonb,
      now(),
      now()
    )
    ON CONFLICT (connection_key) DO UPDATE SET
      ig_user_id = EXCLUDED.ig_user_id,
      username = EXCLUDED.username,
      page_id = EXCLUDED.page_id,
      page_name = EXCLUDED.page_name,
      encrypted_access_token = EXCLUDED.encrypted_access_token,
      encrypted_user_access_token = EXCLUDED.encrypted_user_access_token,
      token_expires_at = EXCLUDED.token_expires_at,
      scopes = EXCLUDED.scopes,
      connected_at = now(),
      updated_at = now()
  `;
  cachedConnection = null;
  return getStoredInstagramConnection();
}

export async function deleteInstagramConnection() {
  if (!isInstagramConnectionStoreConfigured()) return;
  await ensureInstagramConnectionSchema();
  const sql = database();
  await sql`
    DELETE FROM ned_instagram_connections
    WHERE connection_key = 'primary'
  `;
  cachedConnection = null;
}
