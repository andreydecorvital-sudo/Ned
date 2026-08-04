import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cancelSocialDelivery, scheduleSocialDelivery } from "@/lib/qstash-social";
import {
  deleteSocialPost,
  getSocialPost,
  updateSocialPost,
} from "@/lib/social-store";
import {
  isSocialAudioType,
  isSocialFormat,
  type SocialAudioSelection,
  type SocialMediaAsset,
  type UpdateSocialPostInput,
} from "@/lib/social-types";

export const dynamic = "force-dynamic";

type RouteProps = { params: Promise<{ id: string }> };

function mediaAssets(value: unknown): SocialMediaAsset[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const valid = value.filter((item): item is SocialMediaAsset => {
    if (!item || typeof item !== "object") return false;
    const asset = item as Partial<SocialMediaAsset>;
    return (
      typeof asset.url === "string" &&
      asset.url.startsWith("https://") &&
      typeof asset.pathname === "string" &&
      typeof asset.contentType === "string" &&
      typeof asset.size === "number" &&
      Number.isFinite(asset.size)
    );
  });
  return valid.length === value.length ? valid : undefined;
}

function boundedVolume(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.round(value)))
    : fallback;
}

function audioSelection(value: unknown): SocialAudioSelection | null | undefined {
  if (value === null) return null;
  if (!value || typeof value !== "object") return undefined;
  const audio = value as Record<string, unknown>;
  if (typeof audio.id !== "string" || !audio.id.trim() || !isSocialAudioType(audio.type)) {
    return undefined;
  }
  return {
    id: audio.id.trim().slice(0, 120),
    title:
      typeof audio.title === "string"
        ? audio.title.trim().slice(0, 200)
        : "Áudio do Instagram",
    artist: typeof audio.artist === "string" ? audio.artist.trim().slice(0, 160) : "",
    type: audio.type,
    thumbnailUrl:
      typeof audio.thumbnailUrl === "string" && audio.thumbnailUrl.startsWith("https://")
        ? audio.thumbnailUrl.slice(0, 1500)
        : "",
    previewUrl:
      typeof audio.previewUrl === "string" && audio.previewUrl.startsWith("https://")
        ? audio.previewUrl.slice(0, 1500)
        : "",
    musicVolume: boundedVolume(audio.musicVolume, 80),
    originalAudioVolume: boundedVolume(audio.originalAudioVolume, 35),
  };
}

function collaboratorList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().replace(/^@/, ""))
      .filter((item) => /^[A-Za-z0-9._]{1,30}$/.test(item)),
  )].slice(0, 3);
}

function safeUrl(value: unknown) {
  return typeof value === "string" && value.startsWith("https://")
    ? value.slice(0, 1500)
    : "";
}

export async function PATCH(request: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const current = await getSocialPost(id);
  if (!current) return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
  if (current.status === "published" || current.status === "publishing") {
    return NextResponse.json({ error: "Esta publicação não pode mais ser editada." }, { status: 409 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const changes: UpdateSocialPostInput = {};
  if (typeof body.accountName === "string") {
    changes.accountName = body.accountName.trim().slice(0, 120);
  }
  if (isSocialFormat(body.format)) changes.format = body.format;
  if (typeof body.caption === "string") changes.caption = body.caption.trim().slice(0, 2200);
  const media = mediaAssets(body.media);
  if (media) changes.media = media;
  if (typeof body.shareToFeed === "boolean") changes.shareToFeed = body.shareToFeed;
  if (body.audio === null) changes.audio = null;
  else if (body.audio !== undefined) {
    const audio = audioSelection(body.audio);
    if (audio === undefined) {
      return NextResponse.json({ error: "Áudio selecionado inválido." }, { status: 400 });
    }
    changes.audio = audio;
  }
  if (typeof body.audioName === "string") {
    changes.audioName = body.audioName.trim().slice(0, 120);
  }
  if (typeof body.coverUrl === "string") changes.coverUrl = safeUrl(body.coverUrl);
  if (Array.isArray(body.collaborators)) {
    changes.collaborators = collaboratorList(body.collaborators);
  }
  if (typeof body.firstComment === "string") {
    changes.firstComment = body.firstComment.trim().slice(0, 2200);
  }
  if (typeof body.locationId === "string") {
    changes.locationId = body.locationId.trim().replace(/\D/g, "").slice(0, 40);
  }
  if (typeof body.altText === "string") changes.altText = body.altText.trim().slice(0, 1000);
  if (typeof body.isAiGenerated === "boolean") changes.isAiGenerated = body.isAiGenerated;
  if (body.status === "draft" || body.status === "scheduled") changes.status = body.status;
  if (body.scheduledAt === null) changes.scheduledAt = null;
  if (typeof body.scheduledAt === "string") {
    const date = new Date(body.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }
    changes.scheduledAt = date.toISOString();
  }

  const nextFormat = changes.format ?? current.format;
  const nextAudio = changes.audio === undefined ? current.audio : changes.audio;
  if (nextAudio && nextFormat !== "reel") {
    return NextResponse.json(
      { error: "A música da biblioteca do Instagram só pode ser anexada automaticamente a Reels." },
      { status: 400 },
    );
  }

  const nextStatus = changes.status ?? current.status;
  const nextScheduledAt =
    changes.scheduledAt === undefined ? current.scheduledAt : changes.scheduledAt;
  if (nextStatus === "scheduled") {
    if (!nextScheduledAt || new Date(nextScheduledAt).getTime() < Date.now() + 30_000) {
      return NextResponse.json({ error: "Escolha um horário futuro para agendar." }, { status: 400 });
    }
  }

  if (current.qstashMessageId) {
    await cancelSocialDelivery(current.qstashMessageId).catch(() => undefined);
    changes.qstashMessageId = "";
  }

  let post = await updateSocialPost(id, changes);
  if (!post) return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });

  let warning = "";
  if (post.status === "scheduled") {
    try {
      const messageId = await scheduleSocialDelivery(post);
      post = (await updateSocialPost(id, { qstashMessageId: messageId, errorMessage: "" }))!;
    } catch {
      warning = "Alterações salvas, mas o disparo automático não foi registrado.";
      post = (await updateSocialPost(id, { errorMessage: warning }))!;
    }
  }

  return NextResponse.json({ post, warning });
}

export async function DELETE(_: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const current = await getSocialPost(id);
  if (!current) return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
  if (current.qstashMessageId) {
    await cancelSocialDelivery(current.qstashMessageId).catch(() => undefined);
  }
  const deleted = await deleteSocialPost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Não foi possível excluir durante a publicação." }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
