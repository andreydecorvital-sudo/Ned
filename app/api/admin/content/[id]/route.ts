import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cancelSocialDelivery, scheduleSocialDelivery } from "@/lib/qstash-social";
import {
  deleteSocialPost,
  getSocialPost,
  updateSocialPost,
} from "@/lib/social-store";
import {
  isSocialFormat,
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
      typeof asset.size === "number"
    );
  });
  return valid.length === value.length ? valid : undefined;
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
  if (typeof body.accountName === "string") changes.accountName = body.accountName.trim().slice(0, 120);
  if (isSocialFormat(body.format)) changes.format = body.format;
  if (typeof body.caption === "string") changes.caption = body.caption.trim().slice(0, 2200);
  const media = mediaAssets(body.media);
  if (media) changes.media = media;
  if (typeof body.shareToFeed === "boolean") changes.shareToFeed = body.shareToFeed;
  if (body.status === "draft" || body.status === "scheduled") changes.status = body.status;
  if (body.scheduledAt === null) changes.scheduledAt = null;
  if (typeof body.scheduledAt === "string") {
    const date = new Date(body.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    }
    changes.scheduledAt = date.toISOString();
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
