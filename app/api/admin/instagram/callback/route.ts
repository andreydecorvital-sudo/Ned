import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/admin-auth";
import { connectInstagramWithAuthorizationCode } from "@/lib/instagram-oauth";

const STATE_COOKIE = "ned_instagram_oauth_state";

export const dynamic = "force-dynamic";

function contentUrl(status: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(`/admin/conteudo?instagram=${encodeURIComponent(status)}`, siteUrl);
}

function callbackStatus(error: unknown) {
  if (!(error instanceof Error)) return "error";
  if (error.message === "INSTAGRAM_PROFESSIONAL_ACCOUNT_NOT_FOUND") {
    return "professional-account-required";
  }
  if (error.message.startsWith("INSTAGRAM_PERMISSIONS_MISSING:")) {
    return "permissions-required";
  }
  if (error.message === "INSTAGRAM_OAUTH_NOT_CONFIGURED") {
    return "missing-config";
  }
  return "error";
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const expectedState = request.cookies.get(STATE_COOKIE)?.value ?? "";
  const code = request.nextUrl.searchParams.get("code") ?? "";
  const providerError =
    request.nextUrl.searchParams.get("error_description") ||
    request.nextUrl.searchParams.get("error_message") ||
    request.nextUrl.searchParams.get("error");

  const validState = Boolean(state && expectedState && state === expectedState);

  let status = "error";
  if (providerError) {
    status = "cancelled";
  } else if (!validState) {
    status = "invalid-state";
  } else if (!code) {
    status = "missing-code";
  } else {
    try {
      await connectInstagramWithAuthorizationCode(code);
      status = "connected";
    } catch (error) {
      console.error("Instagram OAuth callback failed", error);
      status = callbackStatus(error);
    }
  }

  // O fluxo foi iniciado dentro de uma sessão administrativa autenticada.
  // Após validar o state, renovamos a sessão no retorno da Meta para evitar
  // que navegadores descartem o cookie durante a navegação cross-site.
  if (validState) {
    await setAdminSession();
  }

  const response = NextResponse.redirect(contentUrl(status));
  response.cookies.set(STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
