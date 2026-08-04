import type { SocialMediaAsset, SocialPostRecord } from "@/lib/social-types";

function credentials() {
  return {
    accessToken: (process.env.INSTAGRAM_ACCESS_TOKEN ?? "").trim(),
    igUserId: (process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? "").trim(),
    apiVersion: (process.env.META_GRAPH_API_VERSION ?? "").trim(),
  };
}

export function isInstagramPublishingConfigured() {
  const value = credentials();
  return Boolean(value.accessToken && value.igUserId && value.apiVersion);
}

type GraphResponse = {
  id?: string;
  status_code?: string;
  status?: string;
  error?: { message?: string; type?: string; code?: number; error_subcode?: number };
};

async function graphPost(path: string, params: Record<string, string | boolean>) {
  const { accessToken, apiVersion } = credentials();
  const body = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => body.set(key, String(value)));
  body.set("access_token", accessToken);

  const response = await fetch(`https://graph.facebook.com/${apiVersion}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as GraphResponse;
  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? `META_API_${response.status}`);
  }
  return data;
}

async function graphGet(path: string, params: Record<string, string>) {
  const { accessToken, apiVersion } = credentials();
  const query = new URLSearchParams(params);
  query.set("access_token", accessToken);
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${path}?${query.toString()}`,
    { cache: "no-store" },
  );
  const data = (await response.json()) as GraphResponse;
  if (!response.ok || data.error) {
    throw new Error(data.error?.message ?? `META_API_${response.status}`);
  }
  return data;
}

function isVideo(asset: SocialMediaAsset) {
  return asset.contentType.startsWith("video/");
}

async function waitUntilReady(containerId: string) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const status = await graphGet(containerId, { fields: "status_code,status" });
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") {
      throw new Error(status.status ?? `CONTAINER_${status.status_code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
  throw new Error("A mídia ainda está sendo processada pelo Instagram. Uma nova tentativa será feita.");
}

async function createMediaContainer(params: Record<string, string | boolean>) {
  const { igUserId } = credentials();
  const data = await graphPost(`${igUserId}/media`, params);
  if (!data.id) throw new Error("O Instagram não retornou o contêiner da mídia.");
  return data.id;
}

async function publishContainer(containerId: string) {
  const { igUserId } = credentials();
  const data = await graphPost(`${igUserId}/media_publish`, { creation_id: containerId });
  if (!data.id) throw new Error("O Instagram não retornou o ID da publicação.");
  return data.id;
}

async function publishFeed(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset || isVideo(asset)) throw new Error("Feed precisa de uma imagem. Use Reel para vídeos.");
  const containerId = await createMediaContainer({
    image_url: asset.url,
    caption: post.caption,
  });
  return publishContainer(containerId);
}

async function publishReel(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset || !isVideo(asset)) throw new Error("Reel precisa de um vídeo.");
  const containerId = await createMediaContainer({
    media_type: "REELS",
    video_url: asset.url,
    caption: post.caption,
    share_to_feed: post.shareToFeed,
  });
  await waitUntilReady(containerId);
  return publishContainer(containerId);
}

async function publishStory(post: SocialPostRecord) {
  const asset = post.media[0];
  if (!asset) throw new Error("Story precisa de uma imagem ou vídeo.");
  const params: Record<string, string | boolean> = { media_type: "STORIES" };
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
    const params: Record<string, string | boolean> = { is_carousel_item: true };
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
  });
  return publishContainer(parentId);
}

export async function publishInstagramPost(post: SocialPostRecord) {
  if (!isInstagramPublishingConfigured()) throw new Error("INSTAGRAM_NOT_CONFIGURED");
  if (!post.media.length) throw new Error("A publicação não possui mídia.");

  if (post.format === "feed") return publishFeed(post);
  if (post.format === "reel") return publishReel(post);
  if (post.format === "story") return publishStory(post);
  return publishCarousel(post);
}
