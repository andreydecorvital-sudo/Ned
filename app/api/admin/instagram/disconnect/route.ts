import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteInstagramConnection } from "@/lib/instagram-connection";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  await deleteInstagramConnection();
  return NextResponse.json({ ok: true });
}
