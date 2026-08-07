import { randomBytes } from "node:crypto";
import {
  getStoredInstagramConnection,
  isInstagramConnectionStoreConfigured,
  saveInstagramConnection,
} from "@/lib/instagram-connection";

const FACEBOOK_LOGIN_PERMISSIONS = [
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
] as const;

const INSTAGRAM_LOGIN_PERMISSIONS = [
  "instagram_business_basic",
  "instagram_business_content_publish",
  "instagram_business_manage_comments",
] as const;

type InstagramLoginMode = "facebook" | "instagram";

type GraphError = {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
};

type OAuthTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user_id?: string | number;
  permissions?: string[];
  error?: GraphError;
  error_type?: string;
  error_message?: string;
  code?: number;
};

type InstagramAccount = {
  id?: string;
  username?: string;
};

type InstagramProfileResponse = {
  id?: string;
  user_id?: string | number;
  username?: string;
  account_type?: string;
  error?: GraphError;
};

type ManagedPage = {
  id?: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: InstagramAccount;
};

type ManagedPagesResponse = {
  data?: ManagedPage[];
  paging?: { next?: string };
  error?: GraphError;
};

type PermissionsResponse = {
  data?: Array<{ permission?: string; status?: string }>;
  error?: GraphError;
};

type GraphStage =
  | "AUTHORIZATION_CODE"
  | "LONG_LIVED_TOKEN"
  | "PERMISSIONS"
  | "MANAGED_PAGES"
  | "INSTAGRAM_PROFILE";

function text(value: string | undefined) {
  return value?.trim() ?? "";
}

function hasDatabaseConfiguration() {
  return Boolean(
    text(process.env.DATABASE_URL) ||
      text(process.env.POSTGRES_URL) ||
      text(process.env.NEON_DATABASE_URL),
  );
}

function hasEncryptionConfiguration() {
  return Boolean(
    text(process.env.INSTAGRAM_TOKEN_ENCRYPTION_KEY) ||
      text(process.env.INSTAGRAM_APP_SECRET) ||
      text(process.env.META_APP_SECRET),
  );
}

function configuredLoginMode(): InstagramLoginMode {
  const explicit = text(process.env.INSTAGRAM_LOGIN_MODE).toLowerCase();
  if (explicit === "instagram") return "instagram";
  if (explicit === "facebook") return "facebook";

  if (text(process.env.INSTAGRAM_APP_ID) && text(process.env.INSTAGRAM_APP_SECRET)) {
    return "instagram";
  }
  return "facebook";
}

export function instagramOAuthConfiguration() {
  const siteUrl = text(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/+$/, "");
  const mode = configuredLoginMode();
  return {
    mode,
    appId:
      mode === "instagram"
        ? text(process.env.INSTAGRAM_APP_ID)
        : text(process.env.META_APP_ID),
    appSecret:
      mode === "instagram"
        ? text(process.env.INSTAGRAM_APP_SECRET)
        : text(process.env.META_APP_SECRET),
    apiVersion: text(process.env.META_GRAPH_API_VERSION),
    redirectUri:
      text(process.env.INSTAGRAM_OAUTH_REDIRECT_URI) ||
      (siteUrl ? `${siteUrl}/api/admin/instagram/callback` : ""),
    preferredUsername: text(process.env.INSTAGRAM_PREFERRED_USERNAME)
      .replace(/^@/, "")
      .toLowerCase(),
  };
}

export function getInstagramOAuthMissingConfiguration() {
  const value = instagramOAuthConfiguration();
  const missing: string[] = [];

  if (!value.appId) {
    missing.push(value.mode === "instagram" ? "INSTAGRAM_APP_ID" : "META_APP_ID");
  }
  if (!value.appSecret) {
    missing.push(
      value.mode === "instagram" ? "INSTAGRAM_APP_SECRET" : "META_APP_SECRET",
    );
  }
  if (!value.apiVersion) missing.push("META_GRAPH_API_VERSION");
  if (!value.redirectUri) missing.push("INSTAGRAM_OAUTH_REDIRECT_URI");
  if (!hasDatabaseConfiguration()) missing.push("DATABASE_URL");
  if (!hasEncryptionConfiguration()) {
    missing.push("INSTAGRAM_TOKEN_ENCRYPTION_KEY");
  }

  return missing;
}

export function isInstagramOAuthConfigured() {
  return (
    getInstagramOAuthMissingConfiguration().length === 0 &&
    isInstagramConnectionStoreConfigured()
  );
}

export function createInstagramOAuthState() {
  return randomBytes(24).toString("base64url");
}

export function buildInstagramAuthorizationUrl(state: string) {
  const config = instagramOAuthConfiguration();
  if (!isInstagramOAuthConfigured()) {
    throw new Error("INSTAGRAM_OAUTH_NOT_CONFIGURED");
  }

  if (config.mode === "instagram") {
    const url = new URL("https://www.instagram.com/oauth/authorize");
    url.searchParams.set("client_id", config.appId);
    url.searchParams.set("redirect_uri", config.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);
    url.searchParams.set("scope", INSTAGRAM_LOGIN_PERMISSIONS.join(","));
    url.searchParams.set("enable_fb_login", "0");
    url.searchParams.set("force_authentication", "1");
    return url.toString();
  }

  const url = new URL(
    `https://www.facebook.com/${config.apiVersion}/dialog/oauth`,
  );
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", FACEBOOK_LOGIN_PERMISSIONS.join(","));
  url.searchParams.set("auth_type", "rerequest");
  return url.toString();
}

function metaFailure(stage: GraphStage, response: Response, error?: GraphError) {
  const code = error?.code ?? response.status;
  const subcode = error?.error_subcode ? `:${error.error_subcode}` : "";
  console.error("Instagram Meta API request failed", {
    stage,
    httpStatus: response.status,
    code: error?.code,
    subcode: error?.error_subcode,
    type: error?.type,
    message: error?.message,
  });
  return new Error(`INSTAGRAM_META_${stage}_FAILED:${code}${subcode}`);
}

async function readGraphJson<T extends { error?: GraphError }>(
  response: Response,
  stage: GraphStage,
) {
  const data = (await response.json().catch(() => null)) as T | null;
  if (!data) throw metaFailure(stage, response);
  if (!response.ok || data.error) {
    throw metaFailure(stage, response, data.error);
  }
  return data;
}

async function exchangeInstagramAuthorizationCode(code: string) {
  const config = instagramOAuthConfiguration();
  const body = new FormData();
  body.set("client_id", config.appId);
  body.set("client_secret", config.appSecret);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", config.redirectUri);
  body.set("code", code);

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as OAuthTokenResponse | null;
  if (!data || !response.ok || data.error_message || data.error) {
    console.error("Instagram direct OAuth code exchange failed", {
      httpStatus: response.status,
      code: data?.code ?? data?.error?.code,
      errorType: data?.error_type ?? data?.error?.type,
      message: data?.error_message ?? data?.error?.message,
    });
    throw new Error(
      `INSTAGRAM_META_AUTHORIZATION_CODE_FAILED:${data?.code ?? data?.error?.code ?? response.status}`,
    );
  }
  if (!data.access_token || !data.user_id) {
    throw new Error("INSTAGRAM_AUTHORIZATION_TOKEN_MISSING");
  }
  return data;
}

async function exchangeFacebookAuthorizationCode(code: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/oauth/access_token`,
  );
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("code", code);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readGraphJson<OAuthTokenResponse>(
    response,
    "AUTHORIZATION_CODE",
  );
  if (!data.access_token) {
    throw new Error("INSTAGRAM_AUTHORIZATION_TOKEN_MISSING");
  }
  return data;
}

async function exchangeInstagramLongLivedToken(shortLivedToken: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL("https://graph.instagram.com/access_token");
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("access_token", shortLivedToken);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readGraphJson<OAuthTokenResponse>(
    response,
    "LONG_LIVED_TOKEN",
  );
  if (!data.access_token) {
    throw new Error("INSTAGRAM_LONG_LIVED_TOKEN_MISSING");
  }
  return data;
}

async function exchangeFacebookLongLivedToken(shortLivedToken: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/oauth/access_token`,
  );
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("fb_exchange_token", shortLivedToken);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readGraphJson<OAuthTokenResponse>(
    response,
    "LONG_LIVED_TOKEN",
  );
  if (!data.access_token) {
    throw new Error("INSTAGRAM_LONG_LIVED_TOKEN_MISSING");
  }
  return data;
}

async function grantedPermissions(userAccessToken: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/me/permissions`,
  );
  url.searchParams.set("access_token", userAccessToken);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readGraphJson<PermissionsResponse>(response, "PERMISSIONS");
  return (data.data ?? [])
    .filter((permission) => permission.status === "granted")
    .map((permission) => permission.permission ?? "")
    .filter(Boolean);
}

function assertFacebookPermissions(granted: string[]) {
  const missing = FACEBOOK_LOGIN_PERMISSIONS.filter(
    (permission) => !granted.includes(permission),
  );
  if (missing.length) {
    throw new Error(`INSTAGRAM_PERMISSIONS_MISSING:${missing.join(",")}`);
  }
}

async function managedPages(userAccessToken: string) {
  const config = instagramOAuthConfiguration();
  const start = new URL(
    `https://graph.facebook.com/${config.apiVersion}/me/accounts`,
  );
  start.searchParams.set(
    "fields",
    "id,name,access_token,tasks,instagram_business_account{id,username}",
  );
  start.searchParams.set("limit", "100");
  start.searchParams.set("access_token", userAccessToken);

  const pages: ManagedPage[] = [];
  let nextUrl: string | undefined = start.toString();
  while (nextUrl) {
    const response: Response = await fetch(nextUrl, { cache: "no-store" });
    const data = await readGraphJson<ManagedPagesResponse>(
      response,
      "MANAGED_PAGES",
    );
    pages.push(...(data.data ?? []));
    nextUrl = data.paging?.next;
  }
  return pages;
}

function chooseInstagramPage(pages: ManagedPage[]) {
  const available = pages.filter(
    (page) =>
      page.id &&
      page.access_token &&
      page.instagram_business_account?.id,
  );
  if (!available.length) {
    throw new Error("INSTAGRAM_PROFESSIONAL_ACCOUNT_NOT_FOUND");
  }

  const preferred = instagramOAuthConfiguration().preferredUsername;
  if (preferred) {
    const match = available.find(
      (page) =>
        page.instagram_business_account?.username?.toLowerCase() === preferred,
    );
    if (match) return match;
  }
  return available[0];
}

async function instagramProfile(accessToken: string, fallbackId: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(`https://graph.instagram.com/${config.apiVersion}/me`);
  url.searchParams.set("fields", "id,user_id,username,account_type");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, { cache: "no-store" });
  try {
    const data = await readGraphJson<InstagramProfileResponse>(
      response,
      "INSTAGRAM_PROFILE",
    );
    return {
      id: String(data.id ?? data.user_id ?? fallbackId),
      username: data.username ?? config.preferredUsername,
    };
  } catch (error) {
    console.warn(
      "Instagram profile lookup failed after a successful token exchange; using the OAuth user ID.",
      error,
    );
    return {
      id: fallbackId,
      username: config.preferredUsername,
    };
  }
}

async function connectWithInstagramLogin(code: string) {
  const shortLived = await exchangeInstagramAuthorizationCode(code);
  const longLived = await exchangeInstagramLongLivedToken(shortLived.access_token!);
  const userId = String(shortLived.user_id);
  const profile = await instagramProfile(longLived.access_token!, userId);
  const permissions =
    Array.isArray(shortLived.permissions) && shortLived.permissions.length
      ? shortLived.permissions
      : [...INSTAGRAM_LOGIN_PERMISSIONS];
  const expiresAt =
    typeof longLived.expires_in === "number"
      ? new Date(Date.now() + longLived.expires_in * 1000).toISOString()
      : null;

  return saveInstagramConnection({
    igUserId: profile.id,
    username: profile.username ?? "",
    pageId: "",
    pageName: "Instagram Login direto",
    accessToken: longLived.access_token!,
    userAccessToken: longLived.access_token!,
    expiresAt,
    scopes: permissions,
  });
}

async function connectWithFacebookLogin(code: string) {
  const shortLived = await exchangeFacebookAuthorizationCode(code);
  const longLived = await exchangeFacebookLongLivedToken(shortLived.access_token!);
  const permissions = await grantedPermissions(longLived.access_token!);
  assertFacebookPermissions(permissions);

  const pages = await managedPages(longLived.access_token!);
  const page = chooseInstagramPage(pages);
  const instagram = page.instagram_business_account!;
  const expiresAt =
    typeof longLived.expires_in === "number"
      ? new Date(Date.now() + longLived.expires_in * 1000).toISOString()
      : null;

  return saveInstagramConnection({
    igUserId: instagram.id!,
    username: instagram.username ?? "",
    pageId: page.id!,
    pageName: page.name ?? "",
    accessToken: page.access_token!,
    userAccessToken: longLived.access_token!,
    expiresAt,
    scopes: permissions,
  });
}

export async function connectInstagramWithAuthorizationCode(code: string) {
  if (!isInstagramOAuthConfigured()) {
    throw new Error("INSTAGRAM_OAUTH_NOT_CONFIGURED");
  }

  try {
    const saved =
      instagramOAuthConfiguration().mode === "instagram"
        ? await connectWithInstagramLogin(code)
        : await connectWithFacebookLogin(code);

    if (!saved) throw new Error("INSTAGRAM_CONNECTION_NOT_SAVED");
    return saved;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.startsWith("INSTAGRAM_META_") ||
        error.message.startsWith("INSTAGRAM_PERMISSIONS_MISSING:") ||
        error.message === "INSTAGRAM_PROFESSIONAL_ACCOUNT_NOT_FOUND" ||
        error.message === "INSTAGRAM_AUTHORIZATION_TOKEN_MISSING" ||
        error.message === "INSTAGRAM_LONG_LIVED_TOKEN_MISSING")
    ) {
      throw error;
    }
    console.error("Unable to persist Instagram connection", error);
    throw new Error("INSTAGRAM_CONNECTION_STORAGE_FAILED");
  }
}

export async function getInstagramConnectionSummary() {
  const missingConfiguration = getInstagramOAuthMissingConfiguration();

  try {
    const stored = await getStoredInstagramConnection();
    return {
      connected: Boolean(stored),
      oauthConfigured: missingConfiguration.length === 0,
      missingConfiguration,
      username: stored?.username ?? "",
      pageName: stored?.pageName ?? "",
      expiresAt: stored?.expiresAt ?? null,
    };
  } catch (error) {
    console.error("Unable to load Instagram connection summary", error);
    return {
      connected: false,
      oauthConfigured: missingConfiguration.length === 0,
      missingConfiguration,
      username: "",
      pageName: "",
      expiresAt: null,
    };
  }
}
