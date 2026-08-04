import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getViralReviewSummary,
  isViralReviewDatabaseConfigured,
  saveViralReview,
  viralReviewVerdicts,
  type ViralReviewVerdict,
} from "@/lib/viral-review-store";

export const dynamic = "force-dynamic";

function text(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function tagsFrom(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""))
      .filter(Boolean),
  )].slice(0, 8);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!isViralReviewDatabaseConfigured()) {
    return NextResponse.json({
      summary: {
        total: 0,
        approved: 0,
        revise: 0,
        rejected: 0,
        topTags: [],
        recent: [],
      },
    });
  }

  try {
    return NextResponse.json({ summary: await getViralReviewSummary() });
  } catch (error) {
    console.error("Viral review summary failed", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os feedbacks." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!isViralReviewDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const verdict = body?.verdict;
  if (
    !body ||
    typeof verdict !== "string" ||
    !viralReviewVerdicts.includes(verdict as ViralReviewVerdict)
  ) {
    return NextResponse.json({ error: "Decisão de revisão inválida." }, { status: 400 });
  }

  try {
    const review = await saveViralReview({
      ideaId: text(body.ideaId, 100) || null,
      verdict: verdict as ViralReviewVerdict,
      tags: tagsFrom(body.tags),
      note: text(body.note),
    });
    const summary = await getViralReviewSummary();
    return NextResponse.json({ review, summary }, { status: 201 });
  } catch (error) {
    console.error("Viral review save failed", error);
    return NextResponse.json(
      { error: "Não foi possível registrar a revisão." },
      { status: 500 },
    );
  }
}
