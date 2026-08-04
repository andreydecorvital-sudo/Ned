import type { SocialPostRecord } from "@/lib/social-types";

const qstashBaseUrl = (process.env.QSTASH_URL ?? "https://qstash.upstash.io").replace(/\/$/, "");

function token() {
  return (process.env.QSTASH_TOKEN ?? "").trim();
}

function publishSecret() {
  return (process.env.SOCIAL_PUBLISH_SECRET ?? "").trim();
}

function productionBaseUrl() {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercelUrl = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    ""
  ).trim();
  if (!vercelUrl) return "";
  return `${vercelUrl.startsWith("http") ? "" : "https://"}${vercelUrl}`.replace(/\/$/, "");
}

export function isSocialSchedulerConfigured() {
  return Boolean(token() && publishSecret() && productionBaseUrl());
}

export async function scheduleSocialDelivery(post: SocialPostRecord) {
  if (!post.scheduledAt) throw new Error("POST_WITHOUT_SCHEDULE");
  if (!isSocialSchedulerConfigured()) throw new Error("QSTASH_NOT_CONFIGURED");

  const destination = `${productionBaseUrl()}/api/internal/publish-social`;
  const notBefore = Math.max(
    Math.floor(Date.now() / 1000) + 5,
    Math.floor(new Date(post.scheduledAt).getTime() / 1000),
  );

  const response = await fetch(`${qstashBaseUrl}/v2/publish/${destination}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "Upstash-Not-Before": String(notBefore),
      "Upstash-Forward-Authorization": `Bearer ${publishSecret()}`,
      "Upstash-Retries": "3",
      "Upstash-Timeout": "120s",
      "Upstash-Label": `ned-social-${post.id}`,
      "Upstash-Redact-Fields": "header[Authorization]",
    },
    body: JSON.stringify({ postId: post.id }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    messageId?: string;
    error?: string;
  };
  if (!response.ok || !data.messageId) {
    throw new Error(data.error ?? `QSTASH_${response.status}`);
  }
  return data.messageId;
}

export async function cancelSocialDelivery(messageId: string) {
  if (!messageId || !token()) return;
  const response = await fetch(`${qstashBaseUrl}/v2/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`QSTASH_CANCEL_${response.status}`);
  }
}
