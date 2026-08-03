"use client";

import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  MessageCircle,
  Save,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  leadStatuses,
  type LeadActivityRecord,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/lead-types";
import styles from "../crm-upgrade.module.css";

function formatDate(value: string | null) {
  if (!value) return "Não registrado";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function toLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function whatsappUrl(lead: LeadRecord) {
  const message = [
    `Olá, ${lead.name}! Aqui é a NED Marketing.`,
    `Recebemos seu diagnóstico sobre ${lead.service.toLowerCase()}.`,
    "Quero entender melhor seu projeto e combinar o próximo passo.",
  ].join("\n");
  return `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function LeadDetail({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [activities, setActivities] = useState<LeadActivityRecord[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<LeadStatus>("novo");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, { cache: "no-store" });
      const data = (await response.json()) as {
        lead?: LeadRecord;
        activities?: LeadActivityRecord[];
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!response.ok || !data.lead) {
        setError(data.error ?? "Não foi possível carregar o lead.");
        return;
      }
      setLead(data.lead);
      setActivities(data.activities ?? []);
      setNotes(data.lead.notes);
      setStatus(data.lead.status);
      setNextFollowUpAt(toLocalInput(data.lead.nextFollowUpAt));
    } catch {
      setError("Falha de conexão ao carregar o lead.");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (changes: Record<string, unknown>, successMessage: string) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = (await response.json()) as {
        lead?: LeadRecord;
        activities?: LeadActivityRecord[];
        error?: string;
      };
      if (!response.ok || !data.lead) {
        setError(data.error ?? "Não foi possível atualizar o lead.");
        return false;
      }
      setLead(data.lead);
      setActivities(data.activities ?? []);
      setNotes(data.lead.notes);
      setStatus(data.lead.status);
      setNextFollowUpAt(toLocalInput(data.lead.nextFollowUpAt));
      setNotice(successMessage);
      return true;
    } catch {
      setError("Falha de conexão ao atualizar o lead.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const save = () =>
    patch(
      {
        status,
        notes,
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null,
      },
      "Lead atualizado.",
    );

  const contact = async () => {
    if (!lead) return;
    window.open(whatsappUrl(lead), "_blank", "noopener,noreferrer");
    await patch(
      { touchContact: true, status: lead.status === "novo" ? "em_contato" : lead.status },
      "Contato registrado no histórico.",
    );
  };

  const remove = async () => {
    if (!lead) return;
    const confirmed = window.confirm(
      `Excluir permanentemente os dados de ${lead.name}? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Não foi possível excluir o lead.");
        return;
      }
      window.location.assign("/admin/leads");
    } catch {
      setError("Falha de conexão ao excluir o lead.");
    } finally {
      setSaving(false);
    }
  };

  const priorityClass = useMemo(() => {
    if (!lead) return styles.priorityNormal;
    if (lead.priority === "quente") return styles.priorityHot;
    if (lead.priority === "potencial") return styles.priorityPotential;
    return styles.priorityNormal;
  }, [lead]);

  if (loading) {
    return <main className={styles.detailPage}><div className={styles.detailContent}>Carregando lead...</div></main>;
  }

  if (!lead) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailContent}>
          <a className={styles.backLink} href="/admin/leads"><ArrowLeft size={15} /> Voltar ao painel</a>
          <div className={styles.error}>{error || "Lead não encontrado."}</div>
        </div>
      </main>
    );
  }

  const info = [
    ["EMPRESA", lead.company],
    ["WHATSAPP", lead.whatsapp],
    ["NEGÓCIO", lead.businessType],
    ["SERVIÇO", lead.service],
    ["URGÊNCIA", lead.urgency],
    ["ORIGEM", leadSourceLabels[lead.source] ?? lead.source],
    ["PÁGINA", lead.pagePath],
    ["CRIADO EM", formatDate(lead.createdAt)],
    ["PRIMEIRO CONTATO", formatDate(lead.firstContactAt)],
    ["ÚLTIMO CONTATO", formatDate(lead.lastContactAt)],
    ["CONSENTIMENTO", lead.consentAt ? `${lead.consentVersion} · ${formatDate(lead.consentAt)}` : "Não registrado"],
    ["CAMPANHA", lead.utmCampaign || "Sem UTM"],
  ];

  return (
    <main className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <a className={styles.backLink} href="/admin/leads"><ArrowLeft size={15} /> Voltar aos leads</a>
        <button className={styles.danger} type="button" onClick={remove} disabled={saving}>
          <Trash2 size={15} /> Excluir dados
        </button>
      </header>

      <div className={styles.detailContent}>
        <section className={styles.heroCard}>
          <div>
            <span className={styles.panelTitle}>LEAD / {lead.id.slice(0, 8).toUpperCase()}</span>
            <h1>{lead.name}</h1>
            <p>{lead.challenge}</p>
            <div className={styles.badgeRow}>
              <span className={`${styles.priorityBadge} ${priorityClass}`}>{leadPriorityLabels[lead.priority]}</span>
              <span className={styles.scoreBadge}>Score {lead.score}/100</span>
              {lead.attention.active && <span className={styles.attentionBadge}>{lead.attention.label}</span>}
            </div>
          </div>
          <div className={styles.heroActions}>
            {lead.pageUrl && (
              <a className={styles.secondary} href={lead.pageUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> Página de origem
              </a>
            )}
            <button className={styles.primary} type="button" onClick={() => void contact()} disabled={saving}>
              <MessageCircle size={16} /> Chamar no WhatsApp
            </button>
          </div>
        </section>

        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.detailGrid}>
          <div>
            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>CONTEXTO COMPLETO</h2>
              <div className={styles.infoGrid}>
                {info.map(([label, value]) => (
                  <div className={styles.infoItem} key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.panel} style={{ marginTop: 22 }}>
              <h2 className={styles.panelTitle}>HISTÓRICO DE ATIVIDADES</h2>
              <div className={styles.timeline}>
                {activities.length ? activities.map((activity) => (
                  <article className={styles.timelineItem} key={activity.id}>
                    <strong>{activity.description}</strong>
                    <span>{formatDate(activity.createdAt)}</span>
                  </article>
                )) : <p className={styles.emptyTimeline}>Nenhuma atividade registrada.</p>}
              </div>
            </section>
          </div>

          <aside className={styles.panel}>
            <h2 className={styles.panelTitle}>PRÓXIMO PASSO</h2>
            <div className={styles.formGrid}>
              <label>
                STATUS
                <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>
                  {leadStatuses.map((item) => <option key={item} value={item}>{leadStatusLabels[item]}</option>)}
                </select>
              </label>
              <label>
                PRÓXIMO FOLLOW-UP
                <input
                  type="datetime-local"
                  value={nextFollowUpAt}
                  onChange={(event) => setNextFollowUpAt(event.target.value)}
                />
              </label>
              <label>
                OBSERVAÇÕES
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={4000} />
              </label>
              <div className={styles.buttonRow}>
                <button className={styles.primary} type="button" onClick={() => void save()} disabled={saving}>
                  <Save size={15} /> {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  className={styles.secondary}
                  type="button"
                  onClick={() => void patch({ touchContact: true }, "Contato registrado.")}
                  disabled={saving}
                >
                  <CalendarClock size={15} /> Registrar contato
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
