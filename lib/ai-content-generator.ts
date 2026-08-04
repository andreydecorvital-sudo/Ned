import type { SocialFormat } from "@/lib/social-types";
import type { GeneratedViralContent, ViralProfile } from "@/lib/viral-types";
import { scoreViralContent } from "@/lib/viral-score";

export type GenerateViralContentInput = {
  format: SocialFormat;
  topic: string;
  goal: string;
  extraContext: string;
  profile: ViralProfile;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

function cleanHashtag(value: string) {
  const cleaned = value.trim().replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "");
  return cleaned ? `#${cleaned}` : "";
}

function asStringArray(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function parseJsonBlock(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Resposta da IA sem JSON válido.");
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

function fallbackContent(input: GenerateViralContentInput): GeneratedViralContent {
  const topic = input.topic.trim() || "crescimento no Instagram";
  const niche = input.profile.niche.trim() || "seu mercado";
  const audience = input.profile.audience.trim() || "seu público";
  const goal = input.goal.trim() || "gerar conversas";
  const hooks = [
    `O erro que impede ${audience} de perceber seu valor`,
    `Antes de publicar sobre ${topic}, faça isso`,
    `${topic}: o que muda quando existe estratégia`,
  ];
  const cta = "Salve este conteúdo e compartilhe com alguém que precisa aplicar isso.";
  const caption = [
    hooks[0],
    "",
    `Em ${niche}, aparecer não é suficiente. O conteúdo precisa deixar claro por que a marca merece atenção e qual transformação entrega.`,
    "",
    `Para usar ${topic} com mais intenção:`,
    "— comece com um problema que o público reconhece;",
    "— desenvolva uma ideia por vez;",
    "— mostre uma aplicação prática;",
    `— conduza a pessoa para ${goal}.`,
    "",
    "Conteúdo forte não depende apenas de frequência. Ele combina clareza, relevância e uma próxima ação.",
    "",
    cta,
  ].join("\n");
  const hashtags = [niche, topic, "marketingdigital", "conteudoestrategico", "instagramparanegocios"]
    .map(cleanHashtag)
    .filter(Boolean)
    .slice(0, 8);
  const scored = scoreViralContent({ format: input.format, caption, hashtags, cta });
  return {
    title: `Ideia sobre ${topic}`,
    hooks,
    caption,
    hashtags,
    cta,
    firstComment: "Qual parte dessa estratégia você mais precisa melhorar hoje?",
    score: scored.score,
    checklist: scored.checklist,
    improvements: scored.improvements,
    provider: "fallback",
  };
}

function buildPrompt(input: GenerateViralContentInput) {
  const formatGuidance: Record<SocialFormat, string> = {
    feed: "Legenda editorial clara, com profundidade moderada e leitura escaneável.",
    carousel: "Legenda que complemente os slides, gere salvamentos e convide a avançar pelo conteúdo.",
    reel: "Legenda curta e ritmada, com primeira linha forte e incentivo a assistir, salvar ou compartilhar.",
    story: "Texto muito direto, conversacional e compatível com sequência de Stories.",
  };

  return `Você é um estrategista de conteúdo brasileiro especializado em Instagram. Crie conteúdo persuasivo sem prometer viralização ou resultados garantidos.

PERFIL DA CONTA
- Instagram: ${input.profile.instagramHandle || "não informado"}
- Nicho: ${input.profile.niche || "não informado"}
- Público: ${input.profile.audience || "não informado"}
- Tom: ${input.profile.tone || "claro, humano e estratégico"}
- Objetivo principal: ${input.profile.objective || "crescimento e geração de oportunidades"}
- Pilares: ${input.profile.contentPillars.join(", ") || "não informados"}

CONTEÚDO
- Formato: ${input.format}
- Direção do formato: ${formatGuidance[input.format]}
- Tema: ${input.topic}
- Objetivo desta publicação: ${input.goal}
- Contexto adicional: ${input.extraContext || "nenhum"}

REGRAS
1. Escreva em português do Brasil.
2. Gere 3 opções de gancho diferentes, específicas e sem clickbait enganoso.
3. A legenda deve ter blocos curtos, valor prático e uma única ideia central.
4. Use um CTA coerente com o objetivo, sem urgência falsa.
5. Gere entre 5 e 10 hashtags, misturando nicho, intenção e contexto; não use hashtags genéricas como #fyp ou #viral.
6. O primeiro comentário deve iniciar uma conversa real.
7. Não inclua hashtags dentro da legenda; devolva-as separadamente.
8. Retorne somente JSON válido, sem Markdown.

FORMATO JSON
{
  "title": "título interno curto",
  "hooks": ["gancho 1", "gancho 2", "gancho 3"],
  "caption": "legenda completa usando o melhor gancho",
  "hashtags": ["hashtag1", "hashtag2"],
  "cta": "CTA principal",
  "firstComment": "primeiro comentário"
}`;
}

export async function generateViralContent(
  input: GenerateViralContentInput,
): Promise<GeneratedViralContent> {
  const apiKey = (process.env.GEMINI_API_KEY ?? "").trim();
  if (!apiKey) return fallbackContent(input);

  const model = (process.env.GEMINI_MODEL ?? "gemini-3.5-flash").trim();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: {
          temperature: 0.82,
          topP: 0.92,
          maxOutputTokens: 1800,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(35_000),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as GeminiResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || "Não foi possível gerar conteúdo com o Gemini.");
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("O Gemini não retornou conteúdo.");

  const parsed = parseJsonBlock(text);
  const hooks = asStringArray(parsed.hooks, 3);
  const caption = typeof parsed.caption === "string" ? parsed.caption.trim().slice(0, 2200) : "";
  const cta = typeof parsed.cta === "string" ? parsed.cta.trim().slice(0, 300) : "";
  const hashtags = asStringArray(parsed.hashtags, 12).map(cleanHashtag).filter(Boolean);
  if (!caption || !hooks.length) throw new Error("A resposta do Gemini veio incompleta.");

  const scored = scoreViralContent({ format: input.format, caption, hashtags, cta });
  return {
    title:
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim().slice(0, 120)
        : input.topic.slice(0, 120),
    hooks,
    caption,
    hashtags,
    cta,
    firstComment:
      typeof parsed.firstComment === "string"
        ? parsed.firstComment.trim().slice(0, 600)
        : "Qual parte mais chamou sua atenção?",
    score: scored.score,
    checklist: scored.checklist,
    improvements: scored.improvements,
    provider: "gemini",
  };
}
