import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateViralContent } from "@/lib/ai-content-generator";
import { isSocialFormat } from "@/lib/social-types";
import {
  isViralDatabaseConfigured,
  saveViralIdea,
} from "@/lib/viral-store";
import type { ViralProfile } from "@/lib/viral-types";

export const maxDuration = 45;

function text(value: unknown, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function profile(value: unknown): ViralProfile {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const contentPillars = Array.isArray(input.contentPillars)
    ? input.contentPillars
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 8)
    : [];

  return {
    instagramHandle: text(input.instagramHandle, 120),
    niche: text(input.niche, 180),
    audience: text(input.audience),
    tone: text(input.tone, 180),
    objective: text(input.objective),
    contentPillars,
    updatedAt: null,
  };
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !isSocialFormat(body.format)) {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  const topic = text(body.topic);
  const goal = text(body.goal);
  if (topic.length < 4) {
    return NextResponse.json(
      { error: "Descreva o tema do conteúdo com pelo menos quatro caracteres." },
      { status: 400 },
    );
  }

  try {
    const generated = await generateViralContent({
      format: body.format,
      topic,
      goal,
      extraContext: text(body.extraContext, 1800),
      profile: profile(body.profile),
    });

    const idea = body.save !== false && isViralDatabaseConfigured()
      ? await saveViralIdea({ format: body.format, topic, goal, generated })
      : null;

    return NextResponse.json({ generated, idea });
  } catch (error) {
    console.error("Viral generation failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o conteúdo.",
      },
      { status: 502 },
    );
  }
}
