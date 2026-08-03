import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "ned_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  exp: number;
  role: "admin";
};

function adminPassword() {
  return (process.env.NED_ADMIN_PASSWORD ?? "").trim();
}

function sessionSecret() {
  return (process.env.NED_ADMIN_SESSION_SECRET ?? "").trim();
}

export function isAdminConfigured() {
  return adminPassword().length >= 10 && sessionSecret().length >= 32;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminPassword(value: string) {
  const configured = adminPassword();
  return Boolean(configured) && safeEqual(value, configured);
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createSessionToken() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    role: "admin",
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

function verifySessionToken(token: string) {
  if (!isAdminConfigured()) return false;
  const [encoded, receivedSignature] = token.split(".");
  if (!encoded || !receivedSignature) return false;

  const expectedSignature = signature(encoded);
  if (!safeEqual(receivedSignature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.role === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
