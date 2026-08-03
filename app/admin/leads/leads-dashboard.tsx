"use client";

import {
  Clock3,
  Download,
  LogOut,
  MessageCircle,
  RefreshCcw,
  Save,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  leadSourceLabels,
  leadStatusLabels,
  leadStatuses,
  type LeadFilters,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/lead-types";
import styles from "../admin.module.css";

type LeadResponse = {
  leads: LeadRecord[];
  options?: { services?: string[]; sources?: string[] };
  error?: string;
};

const emptyFilters: Required<LeadFilters> = {
  status: "",
  service: "",
  source: "",
  search: "",
};

function formatDate(value: string | null) {
  if (!value) return "Ainda não registrado";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function queryFromFilters(filters: Required<LeadFilters>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

function whatsappUrl(lead: LeadRecord) {
  const message = [
    `Olá, ${lead.name}! Aqui é a NED Marketing.`,
    `Recebemos seu diagnóstico sobre ${lead.service.toLowerCase()}.`,
    "Quero entender melhor seu projeto e os próximos passos.",
  ].join("\n");
  return `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function LeadsDashboard({ databaseConfigured }: { databaseConfigured: boolean }) {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [services, setServices] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(databaseConfigured);
  const [error, setError] = useState(databaseConfigured ? "" : "Banco de leads não configurado.");
  const [savingId, setSavingId] = useState("");

  const loadLeads = useCallback(async () => {
    if (!databaseConfigured) return;
    setLoading(true);
    setError("");

    try {
      const query = queryFromFilters(appliedFilters);
      const response = await fetch(`/api/admin/leads${query ? `?${query}` : ""}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as LeadResponse;

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Não foi possível carregar os leads.");
        return;
      }

      setLeads(data.leads);
      setNotes(Object.fromEntries(data.leads.map((lead) => [lead.id, lead.notes])));
      setServices((current) =>
        [...new Set([...current, ...(data.options?.services ?? [])])].sort(),
      );
      setSources((current) =>
        [...new Set([...current, ...(data.options?.sources ?? [])])].sort(),
      );
    } catch {
      setError("Falha de conexão ao carregar os leads.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, databaseConfigured]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const stats = useMemo(() => {
    const newCount = leads.filter((lead) => lead.status === "novo").length;
    const pipeline = leads.filter((lead) =>
      ["em_contato", "reuniao", "proposta"].includes(lead.status),
    ).length;
    const closed = leads.filter((lead) => lead.status === "fechado").length;
    return { total: leads.length, newCount, pipeline, closed };
  }, [leads]);

  const patchLead = async (
    id: string,
    changes: { status?: LeadStatus; notes?: string; touchContact?: boolean },
  ) => {
    setSavingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const data = (await response.json()) as { lead?: LeadRecord; error?: string };

      if (!response.ok || !data.lead) {
        setError(data.error ?? "Não foi possível atualizar o lead.");
        return;
      }

      setLeads((current) => current.map((lead) => (lead.id === id ? data.lead! : lead)));
      setNotes((current) => ({ ...current, [id]: data.lead!.notes }));
    } catch {
      setError("Falha de conexão ao atualizar o lead.");
    } finally {
      setSavingId("");
    }
  };

  const applyFilters = () => setAppliedFilters(draftFilters);
  const clearFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const exportQuery = queryFromFilters(appliedFilters);
  const exportUrl = `/api/admin/leads/export${exportQuery ? `?${exportQuery}` : ""}`;

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  const leadActions = (lead: LeadRecord) => (
    <div className={styles.actions}>
      <textarea
        className={styles.notes}
        value={notes[lead.id] ?? ""}
        onChange={(event) =>
          setNotes((current) => ({ ...current, [lead.id]: event.target.value }))
        }
        placeholder="Observações do atendimento..."
        maxLength={4000}
      />
      <div className={styles.actionRow}>
        <button
          className={styles.smallButton}
          type="button"
          disabled={savingId === lead.id}
          onClick={() => patchLead(lead.id, { notes: notes[lead.id] ?? "" })}
        >
          <Save size={13} /> Salvar
        </button>
        <button
          className={styles.smallButton}
          type="button"
          disabled={savingId === lead.id}
          onClick={() => patchLead(lead.id, { touchContact: true })}
        >
          <Clock3 size={13} /> Contato
        </button>
      </div>
      <a
        className={styles.actionLink}
        href={whatsappUrl(lead)}
        target="_blank"
        rel="noreferrer"
        onClick={() => void patchLead(lead.id, { touchContact: true, status: lead.status === "novo" ? "em_contato" : lead.status })}
      >
        <MessageCircle size={14} /> Chamar no WhatsApp
      </a>
      <span className={styles.muted}>Último contato: {formatDate(lead.lastContactAt)}</span>
    </div>
  );

  return (
    <main className={styles.page}>
      <header className={styles.dashboardHeader}>
        <a className={styles.brand} href="/" aria-label="NED Marketing">
          <strong>NED</strong>
          <small>LEADS</small>
        </a>
        <div className={styles.headerActions}>
          <a className={styles.secondaryButton} href={exportUrl}>
            <Download size={15} /> Exportar CSV
          </a>
          <button className={styles.dangerButton} type="button" onClick={logout}>
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.intro}>
          <div>
            <span className={styles.eyebrow}>PAINEL COMERCIAL / NED</span>
            <h1>
              Contexto antes do <span>primeiro contato.</span>
            </h1>
          </div>
          <p>
            Leads registrados pelo diagnóstico, páginas de serviço e NED LAB. Atualize o andamento e mantenha as próximas ações visíveis.
          </p>
        </section>

        {!databaseConfigured && (
          <div className={styles.warning}>
            Configure DATABASE_URL na Vercel para ativar a captura e a listagem persistente.
          </div>
        )}

        <section className={styles.stats} aria-label="Resumo dos leads filtrados">
          <article className={styles.stat}><span>TOTAL VISÍVEL</span><strong>{stats.total}</strong></article>
          <article className={styles.stat}><span>NOVOS</span><strong>{stats.newCount}</strong></article>
          <article className={styles.stat}><span>EM ANDAMENTO</span><strong>{stats.pipeline}</strong></article>
          <article className={styles.stat}><span>FECHADOS</span><strong>{stats.closed}</strong></article>
        </section>

        <section className={styles.toolbar} aria-label="Filtros de leads">
          <input
            value={draftFilters.search}
            onChange={(event) => setDraftFilters((current) => ({ ...current, search: event.target.value }))}
            onKeyDown={(event) => { if (event.key === "Enter") applyFilters(); }}
            placeholder="Buscar nome, empresa, WhatsApp ou desafio"
          />
          <select
            value={draftFilters.status}
            onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">Todos os status</option>
            {leadStatuses.map((status) => <option key={status} value={status}>{leadStatusLabels[status]}</option>)}
          </select>
          <select
            value={draftFilters.service}
            onChange={(event) => setDraftFilters((current) => ({ ...current, service: event.target.value }))}
          >
            <option value="">Todos os serviços</option>
            {services.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
          <select
            value={draftFilters.source}
            onChange={(event) => setDraftFilters((current) => ({ ...current, source: event.target.value }))}
          >
            <option value="">Todas as origens</option>
            {sources.map((source) => <option key={source} value={source}>{leadSourceLabels[source] ?? source}</option>)}
          </select>
          <div className={styles.actionRow}>
            <button className={styles.primaryButton} type="button" onClick={applyFilters}>
              <Search size={14} /> Filtrar
            </button>
            <button className={styles.secondaryButton} type="button" onClick={clearFilters}>
              <RefreshCcw size={14} /> Limpar
            </button>
          </div>
        </section>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Carregando contatos...</div>
        ) : leads.length === 0 ? (
          <div className={styles.empty}>Nenhum lead encontrado com os filtros atuais.</div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>CONTATO</th>
                    <th>NECESSIDADE</th>
                    <th>ORIGEM</th>
                    <th>STATUS</th>
                    <th>ATENDIMENTO</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className={styles.leadIdentity}>
                          <strong>{lead.name}</strong>
                          <span>{lead.company}</span>
                          <span>{lead.whatsapp}</span>
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.detail}>
                          <strong>{lead.service}</strong>
                          <span>{lead.businessType}</span>
                          <span>{lead.challenge}</span>
                          <span className={styles.urgencyBadge}>{lead.urgency}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.detail}>
                          <span className={styles.sourceBadge}>{leadSourceLabels[lead.source] ?? lead.source}</span>
                          <span>{lead.pagePath}</span>
                          {lead.utmCampaign && <span>Campanha: {lead.utmCampaign}</span>}
                        </div>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={lead.status}
                          disabled={savingId === lead.id}
                          onChange={(event) => void patchLead(lead.id, { status: event.target.value as LeadStatus })}
                        >
                          {leadStatuses.map((status) => <option key={status} value={status}>{leadStatusLabels[status]}</option>)}
                        </select>
                      </td>
                      <td>{leadActions(lead)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.mobileCards}>
              {leads.map((lead) => (
                <article className={styles.mobileLead} key={lead.id}>
                  <div className={styles.mobileLeadTop}>
                    <div className={styles.leadIdentity}>
                      <strong>{lead.name}</strong>
                      <span>{lead.company}</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                    <select
                      className={styles.statusSelect}
                      value={lead.status}
                      onChange={(event) => void patchLead(lead.id, { status: event.target.value as LeadStatus })}
                    >
                      {leadStatuses.map((status) => <option key={status} value={status}>{leadStatusLabels[status]}</option>)}
                    </select>
                  </div>
                  <div className={styles.detail}>
                    <strong>{lead.service}</strong>
                    <span>{lead.businessType}</span>
                    <span>{lead.challenge}</span>
                    <span className={styles.sourceBadge}>{leadSourceLabels[lead.source] ?? lead.source}</span>
                  </div>
                  {leadActions(lead)}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
