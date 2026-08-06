import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  buildInstagramAuthorizationUrl,
  createInstagramOAuthState,
  isInstagramOAuthConfigured,
} from "@/lib/instagram-oauth";

const STATE_COOKIE = "ned_instagram_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(
      new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!isInstagramOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/admin/conteudo?instagram=missing-config", siteUrl),
    );
  }

  const state = createInstagramOAuthState();
  const response = NextResponse.redirect(buildInstagramAuthorizationUrl(state));
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: STATE_TTL_SECONDS,
  });
  return response;
}
