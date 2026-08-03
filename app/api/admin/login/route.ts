import { NextResponse } from "next/server";
import {
  isAdminConfigured,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "O acesso administrativo ainda não foi configurado." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
