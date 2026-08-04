import type {
  SocialAudioSelection,
  SocialFormat,
  SocialMediaAsset,
  SocialPostRecord,
} from "@/lib/social-types";

export type Configuration = {
  database: boolean;
  blob: boolean;
  instagram: boolean;
  audio: boolean;
  scheduler: boolean;
};

export type ApiResponse = {
  posts?: SocialPostRecord[];
  configuration?: Configuration;
  error?: string;
};

export type FormState = {
  accountName: string;
  format: SocialFormat;
  caption: string;
  scheduledAt: string;
  shareToFeed: boolean;
  media: SocialMediaAsset[];
  audio: SocialAudioSelection | null;
  audioName: string;
  coverUrl: string;
  collaborators: string;
  firstComment: string;
  locationId: string;
  altText: string;
  isAiGenerated: boolean;
};

export const emptyForm: FormState = {
  accountName: "NED Marketing",
  format: "feed",
  caption: "",
  scheduledAt: "",
  shareToFeed: true,
  media: [],
  audio: null,
  audioName: "",
  coverUrl: "",
  collaborators: "",
  firstComment: "",
  locationId: "",
  altText: "",
  isAiGenerated: false,
};

export function localMinimum() {
  const date = new Date(Date.now() + 120_000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

export function formatDate(value: string | null) {
  if (!value) return "Sem horário definido";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

export function mediaLimit(format: SocialFormat) {
  return format === "carousel" ? 10 : 1;
}

export function accepts(format: SocialFormat) {
  if (format === "feed") return "image/jpeg,image/png,image/webp";
  if (format === "reel") return "video/mp4,video/quicktime";
  return "image/jpeg,image/png,image/webp,video/mp4,video/quicktime";
}

export function compatible(format: SocialFormat, contentType: string) {
  if (format === "feed") return contentType.startsWith("image/");
  if (format === "reel") return contentType.startsWith("video/");
  return contentType.startsWith("image/") || contentType.startsWith("video/");
}

export function collaboratorList(value: string) {
  return [
    ...new Set(
      value
        .split(/[\s,;]+/)
        .map((item) => item.trim().replace(/^@/, ""))
        .filter(Boolean),
    ),
  ].slice(0, 3);
}

function hashtagCount(caption: string) {
  return caption.match(/#[\p{L}\p{N}_]+/gu)?.length ?? 0;
}

function hasCta(caption: string) {
  return /(comente|salve|compartilhe|envie|clique|chame|fale|acesse|garanta|mande|marque)/i.test(
    caption,
  );
}

export function audioLabel(audio: SocialAudioSelection | null) {
  if (!audio) return "Sem música da biblioteca";
  return audio.artist ? `${audio.title} · ${audio.artist}` : audio.title;
}

export function buildReadiness(form: FormState, collaboratorCount: number) {
  const checks = [
    { label: "Mídia adicionada", ready: form.media.length > 0, points: 15 },
    {
      label: "Legenda clara",
      ready: form.format === "story" || form.caption.length >= 60,
      points: 12,
    },
    {
      label: "Chamada para ação",
      ready: form.format === "story" || hasCta(form.caption),
      points: 12,
    },
    {
      label: "Hashtags equilibradas",
      ready:
        form.format === "story" ||
        (hashtagCount(form.caption) >= 3 && hashtagCount(form.caption) <= 8),
      points: 8,
    },
    {
      label: "Música ou áudio",
      ready: form.format !== "reel" || Boolean(form.audio || form.audioName),
      points: 12,
    },
    {
      label: "Capa do Reel",
      ready: form.format !== "reel" || Boolean(form.coverUrl),
      points: 8,
    },
    { label: "Colaborador", ready: collaboratorCount > 0, points: 10 },
    { label: "Primeiro comentário", ready: Boolean(form.firstComment.trim()), points: 8 },
    {
      label: "Texto alternativo",
      ready: form.format === "story" || Boolean(form.altText.trim()),
      points: 7,
    },
    { label: "Data definida", ready: Boolean(form.scheduledAt), points: 6 },
  ];
  return {
    checks,
    score: Math.min(
      100,
      checks.reduce((total, item) => total + (item.ready ? item.points : 0), 0),
    ),
  };
}
