export const socialFormats = ["feed", "carousel", "reel", "story"] as const;
export type SocialFormat = (typeof socialFormats)[number];

export const socialStatuses = [
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
] as const;
export type SocialStatus = (typeof socialStatuses)[number];

export type SocialMediaAsset = {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
};

export type SocialPostRecord = {
  id: string;
  accountName: string;
  format: SocialFormat;
  caption: string;
  media: SocialMediaAsset[];
  scheduledAt: string | null;
  status: SocialStatus;
  shareToFeed: boolean;
  publishedMediaId: string;
  qstashMessageId: string;
  errorMessage: string;
  attemptCount: number;
  lastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSocialPostInput = {
  accountName: string;
  format: SocialFormat;
  caption: string;
  media: SocialMediaAsset[];
  scheduledAt: string | null;
  status: "draft" | "scheduled";
  shareToFeed: boolean;
};

export type UpdateSocialPostInput = Partial<CreateSocialPostInput> & {
  qstashMessageId?: string;
  errorMessage?: string;
};

export const socialFormatLabels: Record<SocialFormat, string> = {
  feed: "Feed",
  carousel: "Carrossel",
  reel: "Reel",
  story: "Story",
};

export const socialStatusLabels: Record<SocialStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  publishing: "Publicando",
  published: "Publicado",
  failed: "Falhou",
};

export function isSocialFormat(value: unknown): value is SocialFormat {
  return typeof value === "string" && socialFormats.includes(value as SocialFormat);
}

export function isSocialStatus(value: unknown): value is SocialStatus {
  return typeof value === "string" && socialStatuses.includes(value as SocialStatus);
}
