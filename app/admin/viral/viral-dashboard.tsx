"use client";

import {
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  Clipboard,
  Flame,
  Gauge,
  Globe2,
  Library,
  LoaderCircle,
  LogOut,
  Rocket,
  Save,
  Sparkles,
  Target,
  Trash2,
  WandSparkles,
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
} from "@/lib/viral-types";
import styles from "./viral.module.css";

type Tab = "overview" | "generator" | "library";

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
    streakDays: 0,
  },
  configuration: {
    database: false,
    gemini: false,
    studio: true,
  },
};

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
  ["cta", "CTA", 10],
  ["formatFit", "Formato", 5],
  ["readability", "Leitura", 5],
  ["hashtags", "Hashtags", 5],
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
    content.firstComment ? `\nPrimeiro comentário:\n${content.firstComment}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export default function ViralDashboard() {
  const [data, setData] = useState<ViralDashboardData>(emptyData);
  const [profile, setProfile] = useState<ViralProfile>(emptyProfile);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [missionBusy, setMissionBusy] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [format, setFormat] = useState<SocialFormat>("reel");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("gerar salvamentos, compartilhamentos e conversas");
  const [extraContext, setExtraContext] = useState("");
  const [generated, setGenerated] = useState<GeneratedViralContent | null>(null);

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
      const payload = (await response.json()) as { profile?: ViralProfile; error?: string };
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok || !payload.profile) {
        setError(payload.error ?? "Não foi possível salvar o perfil editorial.");
        return;
      }
      setProfile(payload.profile);
      setData((current) => ({ ...current, profile: payload.profile! }));
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
      setError("Descreva o tema que deseja transformar em conteúdo.");
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
          extraContext,
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

  const copyContent = async (content: GeneratedViralContent | ViralIdea, openStudio = false) => {
    try {
      await navigator.clipboard.writeText(combinedContent(content));
      setNotice("Legenda, hashtags e primeiro comentário copiados.");
      if (openStudio) window.open("/admin/conteudo", "_blank", "noopener,noreferrer");
    } catch {
      setError("O navegador não permitiu copiar o conteúdo.");
    }
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
    if (data.stats.viralScore >= 80) return "Ritmo forte. Continue transformando consistência em aprendizado.";
    if (data.stats.viralScore >= 60) return "Boa base. Complete as missões e refine os próximos conteúdos.";
    if (data.stats.viralScore >= 35) return "A máquina está aquecendo. Priorize criação e distribuição.";
    return "Comece pelo perfil editorial e conclua a primeira missão do dia.";
  }, [data.stats.viralScore]);

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <LoaderCircle className={styles.spin} />
        <p>Preparando a Viral Machine...</p>
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
            <span>PLATAFORMA DE CRESCIMENTO / INSTAGRAM</span>
            <h1>
              Consistência com direção.<em>Conteúdo com potencial.</em>
            </h1>
          </div>
          <p>
            Missões diárias, inteligência editorial e um score explicável para transformar
            ideias em publicações mais claras, relevantes e prontas para o estúdio.
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
            <Rocket size={16} /><strong>Publicação</strong><small>Estúdio conectado</small>
          </div>
        </section>

        {!data.configuration.database && (
          <div className={styles.warning}>
            Configure DATABASE_URL para salvar perfil, missões e biblioteca de ideias.
          </div>
        )}
        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tabs} role="tablist" aria-label="Áreas da Viral Machine">
          <button className={tab === "overview" ? styles.tabActive : ""} onClick={() => setTab("overview")} type="button">
            <Gauge size={16} /> Visão geral
          </button>
          <button className={tab === "generator" ? styles.tabActive : ""} onClick={() => setTab("generator")} type="button">
            <WandSparkles size={16} /> Gerador IA
          </button>
          <button className={tab === "library" ? styles.tabActive : ""} onClick={() => setTab("library")} type="button">
            <Library size={16} /> Biblioteca <span>{data.ideas.length}</span>
          </button>
        </div>

        {tab === "overview" && (
          <div className={styles.overviewGrid}>
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
                <span>VIRAL SCORE ATUAL</span>
                <h2>Sua rotina de crescimento em uma leitura.</h2>
                <p>{scoreMessage}</p>
                <button type="button" onClick={() => setTab("generator")}>
                  Criar conteúdo <ChevronRight size={16} />
                </button>
              </div>
            </section>

            <section className={styles.metricGrid}>
              <article><Flame size={18} /><span>SEQUÊNCIA</span><strong>{data.stats.streakDays} dias</strong></article>
              <article><Target size={18} /><span>MISSÕES</span><strong>{data.stats.completedMissions}/{data.stats.totalMissions}</strong></article>
              <article><Sparkles size={18} /><span>IDEIAS</span><strong>{data.stats.ideasCount}</strong></article>
              <article><Gauge size={18} /><span>MÉDIA</span><strong>{data.stats.averageIdeaScore}/100</strong></article>
            </section>

            <section className={styles.missionsCard}>
              <div className={styles.sectionTitle}>
                <div><span>MISSÕES DIÁRIAS</span><h2>O próximo passo já está definido.</h2></div>
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
                <div><span>PERFIL EDITORIAL</span><h2>Contexto para a IA escrever como sua marca.</h2></div>
              </div>
              <div className={styles.formGrid}>
                <label><span>INSTAGRAM</span><input value={profile.instagramHandle} onChange={(event) => setProfile((current) => ({ ...current, instagramHandle: event.target.value }))} placeholder="@nedmarketing" /></label>
                <label><span>NICHO</span><input value={profile.niche} onChange={(event) => setProfile((current) => ({ ...current, niche: event.target.value }))} placeholder="Marketing para negócios locais" /></label>
                <label className={styles.fullField}><span>PÚBLICO</span><textarea value={profile.audience} onChange={(event) => setProfile((current) => ({ ...current, audience: event.target.value }))} placeholder="Empresários que dependem do Instagram e WhatsApp para vender" /></label>
                <label><span>TOM DE VOZ</span><input value={profile.tone} onChange={(event) => setProfile((current) => ({ ...current, tone: event.target.value }))} /></label>
                <label><span>PILARES, SEPARADOS POR VÍRGULA</span><input value={profile.contentPillars.join(", ")} onChange={(event) => setProfile((current) => ({ ...current, contentPillars: event.target.value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8) }))} placeholder="estratégia, criação, tráfego" /></label>
                <label className={styles.fullField}><span>OBJETIVO</span><textarea value={profile.objective} onChange={(event) => setProfile((current) => ({ ...current, objective: event.target.value }))} /></label>
              </div>
              <button className={styles.primaryButton} type="button" onClick={() => void saveProfile()} disabled={savingProfile || !data.configuration.database}>
                {savingProfile ? <LoaderCircle className={styles.spin} size={16} /> : <Save size={16} />} Salvar perfil editorial
              </button>
            </section>
          </div>
        )}

        {tab === "generator" && (
          <div className={styles.generatorGrid}>
            <section className={styles.generatorForm}>
              <div className={styles.sectionTitle}>
                <div><span>GERADOR DE CONTEÚDO</span><h2>Transforme um tema em uma publicação estruturada.</h2></div>
              </div>
              <div className={styles.formatPicker}>
                {socialFormats.map((item) => (
                  <button className={format === item ? styles.formatActive : ""} type="button" key={item} onClick={() => setFormat(item)}>
                    {socialFormatLabels[item]}
                  </button>
                ))}
              </div>
              <label><span>TEMA OU IDEIA CENTRAL</span><textarea value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ex.: por que comprar seguidores prejudica o crescimento real" /></label>
              <label><span>OBJETIVO DESTA PUBLICAÇÃO</span><input value={goal} onChange={(event) => setGoal(event.target.value)} /></label>
              <label><span>CONTEXTO, OFERTA OU PONTO OBRIGATÓRIO</span><textarea value={extraContext} onChange={(event) => setExtraContext(event.target.value)} placeholder="Inclua exemplos, restrições, produto ou opinião que não pode faltar." /></label>
              <button className={styles.generateButton} type="button" onClick={() => void generate()} disabled={generating}>
                {generating ? <LoaderCircle className={styles.spin} size={18} /> : <WandSparkles size={18} />}
                {generating ? "Criando estratégia e legenda..." : "Gerar conteúdo e Viral Score"}
              </button>
              <small className={styles.generatorHint}>
                {data.configuration.gemini ? "Gemini ativo. A resposta será salva automaticamente na biblioteca." : "Modo local ativo. Adicione GEMINI_API_KEY para gerar com o Gemini."}
              </small>
            </section>

            <section className={styles.resultCard}>
              {!generated ? (
                <div className={styles.emptyResult}>
                  <BrainCircuit size={38} />
                  <h2>Sua próxima ideia começa aqui.</h2>
                  <p>Preencha o tema. A Viral Machine entrega ganchos, legenda, hashtags, CTA, primeiro comentário e uma análise de 0 a 100.</p>
                </div>
              ) : (
                <>
                  <div className={styles.resultHeader}>
                    <div><span>{generated.provider === "gemini" ? "GERADO COM GEMINI" : "MODO LOCAL"}</span><h2>{generated.title}</h2></div>
                    <strong>{generated.score}<small>/100</small></strong>
                  </div>
                  <div className={styles.hooks}>
                    <span>OPÇÕES DE GANCHO</span>
                    {generated.hooks.map((hook, index) => <p key={hook}><b>0{index + 1}</b>{hook}</p>)}
                  </div>
                  <div className={styles.captionBox}><span>LEGENDA</span><p>{generated.caption}</p></div>
                  <div className={styles.tags}>{generated.hashtags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className={styles.resultActions}>
                    <button type="button" onClick={() => void copyContent(generated)}><Clipboard size={15} /> Copiar tudo</button>
                    <button className={styles.primaryButton} type="button" onClick={() => void copyContent(generated, true)}><Rocket size={15} /> Copiar e abrir estúdio</button>
                  </div>
                  <div className={styles.checklist}>
                    <span>CHECKLIST EXPLICÁVEL</span>
                    {checklistLabels.map(([key, label, max]) => (
                      <div key={key}><span>{label}</span><i><b style={{ width: `${(generated.checklist[key] / max) * 100}%` }} /></i><strong>{generated.checklist[key]}/{max}</strong></div>
                    ))}
                  </div>
                  {generated.improvements.length > 0 && (
                    <div className={styles.improvements}><span>PRÓXIMOS AJUSTES</span>{generated.improvements.map((item) => <p key={item}>— {item}</p>)}</div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {tab === "library" && (
          <section className={styles.librarySection}>
            <div className={styles.sectionTitle}>
              <div><span>BIBLIOTECA DE IDEIAS</span><h2>Conteúdo gerado, organizado e pronto para evoluir.</h2></div>
              <button className={styles.primaryButton} type="button" onClick={() => setTab("generator")}><Sparkles size={16} /> Nova ideia</button>
            </div>
            {data.ideas.length === 0 ? (
              <div className={styles.emptyLibrary}><Library size={34} /><p>As ideias geradas aparecerão aqui.</p></div>
            ) : (
              <div className={styles.ideaGrid}>
                {data.ideas.map((idea) => (
                  <article className={styles.ideaCard} key={idea.id}>
                    <div className={styles.ideaTop}><span>{socialFormatLabels[idea.format]}</span><strong>{idea.score}/100</strong></div>
                    <h3>{idea.title}</h3>
                    <p className={styles.ideaTopic}>{idea.topic}</p>
                    <p className={styles.ideaCaption}>{idea.caption}</p>
                    <div className={styles.ideaMeta}><span>{idea.provider === "gemini" ? "Gemini" : "Modo local"}</span><span>{formatDate(idea.createdAt)}</span></div>
                    <div className={styles.ideaActions}>
                      <button type="button" onClick={() => void copyContent(idea)}><Clipboard size={14} /> Copiar</button>
                      <button type="button" onClick={() => void copyContent(idea, true)}><Rocket size={14} /> Estúdio</button>
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
