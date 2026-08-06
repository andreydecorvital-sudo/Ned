import { randomBytes } from "node:crypto";
import {
  getStoredInstagramConnection,
  isInstagramConnectionStoreConfigured,
  saveInstagramConnection,
} from "@/lib/instagram-connection";

const INSTAGRAM_PERMISSIONS = [
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
] as const;

type OAuthTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

type InstagramAccount = {
  id?: string;
  username?: string;
};

type ManagedPage = {
  id?: string;
  name?: string;
  access_token?: string;
  instagram_business_account?: InstagramAccount;
};

type ManagedPagesResponse = {
  data?: ManagedPage[];
  error?: OAuthTokenResponse["error"];
};

function text(value: string | undefined) {
  return value?.trim() ?? "";
}

export function instagramOAuthConfiguration() {
  const siteUrl = text(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/+$/, "");
  return {
    appId: text(process.env.META_APP_ID),
    appSecret: text(process.env.META_APP_SECRET),
    apiVersion: text(process.env.META_GRAPH_API_VERSION),
    redirectUri:
      text(process.env.INSTAGRAM_OAUTH_REDIRECT_URI) ||
      (siteUrl ? `${siteUrl}/api/admin/instagram/callback` : ""),
    preferredUsername: text(process.env.INSTAGRAM_PREFERRED_USERNAME)
      .replace(/^@/, "")
      .toLowerCase(),
  };
}

export function isInstagramOAuthConfigured() {
  const value = instagramOAuthConfiguration();
  return Boolean(
    value.appId &&
      value.appSecret &&
      value.apiVersion &&
      value.redirectUri &&
      isInstagramConnectionStoreConfigured(),
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

  const url = new URL(
    `https://www.facebook.com/${config.apiVersion}/dialog/oauth`,
  );
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", INSTAGRAM_PERMISSIONS.join(","));
  url.searchParams.set("auth_type", "rerequest");
  return url.toString();
}

async function readJson<T>(response: Response) {
  const data = (await response.json().catch(() => null)) as T | null;
  if (!response.ok || !data) {
    throw new Error(`META_API_${response.status}`);
  }
  return data;
}

function graphError(
  data: { error?: OAuthTokenResponse["error"] },
  fallback: string,
) {
  return new Error(data.error?.message ?? fallback);
}

async function exchangeAuthorizationCode(code: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/oauth/access_token`,
  );
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("code", code);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readJson<OAuthTokenResponse>(response);
  if (data.error || !data.access_token) {
    throw graphError(data, "O Meta não retornou o token de acesso.");
  }
  return data;
}

async function exchangeLongLivedToken(shortLivedToken: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/oauth/access_token`,
  );
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("fb_exchange_token", shortLivedToken);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readJson<OAuthTokenResponse>(response);
  if (data.error || !data.access_token) {
    throw graphError(data, "Não foi possível gerar o token de longa duração.");
  }
  return data;
}

async function managedPages(userAccessToken: string) {
  const config = instagramOAuthConfiguration();
  const url = new URL(
    `https://graph.facebook.com/${config.apiVersion}/me/accounts`,
  );
  url.searchParams.set(
    "fields",
    "id,name,access_token,tasks,instagram_business_account{id,username}",
  );
  url.searchParams.set("access_token", userAccessToken);

  const response = await fetch(url, { cache: "no-store" });
  const data = await readJson<ManagedPagesResponse>(response);
  if (data.error) {
    throw graphError(data, "Não foi possível localizar as páginas administradas.");
  }
  return data.data ?? [];
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

export async function connectInstagramWithAuthorizationCode(code: string) {
  if (!isInstagramOAuthConfigured()) {
    throw new Error("INSTAGRAM_OAUTH_NOT_CONFIGURED");
  }

  const shortLived = await exchangeAuthorizationCode(code);
  const longLived = await exchangeLongLivedToken(shortLived.access_token!);
  const pages = await managedPages(longLived.access_token!);
  const page = chooseInstagramPage(pages);
  const instagram = page.instagram_business_account!;

  const expiresAt =
    typeof longLived.expires_in === "number"
      ? new Date(Date.now() + longLived.expires_in * 1000).toISOString()
      : null;

  const saved = await saveInstagramConnection({
    igUserId: instagram.id!,
    username: instagram.username ?? "",
    pageId: page.id!,
    pageName: page.name ?? "",
    accessToken: page.access_token!,
    expiresAt,
    scopes: [...INSTAGRAM_PERMISSIONS],
  });

  if (!saved) throw new Error("INSTAGRAM_CONNECTION_NOT_SAVED");
  return saved;
}

export async function getInstagramConnectionSummary() {
  const stored = await getStoredInstagramConnection();
  return {
    connected: Boolean(stored),
    oauthConfigured: isInstagramOAuthConfigured(),
    username: stored?.username ?? "",
    pageName: stored?.pageName ?? "",
    expiresAt: stored?.expiresAt ?? null,
  };
}
