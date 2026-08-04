import { NextResponse } from "next/server";
import { processSocialPost } from "@/lib/publish-social-post";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(request: Request) {
  const expected = (process.env.SOCIAL_PUBLISH_SECRET ?? "").trim();
  return Boolean(expected) && request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { postId?: string } | null;
  if (!body?.postId) {
    return NextResponse.json({ error: "postId obrigatório." }, { status: 400 });
  }

  try {
    const result = await processSocialPost(body.postId, false);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao publicar." },
      { status: 500 },
    );
  }
}
