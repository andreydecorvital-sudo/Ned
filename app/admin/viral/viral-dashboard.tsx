"use client";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Flame,
  Gauge,
  Globe2,
  Library,
  Lightbulb,
  LoaderCircle,
  LogOut,
  Rocket,
  Save,
  Sparkles,
  Target,
  Trash2,
  WandSparkles,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  socialFormatLabels,
  socialFormats,
  type SocialFormat,
} from "@/lib/social-types";
import type {
  GeneratedViralContent,
  ViralDashboardData,
  ViralIdea,
  ViralProfile,
  ViralStudioDraft,
} from "@/lib/viral-types";
import styles from "./viral.module.css";

type Tab = "overview" | "generator" | "library";
type LibraryFilter = "all" | "ready" | "studio" | SocialFormat;

type DashboardResponse = Partial<ViralDashboardData> & { error?: string };
type GenerateResponse = {
  generated?: GeneratedViralContent;
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

const goalPresets = [
  { label: "Alcance", value: "alcançar novas pessoas com uma ideia fácil de compartilhar" },
  { label: "Autoridade", value: "demonstrar domínio do assunto e aumentar confiança" },
  { label: "Engajamento", value: "gerar comentários, salvamentos e compartilhamentos relevantes" },
  { label: "Leads", value: "iniciar conversas com potenciais clientes no direct ou WhatsApp" },
  { label: "Oferta", value: "apresentar uma solução e conduzir para o próximo passo comercial" },
] as const;

const anglePresets = [
  { label: "Erro comum", value: "Mostre um erro frequente, por que ele acontece e como corrigir." },
  { label: "Passo a passo", value: "Organize a ideia em etapas práticas e fáceis de aplicar." },
  { label: "Opinião forte", value: "Defenda um ponto de vista claro, com argumento e contexto." },
  { label: "Bastidores", value: "Mostre processo, decisão, aprendizado ou construção real." },
  { label: "Quebra de objeção", value: "Responda uma dúvida que impede o público de agir ou comprar." },
  { label: "Oferta útil", value: "Conecte um problema real à solução sem transformar o conteúdo em anúncio vazio." },
] as const;

const checklistLabels: Array<[
  keyof GeneratedViralContent["checklist"],
  string,
  number,
]> = [
  ["hook", "Gancho", 20],
  ["clarity", "Clareza", 15],
  ["retention", "Retenção", 15],
  ["value", "Valor", 15],
  ["interaction", "Interação", 10],
  ["cta", "Próxima ação", 10],
  ["formatFit", "Formato", 5],
  ["readability", "Leitura", 5],
  ["hashtags", "Contexto", 5],
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function combinedContent(content: GeneratedViralContent | ViralIdea) {
  return [
    content.caption.trim(),
    content.hashtags.join(" "),
    content.firstComment ? `Primeiro comentário:\n${content.firstComment}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function profileLabel(profile: ViralProfile) {
  if (profile.instagramHandle.trim()) return `@${profile.instagramHandle.replace(/^@/, "")}`;
  return "NED Marketing";
}

function contentRisk(score: number) {
  if (score >= 80) return { label: "Forte", copy: "A estrutura está pronta para teste. O resultado agora depende da execução e distribuição." };
  if (score >= 65) return { label: "Promissor", copy: "Boa base. Ajuste o primeiro ponto recomendado antes de publicar." };
  if (score >= 45) return { label: "Precisa de revisão", copy: "A ideia existe, mas ainda falta clareza ou motivo para continuar consumindo." };
  return { label: "Frágil", copy: "Não publique ainda. Reforce o gancho, o valor entregue e a próxima ação." };
}

export default function ViralDashboard() {
  const [data, setData] = useState<ViralDashboardData>(emptyData);
  const [profile, setProfile] = useState<ViralProfile>(emptyProfile);
  const [tab, setTab] = useState<Tab>("overview");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [missionBusy, setMissionBusy] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [format, setFormat] = useState<SocialFormat>("reel");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState(goalPresets[3].value);
  const [angle, setAngle] = useState(anglePresets[0].value);
  const [extraContext, setExtraContext] = useState("");
  const [generated, setGenerated] = useState<GeneratedViralContent | null>(null);
  const [generatedIdeaId, setGeneratedIdeaId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/viral", { cache: "no-store" });
      const payload = (await response.json()) as DashboardResponse;
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!response.ok || !payload.profile || !payload.stats) {
        setError(payload.error ?? "Não foi possível carregar a Viral Machine.");
        return;
      }
      const next = payload as ViralDashboardData;
      setData(next);
      setProfile(next.profile);
    } catch {
      setError("Falha de conexão ao carregar a Viral Machine.");
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

  const filteredIdeas = useMemo(() => {
    if (libraryFilter === "ready") return data.ideas.filter((idea) => idea.score >= 70);
    if (libraryFilter === "studio") return data.ideas.filter((idea) => idea.usedInStudio);
    if (socialFormats.includes(libraryFilter as SocialFormat)) {
      return data.ideas.filter((idea) => idea.format === libraryFilter);
    }
    return data.ideas;
  }, [data.ideas, libraryFilter]);

  const nextAction = useMemo(() => {
    if (data.stats.profileCompleteness < 70) {
      return {
        title: "Complete o perfil editorial",
        copy: "A IA ainda não conhece o suficiente sobre público, objetivo e pilares para escrever com consistência.",
        action: () => setTab("overview"),
        label: "Ajustar contexto",
      };
    }
    if (!data.ideas.length) {
      return {
        title: "Gere a primeira pauta",
        copy: "Escolha um objetivo, uma abordagem e transforme um tema real em conteúdo estruturado.",
        action: () => setTab("generator"),
        label: "Criar primeira ideia",
      };
    }
    if (data.stats.studioTransfers === 0) {
      return {
        title: "Tire uma ideia da biblioteca",
        copy: "Você já gerou conteúdo. O próximo ganho vem de transformar uma ideia em rascunho real.",
        action: () => setTab("library"),
        label: "Escolher para executar",
      };
    }
    const pendingMission = data.missions.find((mission) => !mission.completed);
    if (pendingMission) {
      return {
        title: pendingMission.title,
        copy: pendingMission.description,
        action: () => setTab(pendingMission.code === "publish-ready" ? "library" : "generator"),
        label: "Continuar plano do dia",
      };
    }
    return {
      title: "Revise o aprendizado do dia",
      copy: "Compare o que foi gerado, o que chegou ao estúdio e qual hipótese merece um novo teste amanhã.",
      action: () => setTab("library"),
      label: "Revisar execução",
    };
  }, [data.ideas.length, data.missions, data.stats.profileCompleteness, data.stats.studioTransfers]);

  const saveProfile = async () => {
    if (!data.configuration.database || savingProfile) return;
    setSavingProfile(true);
    setError("");
    setNotice("");
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
        setError(payload.error ?? "Não foi possível salvar o perfil editorial.");
        return;
      }
      setProfile(payload.profile);
      setData((current) => ({
        ...current,
        profile: payload.profile!,
        stats: payload.stats ?? current.stats,
      }));
      setNotice("Perfil editorial salvo. As próximas gerações usarão esse contexto.");
    } catch {
      setError("Falha de conexão ao salvar o perfil.");
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
        setError(payload.error ?? "Não foi possível atualizar a missão.");
        return;
      }
      setData((current) => ({
        ...current,
        missions: payload.missions!,
        stats: payload.stats!,
      }));
    } catch {
      setError("Falha de conexão ao atualizar a missão.");
    } finally {
      setMissionBusy("");
    }
  };

  const generate = async () => {
    if (generating) return;
    if (topic.trim().length < 4) {
      setError("Escolha uma sugestão ou descreva o tema que deseja transformar em conteúdo.");
      return;
    }
    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/viral/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          topic,
          goal,
          extraContext: [angle, extraContext].filter(Boolean).join("\n\n"),
          profile,
          save: true,
        }),
      });
      const payload = (await response.json()) as GenerateResponse;
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok || !payload.generated) {
        setError(payload.error ?? "Não foi possível gerar o conteúdo.");
        return;
      }
      setGenerated(payload.generated);
      setGeneratedIdeaId(payload.idea?.id ?? null);
      setNotice(
        payload.generated.provider === "gemini"
          ? "Conteúdo gerado com Gemini e salvo na biblioteca."
          : "Conteúdo criado no modo local. Configure GEMINI_API_KEY para ativar a IA real.",
      );
      if (payload.idea) await load(true);
    } catch {
      setError("Falha de conexão ao gerar o conteúdo.");
    } finally {
      setGenerating(false);
    }
  };

  const copyContent = async (content: GeneratedViralContent | ViralIdea) => {
    try {
      await navigator.clipboard.writeText(combinedContent(content));
      setNotice("Legenda, hashtags e primeiro comentário copiados.");
    } catch {
      setError("O navegador não permitiu copiar o conteúdo.");
    }
  };

  const openStudioTransfer = (
    content: GeneratedViralContent | ViralIdea,
    ideaId: string | null,
    contentFormat: SocialFormat,
  ) => {
    const draft: ViralStudioDraft = {
      ideaId,
      accountName: profileLabel(profile),
      format: contentFormat,
      title: content.title,
      caption: [content.caption.trim(), content.hashtags.join(" ")].filter(Boolean).join("\n\n"),
      hashtags: content.hashtags,
      firstComment: content.firstComment,
      score: content.score,
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem("ned_viral_studio_draft", JSON.stringify(draft));
    window.location.assign("/admin/viral/studio");
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
      setNotice("Ideia removida da biblioteca.");
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

  const scoreMessage = useMemo(() => {
    if (data.stats.viralScore >= 80) return "Boa combinação entre qualidade, rotina e execução.";
    if (data.stats.viralScore >= 60) return "A base está funcionando, mas ainda existem ideias paradas antes do estúdio.";
    if (data.stats.viralScore >= 35) return "Existe atividade, porém o fluxo ainda não termina em publicação preparada.";
    return "Complete o contexto da marca e leve a primeira ideia até um rascunho real.";
  }, [data.stats.viralScore]);

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <LoaderCircle className={styles.spin} />
        <p>Preparando seu plano de conteúdo...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/admin/viral">
          <strong>NED</strong>
          <small>VIRAL MACHINE</small>
        </a>
        <nav aria-label="Navegação administrativa">
          <a href="/admin/leads">CRM</a>
          <a href="/admin/conteudo">Estúdio</a>
          <a className={styles.active} href="/admin/viral">Viral Machine</a>
          <a href="/" target="_blank" rel="noreferrer"><Globe2 size={14} /> Site</a>
        </nav>
        <button className={styles.logout} type="button" onClick={logout}>
          <LogOut size={15} /> Sair
        </button>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <span>PLANEJAR → CRIAR → EXECUTAR → APRENDER</span>
            <h1>
              Menos dúvida sobre o que postar.<em>Mais conteúdo chegando à rua.</em>
            </h1>
          </div>
          <p>
            A Viral Machine organiza o contexto da marca, recomenda o próximo passo e mede
            quantas ideias realmente avançam para execução.
          </p>
        </section>

        <section className={styles.statusStrip} aria-label="Status das integrações">
          <div className={data.configuration.database ? styles.ready : styles.pending}>
            <BarChart3 size={16} /><strong>Dados</strong><small>{data.configuration.database ? "Neon conectado" : "Configurar"}</small>
          </div>
          <div className={data.configuration.gemini ? styles.ready : styles.pending}>
            <BrainCircuit size={16} /><strong>IA</strong><small>{data.configuration.gemini ? "Gemini ativo" : "Modo local"}</small>
          </div>
          <div className={styles.ready}>
            <Rocket size={16} /><strong>Execução</strong><small>Estúdio conectado</small>
          </div>
        </section>

        {!data.configuration.database && (
          <div className={styles.warning}>
            Configure DATABASE_URL para salvar perfil, missões, ideias e execução.
          </div>
        )}
        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tabs} role="tablist" aria-label="Áreas da Viral Machine">
          <button className={tab === "overview" ? styles.tabActive : ""} onClick={() => setTab("overview")} type="button">
            <Gauge size={16} /> Hoje
          </button>
          <button className={tab === "generator" ? styles.tabActive : ""} onClick={() => setTab("generator")} type="button">
            <WandSparkles size={16} /> Criar conteúdo
          </button>
          <button className={tab === "library" ? styles.tabActive : ""} onClick={() => setTab("library")} type="button">
            <Library size={16} /> Ideias <span>{data.ideas.length}</span>
          </button>
        </div>

        {tab === "overview" && (
          <div className={styles.overviewGrid}>
            <section className={styles.nextActionCard}>
              <div className={styles.nextActionIcon}><Zap size={24} /></div>
              <div>
                <span>PRÓXIMA AÇÃO RECOMENDADA</span>
                <h2>{nextAction.title}</h2>
                <p>{nextAction.copy}</p>
              </div>
              <button type="button" onClick={nextAction.action}>
                {nextAction.label} <ArrowRight size={16} />
              </button>
            </section>

            <section className={styles.scoreCard}>
              <div
                className={styles.scoreRing}
                style={{
                  background: `conic-gradient(#7040ff ${data.stats.viralScore * 3.6}deg, rgba(255,255,255,.08) 0deg)`,
                }}
              >
                <div><strong>{data.stats.viralScore}</strong><span>/100</span></div>
              </div>
              <div className={styles.scoreCopy}>
                <span>ÍNDICE DE EXECUÇÃO E CONTEÚDO</span>
                <h2>O score sobe quando a ideia avança.</h2>
                <p>{scoreMessage}</p>
                <small>45% qualidade · 25% execução · 15% rotina · 15% contexto</small>
              </div>
            </section>

            <section className={styles.metricGrid}>
              <article><Target size={18} /><span>PERFIL</span><strong>{data.stats.profileCompleteness}%</strong><small>contexto preenchido</small></article>
              <article><Sparkles size={18} /><span>PRONTAS</span><strong>{data.stats.readyIdeas}</strong><small>score acima de 70</small></article>
              <article><Rocket size={18} /><span>NO ESTÚDIO</span><strong>{data.stats.studioTransfers}</strong><small>ideias executadas</small></article>
              <article><Gauge size={18} /><span>EXECUÇÃO</span><strong>{data.stats.executionRate}%</strong><small>ideias que avançaram</small></article>
            </section>

            <section className={styles.missionsCard}>
              <div className={styles.sectionTitle}>
                <div><span>PLANO DO DIA</span><h2>Cinco passos que terminam em ação.</h2></div>
                <strong>{data.stats.missionPoints} XP</strong>
              </div>
              <div className={styles.progressTrack}>
                <span style={{ width: `${data.stats.missionCompletion}%` }} />
              </div>
              <div className={styles.missionList}>
                {data.missions.map((mission) => (
                  <button
                    className={mission.completed ? styles.missionDone : styles.mission}
                    type="button"
                    key={mission.id}
                    disabled={missionBusy === mission.id}
                    onClick={() => void toggleMission(mission.id, !mission.completed)}
                  >
                    <span className={styles.missionCheck}>
                      {missionBusy === mission.id ? <LoaderCircle className={styles.spin} size={17} /> : mission.completed ? <Check size={17} /> : null}
                    </span>
                    <span className={styles.missionText}><strong>{mission.title}</strong><small>{mission.description}</small></span>
                    <b>+{mission.points}</b>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.profileCard}>
              <div className={styles.sectionTitle}>
                <div><span>CONTEXTO DA MARCA · {data.stats.profileCompleteness}%</span><h2>Quanto melhor o contexto, menos genérica fica a IA.</h2></div>
              </div>
              <div className={styles.formGrid}>
                <label><span>INSTAGRAM</span><input value={profile.instagramHandle} onChange={(event) => setProfile((current) => ({ ...current, instagramHandle: event.target.value }))} placeholder="@nedmarketing" /></label>
                <label><span>NICHO</span><input value={profile.niche} onChange={(event) => setProfile((current) => ({ ...current, niche: event.target.value }))} placeholder="Marketing para negócios locais" /></label>
                <label className={styles.fullField}><span>QUEM PRECISA ESCOLHER SUA MARCA?</span><textarea value={profile.audience} onChange={(event) => setProfile((current) => ({ ...current, audience: event.target.value }))} placeholder="Empresários que dependem do Instagram e WhatsApp para vender" /></label>
                <label><span>TOM DE VOZ</span><input value={profile.tone} onChange={(event) => setProfile((current) => ({ ...current, tone: event.target.value }))} /></label>
                <label><span>3 A 8 PILARES</span><input value={profile.contentPillars.join(", ")} onChange={(event) => setProfile((current) => ({ ...current, contentPillars: event.target.value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8) }))} placeholder="estratégia, criação, tráfego" /></label>
                <label className={styles.fullField}><span>OBJETIVO DO PERFIL</span><textarea value={profile.objective} onChange={(event) => setProfile((current) => ({ ...current, objective: event.target.value }))} /></label>
              </div>
              <button className={styles.primaryButton} type="button" onClick={() => void saveProfile()} disabled={savingProfile || !data.configuration.database}>
                {savingProfile ? <LoaderCircle className={styles.spin} size={16} /> : <Save size={16} />} Salvar contexto
              </button>
            </section>
          </div>
        )}

        {tab === "generator" && (
          <div className={styles.generatorGrid}>
            <section className={styles.generatorForm}>
              <div className={styles.sectionTitle}>
                <div><span>BRIEFING RÁPIDO</span><h2>Quatro decisões antes de gerar.</h2></div>
              </div>

              <div className={styles.briefStep}>
                <span>01 · RESULTADO DESEJADO</span>
                <div className={styles.presetGrid}>
                  {goalPresets.map((preset) => (
                    <button className={goal === preset.value ? styles.presetActive : ""} type="button" key={preset.label} onClick={() => setGoal(preset.value)}>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.briefStep}>
                <span>02 · FORMATO</span>
                <div className={styles.formatPicker}>
                  {socialFormats.map((item) => (
                    <button className={format === item ? styles.formatActive : ""} type="button" key={item} onClick={() => setFormat(item)}>
                      {socialFormatLabels[item]}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.briefStep}>
                <span>03 · ABORDAGEM</span>
                <div className={styles.angleGrid}>
                  {anglePresets.map((preset) => (
                    <button className={angle === preset.value ? styles.angleActive : ""} type="button" key={preset.label} onClick={() => setAngle(preset.value)}>
                      <strong>{preset.label}</strong><small>{preset.value}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.briefStep}>
                <span>04 · TEMA</span>
                <div className={styles.suggestionList}>
                  {topicSuggestions.map((suggestion) => (
                    <button type="button" key={suggestion} onClick={() => setTopic(suggestion)}>
                      <Lightbulb size={14} /> {suggestion}
                    </button>
                  ))}
                </div>
                <label><textarea value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Escolha uma sugestão ou escreva sua própria pauta." /></label>
                <label><span>DETALHE OBRIGATÓRIO, PRODUTO OU OPINIÃO</span><textarea value={extraContext} onChange={(event) => setExtraContext(event.target.value)} placeholder="Opcional. Inclua exemplos, restrições ou uma ideia que não pode faltar." /></label>
              </div>

              <button className={styles.generateButton} type="button" onClick={() => void generate()} disabled={generating}>
                {generating ? <LoaderCircle className={styles.spin} size={18} /> : <WandSparkles size={18} />}
                {generating ? "Construindo conteúdo..." : "Gerar conteúdo estruturado"}
              </button>
              <small className={styles.generatorHint}>
                {data.configuration.gemini ? "Gemini ativo. O resultado será salvo na biblioteca." : "Modo local ativo. Adicione GEMINI_API_KEY para personalização avançada."}
              </small>
            </section>

            <section className={styles.resultCard}>
              {!generated ? (
                <div className={styles.emptyResult}>
                  <BrainCircuit size={38} />
                  <h2>O resultado aparece aqui.</h2>
                  <p>Você recebe três ganchos, legenda, CTA, hashtags, primeiro comentário e uma recomendação objetiva antes de executar.</p>
                </div>
              ) : (
                <>
                  <div className={styles.resultHeader}>
                    <div><span>{generated.provider === "gemini" ? "GERADO COM GEMINI" : "MODO LOCAL"}</span><h2>{generated.title}</h2></div>
                    <strong>{generated.score}<small>/100</small></strong>
                  </div>

                  <div className={styles.riskBox} data-level={contentRisk(generated.score).label.toLowerCase()}>
                    <strong>{contentRisk(generated.score).label}</strong>
                    <p>{contentRisk(generated.score).copy}</p>
                  </div>

                  <div className={styles.hooks}>
                    <span>TESTE DE GANCHOS</span>
                    {generated.hooks.map((hook, index) => <p key={`${hook}-${index}`}><b>0{index + 1}</b>{hook}</p>)}
                  </div>
                  <div className={styles.captionBox}><span>LEGENDA</span><p>{generated.caption}</p></div>
                  <div className={styles.tags}>{generated.hashtags.map((tag) => <span key={tag}>{tag}</span>)}</div>

                  {generated.improvements.length > 0 && (
                    <div className={styles.improvements}>
                      <span>MELHORE ANTES DE PUBLICAR</span>
                      {generated.improvements.map((item, index) => <p key={item}><b>{index + 1}</b>{item}</p>)}
                    </div>
                  )}

                  <div className={styles.resultActions}>
                    <button type="button" onClick={() => void copyContent(generated)}><Clipboard size={15} /> Copiar</button>
                    <button className={styles.primaryButton} type="button" onClick={() => openStudioTransfer(generated, generatedIdeaId, format)}><Rocket size={15} /> Finalizar no estúdio</button>
                  </div>

                  <div className={styles.checklist}>
                    <span>COMO A NOTA FOI FORMADA</span>
                    {checklistLabels.map(([key, label, max]) => (
                      <div key={key}><span>{label}</span><i><b style={{ width: `${(generated.checklist[key] / max) * 100}%` }} /></i><strong>{generated.checklist[key]}/{max}</strong></div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {tab === "library" && (
          <section className={styles.librarySection}>
            <div className={styles.libraryHeader}>
              <div><span>BIBLIOTECA DE EXECUÇÃO</span><h2>Escolha o que merece virar publicação.</h2></div>
              <p>{data.stats.studioTransfers} de {data.stats.ideasCount} ideias avançaram para o estúdio.</p>
            </div>

            <div className={styles.libraryFilters}>
              <button className={libraryFilter === "all" ? styles.filterActive : ""} type="button" onClick={() => setLibraryFilter("all")}>Todas</button>
              <button className={libraryFilter === "ready" ? styles.filterActive : ""} type="button" onClick={() => setLibraryFilter("ready")}>Prontas 70+</button>
              <button className={libraryFilter === "studio" ? styles.filterActive : ""} type="button" onClick={() => setLibraryFilter("studio")}>No estúdio</button>
              {socialFormats.map((item) => <button className={libraryFilter === item ? styles.filterActive : ""} type="button" key={item} onClick={() => setLibraryFilter(item)}>{socialFormatLabels[item]}</button>)}
            </div>

            {!filteredIdeas.length ? (
              <div className={styles.emptyLibrary}>
                <Library size={34} />
                <h3>Nenhuma ideia neste filtro.</h3>
                <p>Gere uma pauta com objetivo claro ou escolha outro filtro.</p>
                <button type="button" onClick={() => setTab("generator")}>Criar conteúdo <ChevronRight size={15} /></button>
              </div>
            ) : (
              <div className={styles.ideaGrid}>
                {filteredIdeas.map((idea) => (
                  <article className={styles.ideaCard} key={idea.id}>
                    <div className={styles.ideaTop}>
                      <span>{socialFormatLabels[idea.format]}</span>
                      <strong>{idea.score}/100</strong>
                    </div>
                    <div className={styles.ideaState}>
                      {idea.usedInStudio ? <><CheckCircle2 size={14} /> Levado ao estúdio {idea.usedAt ? formatDate(idea.usedAt) : ""}</> : idea.score >= 70 ? <><Sparkles size={14} /> Pronto para execução</> : <><Gauge size={14} /> Precisa de revisão</>}
                    </div>
                    <h3>{idea.title}</h3>
                    <p className={styles.ideaTopic}>{idea.topic}</p>
                    <p className={styles.ideaCaption}>{idea.caption}</p>
                    <div className={styles.ideaMeta}><span>{idea.provider === "gemini" ? "Gemini" : "Modo local"}</span><span>{formatDate(idea.createdAt)}</span></div>
                    <div className={styles.ideaActions}>
                      <button type="button" onClick={() => void copyContent(idea)}><Clipboard size={14} /> Copiar</button>
                      <button className={styles.executeButton} type="button" onClick={() => openStudioTransfer(idea, idea.id, idea.format)}><Rocket size={14} /> Executar</button>
                      <button className={styles.deleteButton} type="button" disabled={deletingId === idea.id} onClick={() => void deleteIdea(idea)}><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
