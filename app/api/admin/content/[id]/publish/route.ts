import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cancelSocialDelivery } from "@/lib/qstash-social";
import { processSocialPost } from "@/lib/publish-social-post";
import { getSocialPost } from "@/lib/social-store";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type RouteProps = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: RouteProps) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const current = await getSocialPost(id);
  if (!current) return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
  if (current.qstashMessageId) {
    await cancelSocialDelivery(current.qstashMessageId).catch(() => undefined);
  }

  try {
    const result = await processSocialPost(id, true);
    if (result.skipped) {
      return NextResponse.json({ error: "A publicação já está sendo processada ou foi publicada." }, { status: 409 });
    }
    return NextResponse.json({ post: result.post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao publicar no Instagram." },
      { status: 502 },
    );
  }
}
