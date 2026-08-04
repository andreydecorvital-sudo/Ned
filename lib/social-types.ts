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

export const socialAudioTypes = ["music", "original_sound"] as const;
export type SocialAudioType = (typeof socialAudioTypes)[number];

export type SocialMediaAsset = {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
};

export type SocialAudioSelection = {
  id: string;
  title: string;
  artist: string;
  type: SocialAudioType;
  thumbnailUrl: string;
  previewUrl: string;
  musicVolume: number;
  originalAudioVolume: number;
};

export type InstagramAudioSearchResult = Omit<
  SocialAudioSelection,
  "musicVolume" | "originalAudioVolume"
> & {
  trending: boolean;
  usageCount: number | null;
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
  audio: SocialAudioSelection | null;
  audioName: string;
  coverUrl: string;
  collaborators: string[];
  firstComment: string;
  locationId: string;
  altText: string;
  isAiGenerated: boolean;
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
  audio: SocialAudioSelection | null;
  audioName: string;
  coverUrl: string;
  collaborators: string[];
  firstComment: string;
  locationId: string;
  altText: string;
  isAiGenerated: boolean;
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

export function isSocialAudioType(value: unknown): value is SocialAudioType {
  return typeof value === "string" && socialAudioTypes.includes(value as SocialAudioType);
}
