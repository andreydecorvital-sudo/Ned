import type {
  InstagramAudioSearchResult,
  SocialAudioType,
  SocialMediaAsset,
  SocialPostRecord,
} from "@/lib/social-types";
import { getStoredInstagramConnection } from "@/lib/instagram-connection";

type InstagramCredentials = {
  accessToken: string;
  userAccessToken: string;
  igUserId: string;
  apiVersion: string;
};

let credentialCache:
  | { expiresAt: number; value: InstagramCredentials }
  | null = null;

function environmentCredentials(): InstagramCredentials {
  const accessToken = (process.env.INSTAGRAM_ACCESS_TOKEN ?? "").trim();
  return {
    accessToken,
    userAccessToken: (
      process.env.INSTAGRAM_USER_ACCESS_TOKEN ?? accessToken
    ).trim(),
    igUserId: (process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? "").trim(),
    apiVersion: (process.env.META_GRAPH_API_VERSION ?? "").trim(),
  };
}

async function credentials() {
  if (credentialCache && credentialCache.expiresAt > Date.now()) {
    return credentialCache.value;
  }

  const stored = await getStoredInstagramConnection();
  const fallback = environmentCredentials();
  const value: InstagramCredentials = stored
    ? {
        accessToken: stored.accessToken,
        userAccessToken: stored.userAccessToken,
        igUserId: stored.igUserId,
        apiVersion: fallback.apiVersion,
      }
    : fallback;

  credentialCache = {
    expiresAt: Date.now() + 15_000,
    value,
  };
  return value;
}

export async function isInstagramPublishingConfigured() {
  const value = await credentials();
  return Boolean(value.accessToken && value.igUserId && value.apiVersion);
}

export async function isInstagramAudioConfigured() {
  const value = await credentials();
  return Boolean(
    value.userAccessToken && value.igUserId && value.apiVersion,
  );
}

type GraphError = {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
};

type GraphObject = Record<string, unknown> & {
  id?: string;
  status_code?: string;
  status?: string;
  error?: GraphError;
};

type GraphAudioResponse = GraphObject & {
  audio?: GraphObject[];
};

function friendlyGraphMessage(data: GraphObject, status: number) {
  const serialized = JSON.stringify(data);
  if (serialized.includes("REVOKED_ACCESS_TOKEN") || data.error?.code === 190) {
    return "A conexão com o Instagram expirou. Reconecte a conta no painel.";
  }
  if (serialized.includes("2207009") || serialized.includes("36003")) {
    return "A proporção da imagem não é aceita pelo Instagram. Use entre 4:5 e 1,91:1.";
  }
  if (serialized.includes("2207010")) {
    return "A legenda ultrapassa o limite aceito pelo Instagram.";
  }
  if (serialized.includes("2207026")) {
    return "O formato do vídeo não é compatível com o Instagram.";
  }
  if (serialized.includes("2207004")) {
    return "A imagem é maior do que o Instagram aceita.";
  }
  if (serialized.includes("2207005")) {
    return "O formato da imagem não é compatível com o Instagram.";
  }
  if (serialized.includes("2207001")) {
    return "O Instagram classificou o conteúdo como possível spam. Revise o conteúdo antes de tentar novamente.";
  }
  if (serialized.includes("2207042") || serialized.includes("Page request limit reached")) {
    return "O limite diário de publicações do Instagram foi atingido.";
  }
  if (serialized.includes("param collaborators is not allowed")) {
    return "O Instagram não permite colaboradores nesse formato de publicação.";
  }
  return data.error?.message ?? `META_API_${status}`;
}

function graphError(data: GraphObject, status: number) {
  return new Error(friendlyGraphMessage(data, status));
}

async function graphPost(
  path: string,
  params: Record<string, string | boolean | number>,
) {
  const { accessToken, apiVersion } = await credentials();
  const body = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => body.set(key, String(value)));
  body.set("access_token", accessToken);

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as GraphObject;
  if (!response.ok || data.error) throw graphError(data, response.status);
  return data;
}

async function graphGet(
  path: string,
  params: Record<string, string>,
  tokenType: "page" | "user" = "page",
) {
  const { accessToken, userAccessToken, apiVersion } = await credentials();
  const query = new URLSearchParams(params);
  query.set(
    "access_token",
    tokenType === "user" ? userAccessToken : accessToken,
  );
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${path}?${query.toString()}`,
    { cache: "no-store" },
  );
  const data = (await response.json()) as GraphObject;
  if (!response.ok || data.error) throw graphError(data, response.status);
  return data;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function number(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function firstText(item: GraphObject, keys: string[]) {
  for (const key of keys) {
    const value = text(item[key]);
    if (value) return value;
  }
  return "";
}

function normalizeAudio(
  item: GraphObject,
  fallbackType: SocialAudioType,
): InstagramAudioSearchResult | null {
  const id = firstText(item, ["audio_id", "id", "ig_audio_id"]);
  if (!id) return null;
  const rawType = firstText(item, ["audio_type", "type"]).toLowerCase();
  const type: SocialAudioType =
    rawType === "original_sound" ? "original_sound" : fallbackType;
  const title =
    firstText(item, ["title", "audio_title", "name", "display_name"]) ||
    (type === "music" ? "Música do Instagram" : "Áudio original");
  const artist = firstText(item, [
    "display_artist",
    "ig_username",
    "artist",
    "artist_name",
    "username",
  ]);
  const thumbnailUrl = firstText(item, [
    "cover_artwork_thumbnail_uri",
    "cover_artwork_thumbnail_url",
    "profile_picture_url",
    "thumbnail_url",
    "cover_url",
  ]);
  const previewUrl = firstText(item, [
    "download_url",
    "preview_url",
    "audio_url",
  ]);
  const usageCount = number(item.usage_count ?? item.reels_count ?? item.use_count);
  const trending = Boolean(item.is_trending ?? item.trending ?? item.is_popular);
  return { id, title, artist, type, thumbnailUrl, previewUrl, trending, usageCount };
}

export async function searchInstagramAudio(options: {
  query?: string;
  type: SocialAudioType;
  limit?: number;
}) {
  if (!(await isInstagramAudioConfigured())) {
    throw new Error("INSTAGRAM_NOT_CONFIGURED");
  }
  const { igUserId } = await credentials();
  const params: Record<string, string> = {
    audio_type: options.type,
    user_id: igUserId,
  };
  const query = options.query?.trim();
  if (query) params.search_query = query.slice(0, 120);

  const data = (await graphGet("ig_audio", params, "user")) as GraphAudioResponse;
  return (data.audio ?? [])
    .map((item) => normalizeAudio(item, options.type))
    .filter((item): item is InstagramAudioSearchResult => Boolean(item))
    .slice(0, Math.max(1, Math.min(options.limit ?? 24, 50)));
}

function isVideo(asset: SocialMediaAsset) {
  return asset.contentType.startsWith("video/");
}

function clampVolume(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

async function waitUntilReady(containerId: string) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const status = await graphGet(containerId, { fields: "status_code,status" });
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "PUBLISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(text(status.status) || `CONTAINER_${status.status_code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(
    "A mídia ainda está sendo processada pelo Instagram. Tente publicar novamente em alguns minutos.",
  );
}

async function createMediaContainer(
  params: Record<string, string | boolean | number>,
) {
  const { igUserId } = await credentials();
  const data = await graphPost(`${igUserId}/media`, params);
  if (!data.id) throw new Error("O Instagram não retornou o contêiner da mídia.");
  return data.id;
}

async function publishContainer(containerId: string) {
  const { igUserId } = await credentials();
  const data = await graphPost(`${igUserId}/media_publish`, {
    creation_id: containerId,
  });
  if (!data.id) throw new Error("O Instagram não retornou o ID da publicação.");
  return data.id;
}

function commonPublishingParams(
  post: SocialPostRecord,
  allowCollaborators = false,
) {
  const params: Record<string, string | boolean | number> = {};
  if (post.locationId) params.location_id = post.locationId;
  if (allowCollaborators && post.collaborators.length) {
    params.collaborators = JSON.stringify(post.collaborators);
  }
  if (post.isAiGenerated) params.is_ai_generated = true;
  return params;
}

async function publishFirstComment(post: SocialPostRecord, mediaId: string) {
  if (!post.firstComment.trim()) return;
  try {
    await graphPost(`${mediaId}/comments`, { message: post.firstComment.trim() });
  } catch (error) {
    console.error("Instagram post published, but first comment failed", error);
  }
}

async function publishFeed(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset || isVideo(asset)) {
    throw new Error("Feed precisa de uma imagem. Use Reel para vídeos.");
  }
  const containerId = await createMediaContainer({
    image_url: asset.url,
    caption: post.caption,
    ...(post.altText ? { alt_text: post.altText } : {}),
    ...commonPublishingParams(post, true),
  });
  const mediaId = await publishContainer(containerId);
  await publishFirstComment(post, mediaId);
  return mediaId;
}

async function publishReel(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset || !isVideo(asset)) throw new Error("Reel precisa de um vídeo.");
  const params: Record<string, string | boolean | number> = {
    media_type: "REELS",
    video_url: asset.url,
    caption: post.caption,
    share_to_feed: post.shareToFeed,
    ...commonPublishingParams(post, true),
  };
  if (post.coverUrl) params.cover_url = post.coverUrl;
  if (post.audio) {
    params.audio_configuration = JSON.stringify({
      audio_id: post.audio.id,
      audio_volume: clampVolume(post.audio.musicVolume),
      video_volume: clampVolume(post.audio.originalAudioVolume),
    });
  } else if (post.audioName) {
    params.audio_name = post.audioName;
  }
  const containerId = await createMediaContainer(params);
  await waitUntilReady(containerId);
  const mediaId = await publishContainer(containerId);
  await publishFirstComment(post, mediaId);
  return mediaId;
}

async function publishStory(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset) throw new Error("Story precisa de uma imagem ou vídeo.");
  const params: Record<string, string | boolean | number> = {
    media_type: "STORIES",
    ...(post.isAiGenerated ? { is_ai_generated: true } : {}),
  };
  if (isVideo(asset)) params.video_url = asset.url;
  else params.image_url = asset.url;
  const containerId = await createMediaContainer(params);
  if (isVideo(asset)) await waitUntilReady(containerId);
  return publishContainer(containerId);
}

async function publishCarousel(post: SocialPostRecord) {
  if (post.media.length < 2 || post.media.length > 10) {
    throw new Error("Carrossel precisa ter entre 2 e 10 mídias.");
  }

  const childIds: string[] = [];
  for (const asset of post.media) {
    const params: Record<string, string | boolean | number> = {
      is_carousel_item: true,
    };
    if (isVideo(asset)) {
      params.media_type = "VIDEO";
      params.video_url = asset.url;
    } else {
      params.image_url = asset.url;
    }
    const childId = await createMediaContainer(params);
    if (isVideo(asset)) await waitUntilReady(childId);
    childIds.push(childId);
  }

  const parentId = await createMediaContainer({
    media_type: "CAROUSEL",
    children: childIds.join(","),
    caption: post.caption,
    ...commonPublishingParams(post, false),
  });
  await waitUntilReady(parentId);
  const mediaId = await publishContainer(parentId);
  await publishFirstComment(post, mediaId);
  return mediaId;
}

export async function publishInstagramPost(post: SocialPostRecord) {
  if (!(await isInstagramPublishingConfigured())) {
    throw new Error("INSTAGRAM_NOT_CONFIGURED");
  }
  if (!post.media.length) throw new Error("A publicação não possui mídia.");

  if (post.format === "feed") return publishFeed(post);
  if (post.format === "reel") return publishReel(post);
  if (post.format === "story") return publishStory(post);
  return publishCarousel(post);
}
