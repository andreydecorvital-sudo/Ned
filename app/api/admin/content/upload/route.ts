import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdminAuthenticated())) throw new Error("Não autorizado.");
        if (!pathname.startsWith("ned-social/")) throw new Error("Caminho de upload inválido.");

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/quicktime",
          ],
          maximumSizeInBytes: 1024 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
          tokenPayload: JSON.stringify({ source: "ned-social-admin" }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.info("NED social upload completed", blob.pathname);
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha no upload." },
      { status: 400 },
    );
  }
}
