import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteViralIdea,
  getViralDashboardData,
  isViralDatabaseConfigured,
  saveViralProfile,
  toggleViralMission,
} from "@/lib/viral-store";
import type { ViralProfile } from "@/lib/viral-types";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function profileFromBody(body: Record<string, unknown>): ViralProfile {
  const contentPillars = Array.isArray(body.contentPillars)
    ? body.contentPillars
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 8)
    : [];

  return {
    instagramHandle: clean(body.instagramHandle, 120).replace(/^@/, ""),
    niche: clean(body.niche, 180),
    audience: clean(body.audience),
    tone: clean(body.tone, 180) || "claro, humano e estratégico",
    objective: clean(body.objective) || "crescimento e geração de oportunidades",
    contentPillars,
    updatedAt: null,
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const database = isViralDatabaseConfigured();
  if (!database) {
    return NextResponse.json({
      profile: {
        instagramHandle: "",
        niche: "",
        audience: "",
        tone: "claro, humano e estratégico",
        objective: "crescimento e geração de oportunidades",
        contentPillars: [],
        updatedAt: null,
      },
      missions: [],
      ideas: [],
      stats: {
        viralScore: 0,
        missionCompletion: 0,
        missionPoints: 0,
        completedMissions: 0,
        totalMissions: 0,
        ideasCount: 0,
        averageIdeaScore: 0,
        streakDays: 0,
      },
      configuration: {
        database: false,
        gemini: Boolean((process.env.GEMINI_API_KEY ?? "").trim()),
        studio: true,
      },
    });
  }

  try {
    const data = await getViralDashboardData();
    return NextResponse.json({
      ...data,
      configuration: {
        database: true,
        gemini: Boolean((process.env.GEMINI_API_KEY ?? "").trim()),
        studio: true,
      },
    });
  } catch (error) {
    console.error("Viral dashboard GET failed", error);
    return NextResponse.json(
      { error: "Não foi possível carregar a Viral Machine." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!isViralDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  try {
    if (body.action === "saveProfile") {
      const profile = await saveViralProfile(profileFromBody(body));
      return NextResponse.json({ profile });
    }

    if (body.action === "toggleMission") {
      const id = clean(body.id, 100);
      if (!id) return NextResponse.json({ error: "Missão inválida." }, { status: 400 });
      await toggleViralMission(id, body.completed === true);
      const data = await getViralDashboardData();
      return NextResponse.json({ missions: data.missions, stats: data.stats });
    }

    if (body.action === "deleteIdea") {
      const id = clean(body.id, 100);
      if (!id) return NextResponse.json({ error: "Ideia inválida." }, { status: 400 });
      const ok = await deleteViralIdea(id);
      return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
    }

    return NextResponse.json({ error: "Ação desconhecida." }, { status: 400 });
  } catch (error) {
    console.error("Viral dashboard POST failed", error);
    return NextResponse.json(
      { error: "Não foi possível concluir a ação." },
      { status: 500 },
    );
  }
}
