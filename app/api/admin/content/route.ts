import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isInstagramPublishingConfigured } from "@/lib/instagram-publisher";
import { isSocialSchedulerConfigured, scheduleSocialDelivery } from "@/lib/qstash-social";
import {
  createSocialPost,
  isSocialDatabaseConfigured,
  listSocialPosts,
  updateSocialPost,
} from "@/lib/social-store";
import {
  isSocialFormat,
  type CreateSocialPostInput,
  type SocialMediaAsset,
} from "@/lib/social-types";

export const dynamic = "force-dynamic";

function isMediaAsset(value: unknown): value is SocialMediaAsset {
  if (!value || typeof value !== "object") return false;
  const asset = value as Partial<SocialMediaAsset>;
  return (
    typeof asset.url === "string" &&
    asset.url.startsWith("https://") &&
    typeof asset.pathname === "string" &&
    typeof asset.contentType === "string" &&
    typeof asset.size === "number" &&
    Number.isFinite(asset.size)
  );
}

function validateInput(value: unknown): { input?: CreateSocialPostInput; error?: string } {
  if (!value || typeof value !== "object") return { error: "Dados da publicação inválidos." };
  const body = value as Record<string, unknown>;
  if (!isSocialFormat(body.format)) return { error: "Formato de publicação inválido." };

  const media = Array.isArray(body.media) ? body.media.filter(isMediaAsset) : [];
  if (!media.length) return { error: "Adicione pelo menos uma imagem ou vídeo." };
  if (body.format === "carousel" && (media.length < 2 || media.length > 10)) {
    return { error: "O carrossel precisa ter entre 2 e 10 mídias." };
  }
  if (body.format !== "carousel" && media.length !== 1) {
    return { error: "Este formato aceita somente uma mídia." };
  }
  if (body.format === "feed" && media[0].contentType.startsWith("video/")) {
    return { error: "Para vídeo, selecione o formato Reel." };
  }
  if (body.format === "reel" && !media[0].contentType.startsWith("video/")) {
    return { error: "Reel precisa de um arquivo de vídeo." };
  }

  const caption = typeof body.caption === "string" ? body.caption.trim().slice(0, 2200) : "";
  const accountName =
    typeof body.accountName === "string" && body.accountName.trim()
      ? body.accountName.trim().slice(0, 120)
      : "NED Marketing";
  const status = body.status === "scheduled" ? "scheduled" : "draft";
  const scheduledAt = typeof body.scheduledAt === "string" && body.scheduledAt
    ? new Date(body.scheduledAt)
    : null;

  if (status === "scheduled") {
    if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
      return { error: "Escolha uma data e horário válidos." };
    }
    if (scheduledAt.getTime() < Date.now() + 30_000) {
      return { error: "O agendamento precisa estar pelo menos 30 segundos no futuro." };
    }
  }

  return {
    input: {
      accountName,
      format: body.format,
      caption,
      media,
      scheduledAt: scheduledAt?.toISOString() ?? null,
      status,
      shareToFeed: body.shareToFeed !== false,
    },
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const databaseConfigured = isSocialDatabaseConfigured();
  const posts = databaseConfigured ? await listSocialPosts() : [];
  return NextResponse.json({
    posts,
    configuration: {
      database: databaseConfigured,
      blob: Boolean((process.env.BLOB_READ_WRITE_TOKEN ?? "").trim()),
      instagram: isInstagramPublishingConfigured(),
      scheduler: isSocialSchedulerConfigured(),
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!isSocialDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  const parsed = validateInput(await request.json().catch(() => null));
  if (!parsed.input) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let post = await createSocialPost(parsed.input);
  let warning = "";

  if (post.status === "scheduled") {
    try {
      const messageId = await scheduleSocialDelivery(post);
      post = (await updateSocialPost(post.id, {
        qstashMessageId: messageId,
        errorMessage: "",
      }))!;
    } catch (error) {
      warning =
        error instanceof Error && error.message === "QSTASH_NOT_CONFIGURED"
          ? "Publicação salva, mas o agendador ainda não está configurado."
          : "Publicação salva, mas não foi possível registrar o disparo automático.";
      post = (await updateSocialPost(post.id, { errorMessage: warning }))!;
    }
  }

  return NextResponse.json({ post, warning }, { status: 201 });
}
