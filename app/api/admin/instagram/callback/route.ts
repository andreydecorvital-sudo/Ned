import { NextRequest, NextResponse } from "next/server";
import { connectInstagramWithAuthorizationCode } from "@/lib/instagram-oauth";

const STATE_COOKIE = "ned_instagram_oauth_state";

export const dynamic = "force-dynamic";

function contentUrl(status: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(`/admin/conteudo?instagram=${encodeURIComponent(status)}`, siteUrl);
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const expectedState = request.cookies.get(STATE_COOKIE)?.value ?? "";
  const code = request.nextUrl.searchParams.get("code") ?? "";
  const providerError =
    request.nextUrl.searchParams.get("error_description") ||
    request.nextUrl.searchParams.get("error_message") ||
    request.nextUrl.searchParams.get("error");

  let status = "error";
  if (providerError) {
    status = "cancelled";
  } else if (!state || !expectedState || state !== expectedState) {
    status = "invalid-state";
  } else if (!code) {
    status = "missing-code";
  } else {
    try {
      await connectInstagramWithAuthorizationCode(code);
      status = "connected";
    } catch (error) {
      console.error("Instagram OAuth callback failed", error);
      status =
        error instanceof Error &&
        error.message === "INSTAGRAM_PROFESSIONAL_ACCOUNT_NOT_FOUND"
          ? "professional-account-required"
          : "error";
    }
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
