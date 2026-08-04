import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { searchInstagramAudio } from "@/lib/instagram-publisher";
import { isSocialAudioType } from "@/lib/social-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "music";
  if (!isSocialAudioType(type)) {
    return NextResponse.json({ error: "Tipo de áudio inválido." }, { status: 400 });
  }

  try {
    const audio = await searchInstagramAudio({
      type,
      query: searchParams.get("q")?.trim() || undefined,
      limit: 24,
    });
    return NextResponse.json({ audio });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao buscar áudio.";
    const unavailable = message === "INSTAGRAM_NOT_CONFIGURED";
    return NextResponse.json(
      {
        error: unavailable
          ? "Conecte uma conta profissional do Instagram pelo Facebook Login para usar músicas."
          : message,
      },
      { status: unavailable ? 503 : 502 },
    );
  }
}
