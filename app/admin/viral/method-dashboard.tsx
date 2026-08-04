"use client";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  FileCheck2,
  Gauge,
  Globe2,
  Library,
  Lightbulb,
  LoaderCircle,
  LogOut,
  MessageSquareText,
  PencilLine,
  Rocket,
  Save,
  Sparkles,
  Target,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { NedMethodResult } from "@/lib/ned-content-method";
import {
  socialFormatLabels,
  type SocialFormat,
} from "@/lib/social-types";
import { scoreViralContent } from "@/lib/viral-score";
import type {
  GeneratedViralContent,
  ViralDashboardData,
  ViralIdea,
  ViralProfile,
  ViralStudioDraft,
} from "@/lib/viral-types";
import styles from "./method-dashboard.module.css";

type Tab = "today" | "create" | "library" | "preferences";
type ReviewVerdict = "approved" | "revise" | "rejected";

type ReviewSummary = {
  total: number;
  approved: number;
  revise: number;
  rejected: number;
  topTags: Array<{ tag: string; count: number }>;
  recent: Array<{
    id: string;
    verdict: ReviewVerdict;
    tags: string[];
    note: string;
    createdAt: string;
  }>;
};

type DashboardResponse = Partial<ViralDashboardData> & { error?: string };
type MethodResponse = {
  result?: NedMethodResult;
  idea?: ViralIdea | null;
  error?: string;
};

const emptyProfile: ViralProfile = {
  instagramHandle: "",
  niche: "",
  audience: "",
  tone: "claro, humano e estratégico",
  objective: "crescimento e geração de oportunidades",
  contentPillars: [],
  updatedAt: null,
};

const emptyData: ViralDashboardData = {
  profile: emptyProfile,
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
    readyIdeas: 0,
    studioTransfers: 0,
    executionRate: 0,
    profileCompleteness: 0,
    streakDays: 0,
  },
  configuration: {
    database: false,
    gemini: false,
    studio: true,
  },
};

const emptyReviews: ReviewSummary = {
  total: 0,
  approved: 0,
  revise: 0,
  rejected: 0,
  topTags: [],
  recent: [],
};

const primaryFormats: SocialFormat[] = ["carousel", "feed", "story"];

const goalPresets = [
  { label: "Atrair atenção", value: "alcançar novas pessoas com uma ideia clara e compartilhável" },
  { label: "Construir autoridade", value: "demonstrar domínio do assunto e aumentar confiança" },
  { label: "Gerar relacionamento", value: "estimular respostas, salvamentos e conversas relevantes" },
  { label: "Captar leads", value: "iniciar conversas com potenciais clientes no direct ou WhatsApp" },
  { label: "Apresentar oferta", value: "conectar um problema real à solução e ao próximo passo comercial" },
] as const;

const anglePresets = [
  { label: "Erro comum", value: "Mostre um erro frequente, o impacto e como corrigir." },
  { label: "Passo a passo", value: "Organize a ideia em etapas práticas e fáceis de aplicar." },
  { label: "Opinião", value: "Defenda um ponto de vista claro, com argumento e contexto." },
  { label: "Bastidores", value: "Mostre processo, decisão, aprendizado ou construção real." },
  { label: "Objeção", value: "Responda a dúvida que impede o público de agir ou comprar." },
  { label: "Oferta útil", value: "Conecte a dor à solução sem transformar a peça em anúncio vazio." },
] as const;

const feedbackTags = [
  ["boa_direcao", "Boa direção"],
  ["parece_ia", "Parece IA"],
  ["texto_demais", "Texto demais"],
  ["cta_fraco", "CTA fraco"],
  ["mais_comercial", "Mais comercial"],
  ["mais_humano", "Mais humano"],
  ["mais_movimento", "Mais movimento"],
  ["manter_estilo", "Manter estilo"],
] as const;

const reviewQuestions = [
  ["clear", "A ideia principal é entendida rapidamente?"],
  ["specific", "O conteúdo parece específico para esta marca?"],
  ["action", "Existe uma única próxima ação clara?"],
] as const;

type ReviewCheck = (typeof reviewQuestions)[number][0];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function profileLabel(profile: ViralProfile) {
  if (profile.instagramHandle.trim()) {
    return `@${profile.instagramHandle.trim().replace(/^@/, "")}`;
  }
  return "NED Marketing";
}

function labelTag(tag: string) {
  return feedbackTags.find(([value]) => value === tag)?.[1] ?? tag.replace(/_/g, " ");
}

function formatPlanForIdea(idea: ViralIdea) {
  if (idea.format === "carousel") {
    return ["Capa", "Problema reconhecível", "Causa", "Consequência", "Direção", "Aplicação", "CTA"];
  }
  if (idea.format === "story") {
    return ["Gancho", "Situação", "Explicação", "Orientação", "Interação"];
  }
  if (idea.format === "reel") {
    return ["Abertura", "Exemplo", "Explicação", "Aplicação", "CTA"];
  }
  return ["Headline", "Linha de apoio", "Legenda", "CTA"];
}

function ideaAsMethodResult(idea: ViralIdea): NedMethodResult {
  const content: GeneratedViralContent = {
    title: idea.title,
    hooks: idea.hooks,
    caption: idea.caption,
    hashtags: idea.hashtags,
    cta: idea.cta,
    firstComment: idea.firstComment,
    score: idea.score,
    checklist: idea.checklist,
    improvements: [],
    provider: idea.provider === "gemini" ? "gemini" : "fallback",
  };
  const clarity = Math.round(
    ((idea.checklist.clarity + idea.checklist.readability + idea.checklist.formatFit) / 25) * 100,
  );
  const relevance = Math.round(
    ((idea.checklist.value + idea.checklist.retention) / 30) * 100,
  );
  const conversion = Math.round(
    ((idea.checklist.cta + idea.checklist.interaction) / 20) * 100,
  );
  return {
    content,
    direction: {
      name: "Revisão da biblioteca",
      rationale: "Conteúdo já criado, agora submetido ao método e à decisão humana antes da execução.",
    },
    formatPlan: formatPlanForIdea(idea),
    visualDirection: "Revise a hierarquia visual, elimine elementos sem função e preserve uma ideia principal por tela.",
    reviewQuestions: [],
    assessment: {
      clarity,
      relevance,
      conversion,
      readiness: Math.round(clarity * 0.4 + relevance * 0.35 + conversion * 0.25),
      priority: "Revise o ponto de menor nota antes de aprovar.",
    },
    assistantRequested: idea.provider === "gemini",
    assistantUsed: idea.provider === "gemini",
  };
}

export default function MethodDashboard() {
  const [data, setData] = useState<ViralDashboardData>(emptyData);
  const [profile, setProfile] = useState<ViralProfile>(emptyProfile);
  const [reviews, setReviews] = useState<ReviewSummary>(emptyReviews);
  const [tab, setTab] = useState<Tab>("today");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [missionBusy, setMissionBusy] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [format, setFormat] = useState<SocialFormat>("carousel");
  const [goal, setGoal] = useState<string>(goalPresets[3].value);
  const [angle, setAngle] = useState<string>(anglePresets[0].value);
  const [topic, setTopic] = useState("");
  const [mandatoryContext, setMandatoryContext] = useState("");
  const [useAssistant, setUseAssistant] = useState(false);

  const [result, setResult] = useState<NedMethodResult | null>(null);
  const [ideaId, setIdeaId] = useState<string | null>(null);
  const [selectedHook, setSelectedHook] = useState("");
  const [editedCaption, setEditedCaption] = useState("");
  const [editedFirstComment, setEditedFirstComment] = useState("");
  const [reviewChecks, setReviewChecks] = useState<Record<ReviewCheck, boolean>>({
    clear: false,
    specific: false,
    action: false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewVerdict, setReviewVerdict] = useState<ReviewVerdict | null>(null);
  const [reviewSaved, setReviewSaved] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [dashboardResponse, reviewResponse] = await Promise.all([
        fetch("/api/admin/viral", { cache: "no-store" }),
        fetch("/api/admin/viral/reviews", { cache: "no-store" }),
      ]);
      if (dashboardResponse.status === 401 || reviewResponse.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      const dashboardPayload = (await dashboardResponse.json()) as DashboardResponse;
      const reviewPayload = (await reviewResponse.json()) as {
        summary?: ReviewSummary;
        error?: string;
      };
      if (!dashboardResponse.ok || !dashboardPayload.profile || !dashboardPayload.stats) {
        setError(dashboardPayload.error ?? "Não foi possível carregar o Growth Studio.");
        return;
      }
      const next = dashboardPayload as ViralDashboardData;
      setData(next);
      setProfile(next.profile);
      if (reviewPayload.summary) setReviews(reviewPayload.summary);
    } catch {
      setError("Falha de conexão ao carregar o Growth Studio.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const topicSuggestions = useMemo(() => {
    const niche = profile.niche.trim() || "seu mercado";
    const audience = profile.audience.trim() || "seu público";
    const pillars = profile.contentPillars.length
      ? profile.contentPillars.slice(0, 3)
      : ["posicionamento", "conteúdo", "conversão"];
    return [
      `3 erros que ${audience} comete em ${pillars[0]}`,
      `O que ninguém explica sobre ${pillars[1] ?? pillars[0]} em ${niche}`,
      `Antes de investir mais, organize ${pillars[2] ?? pillars[0]}`,
      `Bastidores: como uma decisão de ${pillars[0]} muda o resultado`,
    ];
  }, [profile.audience, profile.contentPillars, profile.niche]);

  const recalculated = useMemo(() => {
    if (!result) return null;
    return scoreViralContent({
      format,
      caption: editedCaption,
      hashtags: result.content.hashtags,
      cta: result.content.cta,
    });
  }, [editedCaption, format, result]);

  const allReviewChecks = Object.values(reviewChecks).every(Boolean);
  const canExecute = reviewSaved && reviewVerdict === "approved" && allReviewChecks;

  const resetHumanReview = () => {
    setReviewChecks({ clear: false, specific: false, action: false });
    setSelectedTags([]);
    setReviewNote("");
    setReviewVerdict(null);
    setReviewSaved(false);
  };

  const receiveResult = (
    nextResult: NedMethodResult,
    nextIdeaId: string | null,
    nextFormat: SocialFormat,
  ) => {
    setFormat(nextFormat);
    setResult(nextResult);
    setIdeaId(nextIdeaId);
    setSelectedHook(nextResult.content.hooks[0] ?? "");
    setEditedCaption(nextResult.content.caption);
    setEditedFirstComment(nextResult.content.firstComment);
    resetHumanReview();
    setTab("create");
  };

  const saveProfile = async () => {
    if (!data.configuration.database || savingProfile) return;
    setSavingProfile(true);
    setError("");
    try {
      const response = await fetch("/api/admin/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProfile", ...profile }),
      });
      const payload = (await response.json()) as {
        profile?: ViralProfile;
        stats?: ViralDashboardData["stats"];
        error?: string;
      };
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok || !payload.profile) {
        setError(payload.error ?? "Não foi possível salvar o contexto da marca.");
        return;
      }
      setProfile(payload.profile);
      setData((current) => ({
        ...current,
        profile: payload.profile!,
        stats: payload.stats ?? current.stats,
      }));
      setNotice("Contexto salvo. O método usará essas informações nas próximas peças.");
    } catch {
      setError("Falha de conexão ao salvar o contexto.");
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleMission = async (id: string, completed: boolean) => {
    if (!data.configuration.database || missionBusy) return;
    setMissionBusy(id);
    setError("");
    try {
      const response = await fetch("/api/admin/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleMission", id, completed }),
      });
      const payload = (await response.json()) as DashboardResponse;
      if (!response.ok || !payload.missions || !payload.stats) {
        setError(payload.error ?? "Não foi possível atualizar a etapa.");
        return;
      }
      setData((current) => ({
        ...current,
        missions: payload.missions!,
        stats: payload.stats!,
      }));
    } catch {
      setError("Falha de conexão ao atualizar a etapa.");
    } finally {
      setMissionBusy("");
    }
  };

  const generate = async () => {
    if (generating) return;
    if (topic.trim().length < 4) {
      setError("Escolha uma pauta ou descreva o tema da peça.");
      return;
    }
    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/viral/method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          topic,
          goal,
          angle,
          mandatoryContext,
          profile,
          useAssistant,
          save: true,
        }),
      });
      const payload = (await response.json()) as MethodResponse;
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok || !payload.result) {
        setError(payload.error ?? "Não foi possível estruturar a peça.");
        return;
      }
      receiveResult(payload.result, payload.idea?.id ?? null, format);
      setNotice(
        payload.result.assistantUsed
          ? "O Gemini criou uma variação. Revise e aprove antes de executar."
          : "O Método NED estruturou a peça sem depender de IA externa.",
      );
      await load(true);
    } catch {
      setError("Falha de conexão ao estruturar o conteúdo.");
    } finally {
      setGenerating(false);
    }
  };

  const applyHook = (hook: string) => {
    setSelectedHook(hook);
    setEditedCaption((current) => {
      const lines = current.split("\n");
      const firstContentLine = lines.findIndex((line) => line.trim());
      if (firstContentLine < 0) return hook;
      lines[firstContentLine] = hook;
      return lines.join("\n");
    });
    setReviewSaved(false);
  };

  const toggleFeedbackTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag].slice(0, 8),
    );
    setReviewSaved(false);
  };

  const saveReview = async (verdict: ReviewVerdict) => {
    if (savingReview) return;
    if (verdict === "approved" && !allReviewChecks) {
      setError("Confirme os três critérios antes de aprovar a peça.");
      return;
    }
    setSavingReview(true);
    setError("");
    try {
      const response = await fetch("/api/admin/viral/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId,
          verdict,
          tags: selectedTags,
          note: reviewNote,
        }),
      });
      const payload = (await response.json()) as {
        summary?: ReviewSummary;
        error?: string;
      };
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok) {
        setError(payload.error ?? "Não foi possível registrar a revisão.");
        return;
      }
      setReviewVerdict(verdict);
      setReviewSaved(true);
      if (payload.summary) setReviews(payload.summary);
      setNotice(
        verdict === "approved"
          ? "Peça aprovada. A execução no Estúdio foi liberada."
          : verdict === "revise"
            ? "Revisão registrada. Edite o texto e aprove uma nova versão quando estiver pronta."
            : "Peça rejeitada. O motivo ficará registrado como aprendizado.",
      );
    } catch {
      setError("Falha de conexão ao registrar a revisão.");
    } finally {
      setSavingReview(false);
    }
  };

  const copyContent = async () => {
    if (!result) return;
    const content = [
      editedCaption.trim(),
      result.content.hashtags.join(" "),
      editedFirstComment.trim() ? `Primeiro comentário:\n${editedFirstComment.trim()}` : "",
    ].filter(Boolean).join("\n\n");
    try {
      await navigator.clipboard.writeText(content);
      setNotice("Texto revisado copiado.");
    } catch {
      setError("O navegador não permitiu copiar o conteúdo.");
    }
  };

  const openStudio = () => {
    if (!result || !canExecute) return;
    const draft: ViralStudioDraft = {
      ideaId,
      accountName: profileLabel(profile),
      format,
      title: result.content.title,
      caption: [editedCaption.trim(), result.content.hashtags.join(" ")]
        .filter(Boolean)
        .join("\n\n"),
      hashtags: result.content.hashtags,
      firstComment: editedFirstComment,
      score: recalculated?.score ?? result.content.score,
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem("ned_viral_studio_draft", JSON.stringify(draft));
    window.location.assign("/admin/viral/studio");
  };

  const reviewIdea = (idea: ViralIdea) => {
    receiveResult(ideaAsMethodResult(idea), idea.id, idea.format);
    setTopic(idea.topic);
    setGoal(idea.goal);
  };

  const deleteIdea = async (idea: ViralIdea) => {
    if (deletingId || !window.confirm(`Excluir a ideia “${idea.title}”?`)) return;
    setDeletingId(idea.id);
    setError("");
    try {
      const response = await fetch("/api/admin/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteIdea", id: idea.id }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Não foi possível excluir a ideia.");
        return;
      }
      setData((current) => ({
        ...current,
        ideas: current.ideas.filter((item) => item.id !== idea.id),
      }));
      setNotice("Ideia removida.");
      await load(true);
    } catch {
      setError("Falha de conexão ao excluir a ideia.");
    } finally {
      setDeletingId("");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <LoaderCircle className={styles.spin} />
        <p>Preparando o Growth Studio...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/admin/viral">
          <strong>NED</strong>
          <small>GROWTH STUDIO</small>
        </a>
        <nav aria-label="Navegação administrativa">
          <a href="/admin/leads">CRM</a>
          <a href="/admin/conteudo">Publicação</a>
          <a className={styles.active} href="/admin/viral">Growth Studio</a>
          <a href="/" target="_blank" rel="noreferrer"><Globe2 size={14} /> Site</a>
        </nav>
        <button className={styles.logout} type="button" onClick={logout}>
          <LogOut size={15} /> Sair
        </button>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <span>MÉTODO ANTES DA IA · MARKETING ANTES DO FORMATO</span>
            <h1>Planeje a mensagem.<em>Depois escolha a ferramenta.</em></h1>
          </div>
          <p>
            Carrosséis, posts e Stories são o centro do fluxo. O Gemini é apenas uma opção
            para rascunhos; a decisão final continua humana.
          </p>
        </section>

        <section className={styles.statusStrip}>
          <div className={styles.ready}><Target size={16} /><strong>Método NED</strong><small>Funciona sem IA externa</small></div>
          <div className={data.configuration.gemini ? styles.optional : styles.pending}><BrainCircuit size={16} /><strong>Gemini</strong><small>{data.configuration.gemini ? "Opcional e supervisionado" : "Não configurado"}</small></div>
          <div className={styles.ready}><FileCheck2 size={16} /><strong>Revisão humana</strong><small>Obrigatória para executar</small></div>
        </section>

        {!data.configuration.database && <div className={styles.warning}>Configure DATABASE_URL para salvar contexto, ideias e feedbacks.</div>}
        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tabs} role="tablist">
          <button className={tab === "today" ? styles.tabActive : ""} type="button" onClick={() => setTab("today")}><Gauge size={16} /> Hoje</button>
          <button className={tab === "create" ? styles.tabActive : ""} type="button" onClick={() => setTab("create")}><PencilLine size={16} /> Criar e revisar</button>
          <button className={tab === "library" ? styles.tabActive : ""} type="button" onClick={() => setTab("library")}><Library size={16} /> Biblioteca <span>{data.ideas.length}</span></button>
          <button className={tab === "preferences" ? styles.tabActive : ""} type="button" onClick={() => setTab("preferences")}><MessageSquareText size={16} /> Aprendizados <span>{reviews.total}</span></button>
        </div>

        {tab === "today" && (
          <div className={styles.todayGrid}>
            <section className={styles.actionCard}>
              <div><span>PRÓXIMA AÇÃO</span><h2>{data.stats.profileCompleteness < 70 ? "Complete o contexto da marca" : data.stats.readyIdeas === 0 ? "Estruture a primeira peça" : "Escolha uma ideia para revisar"}</h2></div>
              <p>{data.stats.profileCompleteness < 70 ? "O método precisa conhecer público, objetivo e pilares antes de produzir algo específico." : data.stats.readyIdeas === 0 ? "Comece por um objetivo comercial, depois escolha formato e abordagem." : "Ideia gerada não é conteúdo pronto. Abra uma peça, edite e registre sua decisão."}</p>
              <button type="button" onClick={() => setTab(data.stats.profileCompleteness < 70 ? "today" : data.stats.readyIdeas === 0 ? "create" : "library")}>Continuar <ArrowRight size={16} /></button>
            </section>

            <section className={styles.metricGrid}>
              <article><Target size={18} /><span>CONTEXTO</span><strong>{data.stats.profileCompleteness}%</strong><small>marca compreendida</small></article>
              <article><Sparkles size={18} /><span>IDEIAS</span><strong>{data.stats.ideasCount}</strong><small>rascunhos criados</small></article>
              <article><FileCheck2 size={18} /><span>REVISÕES</span><strong>{reviews.total}</strong><small>decisões humanas</small></article>
              <article><Rocket size={18} /><span>EXECUÇÃO</span><strong>{data.stats.executionRate}%</strong><small>ideias no estúdio</small></article>
            </section>

            <section className={styles.missionsCard}>
              <div className={styles.sectionTitle}><div><span>ROTINA DO DIA</span><h2>Atividade só conta quando termina em decisão.</h2></div><strong>{data.stats.missionPoints} XP</strong></div>
              <div className={styles.progressTrack}><span style={{ width: `${data.stats.missionCompletion}%` }} /></div>
              <div className={styles.missionList}>
                {data.missions.map((mission) => (
                  <button className={mission.completed ? styles.missionDone : styles.mission} type="button" key={mission.id} disabled={missionBusy === mission.id} onClick={() => void toggleMission(mission.id, !mission.completed)}>
                    <span className={styles.missionCheck}>{missionBusy === mission.id ? <LoaderCircle className={styles.spin} size={16} /> : mission.completed ? <Check size={16} /> : null}</span>
                    <span><strong>{mission.title}</strong><small>{mission.description}</small></span>
                    <b>+{mission.points}</b>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.profileCard}>
              <div className={styles.sectionTitle}><div><span>CONTEXTO DA MARCA · {data.stats.profileCompleteness}%</span><h2>Menos contexto gera conteúdo genérico.</h2></div></div>
              <div className={styles.formGrid}>
                <label><span>INSTAGRAM</span><input value={profile.instagramHandle} onChange={(event) => setProfile((current) => ({ ...current, instagramHandle: event.target.value }))} placeholder="@nedmarketing" /></label>
                <label><span>NICHO</span><input value={profile.niche} onChange={(event) => setProfile((current) => ({ ...current, niche: event.target.value }))} placeholder="Marketing para negócios locais" /></label>
                <label className={styles.fullField}><span>PÚBLICO</span><textarea value={profile.audience} onChange={(event) => setProfile((current) => ({ ...current, audience: event.target.value }))} placeholder="Quem precisa escolher esta marca e em qual situação?" /></label>
                <label><span>TOM DE VOZ</span><input value={profile.tone} onChange={(event) => setProfile((current) => ({ ...current, tone: event.target.value }))} /></label>
                <label><span>PILARES</span><input value={profile.contentPillars.join(", ")} onChange={(event) => setProfile((current) => ({ ...current, contentPillars: event.target.value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8) }))} placeholder="estratégia, conteúdo, conversão" /></label>
                <label className={styles.fullField}><span>OBJETIVO DO PERFIL</span><textarea value={profile.objective} onChange={(event) => setProfile((current) => ({ ...current, objective: event.target.value }))} /></label>
              </div>
              <button className={styles.primaryButton} type="button" onClick={() => void saveProfile()} disabled={savingProfile || !data.configuration.database}>{savingProfile ? <LoaderCircle className={styles.spin} size={16} /> : <Save size={16} />} Salvar contexto</button>
            </section>
          </div>
        )}

        {tab === "create" && (
          <div className={styles.createGrid}>
            <section className={styles.briefCard}>
              <div className={styles.sectionTitle}><div><span>BRIEFING ORIENTADO</span><h2>Comece pelo resultado, não pelo formato.</h2></div></div>

              <div className={styles.briefStep}><span>01 · OBJETIVO</span><div className={styles.choiceGrid}>{goalPresets.map((preset) => <button className={goal === preset.value ? styles.choiceActive : ""} type="button" key={preset.label} onClick={() => setGoal(preset.value)}>{preset.label}</button>)}</div></div>

              <div className={styles.briefStep}><span>02 · FORMATO PRINCIPAL</span><div className={styles.formatGrid}>{primaryFormats.map((item) => <button className={format === item ? styles.formatActive : ""} type="button" key={item} onClick={() => setFormat(item)}><strong>{socialFormatLabels[item]}</strong><small>{item === "carousel" ? "ensinar e argumentar" : item === "feed" ? "impacto visual e posicionamento" : "relacionamento e resposta"}</small></button>)}</div><details className={styles.optionalFormat}><summary>Vídeo/Reel é opcional</summary><button className={format === "reel" ? styles.formatActive : ""} type="button" onClick={() => setFormat("reel")}><strong>Reel</strong><small>usar somente quando movimento ou demonstração adicionarem valor</small></button></details></div>

              <div className={styles.briefStep}><span>03 · ABORDAGEM</span><div className={styles.angleGrid}>{anglePresets.map((preset) => <button className={angle === preset.value ? styles.angleActive : ""} type="button" key={preset.label} onClick={() => setAngle(preset.value)}><strong>{preset.label}</strong><small>{preset.value}</small></button>)}</div></div>

              <div className={styles.briefStep}><span>04 · PAUTA</span><div className={styles.suggestions}>{topicSuggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => setTopic(suggestion)}><Lightbulb size={14} /> {suggestion}</button>)}</div><label><textarea value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Escolha uma pauta ou escreva a sua." /></label><label><span>INFORMAÇÃO OBRIGATÓRIA</span><textarea value={mandatoryContext} onChange={(event) => setMandatoryContext(event.target.value)} placeholder="Oferta, restrição, exemplo, prazo ou opinião que não pode faltar." /></label></div>

              <label className={styles.assistantToggle}><input type="checkbox" checked={useAssistant} onChange={(event) => setUseAssistant(event.target.checked)} /><span><strong>Usar Gemini apenas como assistente de rascunho</strong><small>Desmarcado por padrão. O método local continua funcionando sem API.</small></span></label>

              <button className={styles.generateButton} type="button" onClick={() => void generate()} disabled={generating}>{generating ? <LoaderCircle className={styles.spin} size={18} /> : <WandSparkles size={18} />}{generating ? "Estruturando..." : "Estruturar peça com o Método NED"}</button>
            </section>

            <section className={styles.resultCard}>
              {!result ? (
                <div className={styles.emptyResult}><Target size={38} /><h2>A peça nasce do método.</h2><p>Escolha objetivo, formato, abordagem e pauta. A IA é opcional; a revisão humana não.</p></div>
              ) : (
                <>
                  <div className={styles.resultHeader}><div><span>{result.assistantUsed ? "VARIAÇÃO COM GEMINI · REVISÃO OBRIGATÓRIA" : "MÉTODO NED · SEM DEPENDÊNCIA DE IA"}</span><h2>{result.content.title}</h2></div><strong>{recalculated?.score ?? result.content.score}<small>/100</small></strong></div>

                  <section className={styles.directionBox}><span>DIREÇÃO ESCOLHIDA</span><h3>{result.direction.name}</h3><p>{result.direction.rationale}</p></section>

                  <section className={styles.assessmentGrid}><article><span>CLAREZA</span><strong>{result.assessment.clarity}</strong></article><article><span>RELEVÂNCIA</span><strong>{result.assessment.relevance}</strong></article><article><span>CONVERSÃO</span><strong>{result.assessment.conversion}</strong></article><article><span>PRONTIDÃO</span><strong>{result.assessment.readiness}</strong></article></section>

                  <section className={styles.planBox}><span>ESTRUTURA DA PEÇA</span>{result.formatPlan.map((item, index) => <p key={`${item}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b>{item}</p>)}</section>

                  <section className={styles.visualBox}><span>DIREÇÃO VISUAL</span><p>{result.visualDirection}</p></section>

                  <section className={styles.hookBox}><span>ESCOLHA O GANCHO</span>{result.content.hooks.map((hook, index) => <button className={selectedHook === hook ? styles.hookActive : ""} type="button" key={`${hook}-${index}`} onClick={() => applyHook(hook)}><b>0{index + 1}</b>{hook}</button>)}</section>

                  <label className={styles.editorField}><span>LEGENDA EDITÁVEL</span><textarea value={editedCaption} onChange={(event) => { setEditedCaption(event.target.value); setReviewSaved(false); }} /></label>
                  <label className={styles.editorField}><span>PRIMEIRO COMENTÁRIO</span><textarea value={editedFirstComment} onChange={(event) => { setEditedFirstComment(event.target.value); setReviewSaved(false); }} /></label>

                  <section className={styles.humanReview}>
                    <div className={styles.sectionTitle}><div><span>REVISÃO HUMANA</span><h2>Aprovação não pode ser automática.</h2></div></div>
                    <div className={styles.reviewChecks}>{reviewQuestions.map(([key, label]) => <label key={key}><input type="checkbox" checked={reviewChecks[key]} onChange={(event) => { setReviewChecks((current) => ({ ...current, [key]: event.target.checked })); setReviewSaved(false); }} /><span>{label}</span></label>)}</div>
                    <div className={styles.feedbackTags}>{feedbackTags.map(([value, label]) => <button className={selectedTags.includes(value) ? styles.feedbackActive : ""} type="button" key={value} onClick={() => toggleFeedbackTag(value)}>{label}</button>)}</div>
                    <label className={styles.editorField}><span>OBSERVAÇÃO</span><textarea value={reviewNote} onChange={(event) => { setReviewNote(event.target.value); setReviewSaved(false); }} placeholder="O que precisa ser mantido, removido ou melhorado?" /></label>
                    <div className={styles.verdictActions}><button type="button" onClick={() => void saveReview("rejected")} disabled={savingReview}>Rejeitar</button><button type="button" onClick={() => void saveReview("revise")} disabled={savingReview}>Pedir revisão</button><button className={styles.approveButton} type="button" onClick={() => void saveReview("approved")} disabled={savingReview || !allReviewChecks}>{savingReview ? <LoaderCircle className={styles.spin} size={16} /> : <CheckCircle2 size={16} />} Aprovar peça</button></div>
                  </section>

                  <div className={styles.resultActions}><button type="button" onClick={() => void copyContent()}><Clipboard size={15} /> Copiar texto</button><button className={styles.primaryButton} type="button" onClick={openStudio} disabled={!canExecute}><Rocket size={15} /> {canExecute ? "Levar ao Estúdio" : "Aprove para executar"}</button></div>
                </>
              )}
            </section>
          </div>
        )}

        {tab === "library" && (
          <section className={styles.librarySection}>
            <div className={styles.libraryHeader}><div><span>BIBLIOTECA</span><h2>Rascunhos aguardando decisão.</h2></div><p>{data.stats.studioTransfers} de {data.stats.ideasCount} ideias chegaram ao Estúdio.</p></div>
            {!data.ideas.length ? <div className={styles.emptyLibrary}><Library size={34} /><h3>Nenhuma ideia salva.</h3><button type="button" onClick={() => setTab("create")}>Criar primeira peça <ChevronRight size={15} /></button></div> : <div className={styles.ideaGrid}>{data.ideas.map((idea) => <article className={styles.ideaCard} key={idea.id}><div className={styles.ideaTop}><span>{socialFormatLabels[idea.format]}</span><strong>{idea.score}/100</strong></div><div className={styles.ideaState}>{idea.usedInStudio ? <><CheckCircle2 size={14} /> No Estúdio</> : <><Gauge size={14} /> Aguardando revisão</>}</div><h3>{idea.title}</h3><p>{idea.topic}</p><small>{idea.provider === "gemini" ? "Rascunho Gemini" : "Método local"} · {formatDate(idea.createdAt)}</small><div className={styles.ideaActions}><button type="button" onClick={() => reviewIdea(idea)}><PencilLine size={14} /> Revisar</button><button className={styles.deleteButton} type="button" disabled={deletingId === idea.id} onClick={() => void deleteIdea(idea)}><Trash2 size={14} /></button></div></article>)}</div>}
          </section>
        )}

        {tab === "preferences" && (
          <div className={styles.preferencesGrid}>
            <section className={styles.preferenceSummary}><div className={styles.sectionTitle}><div><span>APRENDIZADOS REGISTRADOS</span><h2>O sistema aprende com suas decisões, não com confiança cega na IA.</h2></div></div><div className={styles.reviewMetrics}><article><span>APROVADAS</span><strong>{reviews.approved}</strong></article><article><span>REVISAR</span><strong>{reviews.revise}</strong></article><article><span>REJEITADAS</span><strong>{reviews.rejected}</strong></article></div><div className={styles.topTags}><span>SINAIS MAIS FREQUENTES</span>{reviews.topTags.length ? reviews.topTags.map((item) => <div key={item.tag}><strong>{labelTag(item.tag)}</strong><span>{item.count}</span></div>) : <p>Os primeiros padrões aparecerão depois das revisões.</p>}</div></section>
            <section className={styles.recentReviews}><div className={styles.sectionTitle}><div><span>HISTÓRICO</span><h2>Decisões recentes.</h2></div></div>{reviews.recent.length ? reviews.recent.map((review) => <article key={review.id}><div><strong>{review.verdict === "approved" ? "Aprovada" : review.verdict === "revise" ? "Pedir revisão" : "Rejeitada"}</strong><small>{formatDate(review.createdAt)}</small></div>{review.tags.length > 0 && <p>{review.tags.map(labelTag).join(" · ")}</p>}{review.note && <blockquote>{review.note}</blockquote>}</article>) : <p className={styles.emptyText}>Nenhuma revisão registrada ainda.</p>}</section>
          </div>
        )}
      </div>
    </main>
  );
}
