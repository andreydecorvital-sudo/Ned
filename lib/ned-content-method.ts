import type { SocialFormat } from "@/lib/social-types";
import { generateViralContent } from "@/lib/ai-content-generator";
import { scoreViralContent } from "@/lib/viral-score";
import type {
  GeneratedViralContent,
  ViralProfile,
} from "@/lib/viral-types";

export type NedMethodInput = {
  format: SocialFormat;
  topic: string;
  goal: string;
  angle: string;
  mandatoryContext: string;
  profile: ViralProfile;
};

export type MethodAssessment = {
  clarity: number;
  relevance: number;
  conversion: number;
  readiness: number;
  priority: string;
};

export type NedMethodResult = {
  content: GeneratedViralContent;
  direction: {
    name: string;
    rationale: string;
  };
  formatPlan: string[];
  visualDirection: string;
  reviewQuestions: string[];
  assessment: MethodAssessment;
  assistantRequested: boolean;
  assistantUsed: boolean;
};

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function titleCase(value: string) {
  const normalized = clean(value);
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "Conteúdo estratégico";
}

function hashtag(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 34);
  return normalized ? `#${normalized}` : "";
}

function chooseCta(goal: string) {
  const normalized = goal.toLowerCase();
  if (/(lead|direct|whatsapp|conversa)/.test(normalized)) {
    return "Envie uma mensagem com a palavra ANÁLISE para conversar sobre o seu cenário.";
  }
  if (/(oferta|venda|comercial|solução)/.test(normalized)) {
    return "Quer entender como aplicar isso no seu negócio? Chame a NED e conte o seu objetivo.";
  }
  if (/(autoridade|confiança)/.test(normalized)) {
    return "Salve para consultar quando for revisar sua estratégia e compartilhe com quem toma essa decisão com você.";
  }
  if (/(engaj|coment|compartilh|salv)/.test(normalized)) {
    return "Qual desses pontos mais aparece na sua rotina? Responda nos comentários.";
  }
  return "Salve esta ideia e compartilhe com alguém que precisa organizar essa etapa.";
}

function directionFromAngle(angle: string) {
  const normalized = angle.toLowerCase();
  if (normalized.includes("erro")) {
    return {
      name: "Diagnóstico direto",
      rationale: "Começa por um erro reconhecível, explica o impacto e entrega uma correção aplicável.",
    };
  }
  if (normalized.includes("passo")) {
    return {
      name: "Aplicação prática",
      rationale: "Organiza o assunto em uma sequência simples para aumentar clareza e salvamentos.",
    };
  }
  if (normalized.includes("opini")) {
    return {
      name: "Posicionamento",
      rationale: "Defende uma visão clara e usa argumento para construir diferenciação e autoridade.",
    };
  }
  if (normalized.includes("bastidor")) {
    return {
      name: "Bastidor com aprendizado",
      rationale: "Mostra uma decisão real e transforma processo em prova de raciocínio estratégico.",
    };
  }
  if (normalized.includes("obje")) {
    return {
      name: "Quebra de objeção",
      rationale: "Responde a resistência principal antes de apresentar a próxima ação.",
    };
  }
  return {
    name: "Oferta contextualizada",
    rationale: "Conecta um problema real à solução sem transformar a peça em anúncio vazio.",
  };
}

function formatPlan(input: NedMethodInput) {
  const topic = titleCase(input.topic);
  const audience = clean(input.profile.audience) || "o público certo";
  const context = clean(input.mandatoryContext);

  if (input.format === "carousel") {
    return [
      `Capa — ${topic}`,
      `Slide 2 — Situação que ${audience} reconhece imediatamente`,
      "Slide 3 — O erro ou crença que mantém o problema",
      "Slide 4 — Consequência prática no marketing ou nas vendas",
      "Slide 5 — Mudança de perspectiva proposta pela NED",
      "Slide 6 — Passos objetivos para começar a corrigir",
      `Slide 7 — CTA único${context ? ` conectado a: ${context}` : ""}`,
    ];
  }

  if (input.format === "story") {
    return [
      `Story 1 — Pergunta ou afirmação: ${topic}`,
      "Story 2 — Mostrar o problema com uma situação cotidiana",
      "Story 3 — Explicar o ponto que costuma passar despercebido",
      "Story 4 — Entregar uma orientação curta e aplicável",
      "Story 5 — Abrir enquete, caixa de pergunta ou conversa no WhatsApp",
    ];
  }

  if (input.format === "reel") {
    return [
      `Abertura opcional em vídeo — ${topic}`,
      "Cena 2 — Exemplo visual do problema",
      "Cena 3 — Explicação em uma ideia central",
      "Cena 4 — Aplicação prática ou contraste antes/depois",
      "Encerramento — CTA curto e sem promessa exagerada",
    ];
  }

  return [
    `Headline da arte — ${topic}`,
    "Linha de apoio — tornar o benefício ou tensão mais específico",
    "Legenda — contexto, orientação prática e próxima ação",
    "Direção visual — uma imagem principal, hierarquia forte e poucos elementos",
  ];
}

function localContent(input: NedMethodInput): GeneratedViralContent {
  const topic = titleCase(input.topic);
  const niche = clean(input.profile.niche) || "marketing";
  const audience = clean(input.profile.audience) || "empresas que querem crescer";
  const mandatory = clean(input.mandatoryContext);
  const cta = chooseCta(input.goal);
  const direction = directionFromAngle(input.angle);

  const hooks = [
    `${topic}: o ponto que costuma ser ignorado`,
    `Antes de investir mais em ${niche}, organize isso`,
    `O erro que faz ${audience} perder clareza na hora de comunicar`,
  ];

  const bodyByFormat: Record<SocialFormat, string[]> = {
    carousel: [
      hooks[0],
      "",
      "Conteúdo não precisa apenas ocupar espaço no calendário. Ele precisa ajudar a pessoa certa a entender um problema, reconhecer valor e saber qual passo dar depois.",
      "",
      `A direção escolhida para esta peça é ${direction.name.toLowerCase()}:`,
      "— começar por uma situação que o público reconhece;",
      "— explicar por que o problema continua acontecendo;",
      "— entregar uma orientação que possa ser aplicada;",
      "— terminar com uma única próxima ação.",
      mandatory ? `\nPonto obrigatório: ${mandatory}` : "",
      "",
      cta,
    ],
    feed: [
      hooks[1],
      "",
      `Em ${niche}, uma mensagem forte não nasce de mais informação. Ela nasce de uma escolha clara: o que ${audience} precisa entender agora?`,
      "",
      "Uma boa peça estática combina uma headline específica, um visual que sustenta a ideia e uma legenda que aprofunda sem repetir a arte.",
      mandatory ? `\nNesta comunicação, o ponto que não pode faltar é: ${mandatory}` : "",
      "",
      cta,
    ],
    story: [
      hooks[2],
      "",
      "Story 1: apresente a tensão em uma frase.",
      "Story 2: mostre onde ela aparece na rotina.",
      "Story 3: explique o que precisa mudar.",
      "Story 4: entregue uma orientação curta.",
      "Story 5: convide para responder ou conversar.",
      mandatory ? `\nInclua: ${mandatory}` : "",
      "",
      cta,
    ],
    reel: [
      hooks[0],
      "",
      "Use o vídeo apenas quando movimento, demonstração ou fala adicionarem algo que uma peça estática não entregaria.",
      "",
      "Abra com o problema, mostre um exemplo, explique uma ideia e encerre com uma ação simples.",
      mandatory ? `\nPonto obrigatório: ${mandatory}` : "",
      "",
      cta,
    ],
  };

  const caption = bodyByFormat[input.format].filter(Boolean).join("\n");
  const hashtags = [
    hashtag(niche),
    hashtag(input.profile.contentPillars[0] || "estrategia de marketing"),
    hashtag(input.profile.contentPillars[1] || "conteudo estrategico"),
    "#marketingparanegocios",
    "#comunicacaodemarca",
  ].filter(Boolean);

  const scored = scoreViralContent({
    format: input.format,
    caption,
    hashtags,
    cta,
  });

  return {
    title: topic.slice(0, 120),
    hooks,
    caption,
    hashtags: [...new Set(hashtags)].slice(0, 8),
    cta,
    firstComment: "Qual parte dessa comunicação você sente que precisa organizar primeiro?",
    score: scored.score,
    checklist: scored.checklist,
    improvements: scored.improvements,
    provider: "fallback",
  };
}

function assess(content: GeneratedViralContent, input: NedMethodInput): MethodAssessment {
  const clarity = Math.round(
    ((content.checklist.clarity + content.checklist.readability + content.checklist.formatFit) / 25) * 100,
  );
  const relevanceBase = content.checklist.value + content.checklist.retention;
  const contextBonus = input.profile.audience.trim() && input.profile.niche.trim() ? 10 : 4;
  const relevance = Math.min(100, Math.round((relevanceBase / 30) * 90 + contextBonus));
  const conversion = Math.round(
    ((content.checklist.cta + content.checklist.interaction) / 20) * 100,
  );
  const readiness = Math.round(clarity * 0.4 + relevance * 0.35 + conversion * 0.25);

  const lowest = [
    [clarity, "Torne a mensagem mais simples e reduza elementos que disputam atenção."],
    [relevance, "Conecte a ideia a uma dor, desejo ou situação mais específica do público."],
    [conversion, "Defina uma única ação e deixe claro por que vale a pena executá-la."],
  ] as const;

  return {
    clarity,
    relevance,
    conversion,
    readiness,
    priority: [...lowest].sort((a, b) => a[0] - b[0])[0][1],
  };
}

function visualDirection(input: NedMethodInput) {
  const formatDirections: Record<SocialFormat, string> = {
    carousel:
      "Editorial e modular: capa com contraste forte, um argumento por slide, bastante respiro e progressão visual clara.",
    feed:
      "Peça estática com uma imagem ou conceito central, headline dominante e poucos elementos de apoio. Evitar aparência de card de aplicativo.",
    story:
      "Sequência vertical com ritmo entre telas, alternando texto curto, prova visual, interação e CTA. Evitar repetir o mesmo layout cinco vezes.",
    reel:
      "Vídeo opcional e funcional: cortes apenas quando ajudam a compreensão, texto na tela legível e nenhuma dependência de trend vazia.",
  };
  return formatDirections[input.format];
}

export async function buildNedMethodResult(
  input: NedMethodInput,
  useAssistant: boolean,
): Promise<NedMethodResult> {
  const assistantAvailable = Boolean((process.env.GEMINI_API_KEY ?? "").trim());
  const content = useAssistant
    ? await generateViralContent({
        format: input.format,
        topic: input.topic,
        goal: input.goal,
        extraContext: [input.angle, input.mandatoryContext].filter(Boolean).join("\n\n"),
        profile: input.profile,
      })
    : localContent(input);

  const direction = directionFromAngle(input.angle);
  return {
    content,
    direction,
    formatPlan: formatPlan(input),
    visualDirection: visualDirection(input),
    reviewQuestions: [
      "A pessoa certa entende a ideia principal em poucos segundos?",
      "A peça parece específica para esta marca ou poderia pertencer a qualquer empresa?",
      "Existe apenas uma próxima ação clara?",
      "O texto soa humano e natural depois da sua revisão?",
      "O formato escolhido é realmente o melhor para esta mensagem?",
    ],
    assessment: assess(content, input),
    assistantRequested: useAssistant,
    assistantUsed: useAssistant && assistantAvailable && content.provider === "gemini",
  };
}
