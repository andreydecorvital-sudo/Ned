"use client";

import {
  Clock3,
  Download,
  ExternalLink,
  GripVertical,
  LogOut,
  MessageCircle,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import {
  leadPriorities,
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  leadStatuses,
  type LeadDashboardStats,
  type LeadFilters,
  type LeadPriority,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/lead-types";
import styles from "../admin.module.css";
import upgrade from "./crm-upgrade.module.css";
import pipeline from "./pipeline-board.module.css";

type LeadResponse = {
  leads: LeadRecord[];
  stats?: LeadDashboardStats;
  options?: { services?: string[]; sources?: string[] };
  error?: string;
};

const emptyFilters: Required<LeadFilters> = {
  status: "",
  service: "",
  source: "",
  priority: "",
  attention: "",
  search: "",
};

const emptyStats: LeadDashboardStats = {
  total: 0,
  today: 0,
  lastSevenDays: 0,
  unattended: 0,
  hot: 0,
  meetings: 0,
  proposals: 0,
  closed: 0,
  followUpsDue: 0,
  averageFirstContactMinutes: null,
  conversionRate: 0,
};

function formatDate(value: string | null) {
  if (!value) return "Ainda não registrado";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function formatShortDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
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

function priorityClass(priority: LeadPriority) {
  if (priority === "quente") return upgrade.priorityHot;
  if (priority === "potencial") return upgrade.priorityPotential;
  return upgrade.priorityNormal;
}

export default function LeadsDashboard({ databaseConfigured }: { databaseConfigured: boolean }) {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<LeadDashboardStats>(emptyStats);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [services, setServices] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(databaseConfigured);
  const [error, setError] = useState(databaseConfigured ? "" : "Banco de leads não configurado.");
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | "">("");

  const loadLeads = useCallback(
    async (silent = false) => {
      if (!databaseConfigured) return;
      if (!silent) setLoading(true);
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
        setStats(data.stats ?? emptyStats);
        setServices((current) =>
          [...new Set([...current, ...(data.options?.services ?? [])])].sort(),
        );
        setSources((current) =>
          [...new Set([...current, ...(data.options?.sources ?? [])])].sort(),
        );
      } catch {
        setError("Falha de conexão ao carregar os leads.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [appliedFilters, databaseConfigured],
  );

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const leadsByStatus = useMemo(
    () =>
      Object.fromEntries(
        leadStatuses.map((status) => [
          status,
          leads.filter((lead) => lead.status === status),
        ]),
      ) as Record<LeadStatus, LeadRecord[]>,
    [leads],
  );

  const patchLead = async (
    id: string,
    changes: { status?: LeadStatus; touchContact?: boolean },
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

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return null;
      }

      if (!response.ok || !data.lead) {
        setError(data.error ?? "Não foi possível atualizar o lead.");
        return null;
      }

      setLeads((current) =>
        current.map((lead) => (lead.id === id ? data.lead! : lead)),
      );
      return data.lead;
    } catch {
      setError("Falha de conexão ao atualizar o lead.");
      return null;
    } finally {
      setSavingId("");
    }
  };

  const moveLead = async (lead: LeadRecord, status: LeadStatus) => {
    if (lead.status === status || savingId === lead.id) return;

    const previousStatus = lead.status;
    setLeads((current) =>
      current.map((item) => (item.id === lead.id ? { ...item, status } : item)),
    );

    const updated = await patchLead(lead.id, { status });
    if (!updated) {
      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id ? { ...item, status: previousStatus } : item,
        ),
      );
      return;
    }

    await loadLeads(true);
  };

  const deleteLead = async (lead: LeadRecord) => {
    const confirmed = window.confirm(
      `Excluir permanentemente ${lead.name} e todo o histórico deste contato?`,
    );
    if (!confirmed || deletingId) return;

    setDeletingId(lead.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Não foi possível excluir o lead.");
        return;
      }

      setLeads((current) => current.filter((item) => item.id !== lead.id));
      await loadLeads(true);
    } catch {
      setError("Falha de conexão ao excluir o lead.");
    } finally {
      setDeletingId("");
    }
  };

  const registerContact = async (lead: LeadRecord) => {
    const status = lead.status === "novo" ? "em_contato" : lead.status;
    const updated = await patchLead(lead.id, { touchContact: true, status });
    if (updated) await loadLeads(true);
  };

  const dropLead = (event: DragEvent<HTMLDivElement>, status: LeadStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") || draggingId;
    const lead = leads.find((item) => item.id === id);
    setDragOverStatus("");
    setDraggingId("");
    if (lead) void moveLead(lead, status);
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

  const metrics = [
    ["LEADS HOJE", String(stats.today), "Entradas no dia"],
    ["SEM ATENDIMENTO", String(stats.unattended), "Precisam de ação"],
    ["LEADS QUENTES", String(stats.hot), "Maior prioridade"],
    ["FOLLOW-UPS", String(stats.followUpsDue), "Pendentes ou vencidos"],
    ["CONVERSÃO", `${stats.conversionRate}%`, "Fechados / total"],
  ];

  return (
    <main className={styles.page}>
      <header className={styles.dashboardHeader}>
        <a className={styles.brand} href="/" aria-label="NED Marketing">
          <strong>NED</strong>
          <small>CRM</small>
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
            <span className={styles.eyebrow}>PIPELINE COMERCIAL / NED</span>
            <h1>
              Cada lead no <span>lugar certo.</span>
            </h1>
          </div>
          <p>
            Arraste os contatos entre as etapas, priorize o que exige atenção e abra
            os detalhes apenas quando precisar do histórico completo.
          </p>
        </section>

        {!databaseConfigured && (
          <div className={styles.warning}>
            Configure DATABASE_URL na Vercel para ativar a captura e o pipeline.
          </div>
        )}

        <section className={upgrade.metricGrid} aria-label="Indicadores comerciais">
          {metrics.map(([label, value, description]) => (
            <article className={upgrade.metric} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{description}</small>
            </article>
          ))}
        </section>

        <section className={pipeline.filters} aria-label="Filtros de leads">
          <div className={pipeline.searchField}>
            <Search size={16} />
            <input
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilters();
              }}
              placeholder="Buscar nome, empresa, WhatsApp ou desafio"
            />
          </div>

          <select
            value={draftFilters.priority}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                priority: event.target.value,
              }))
            }
          >
            <option value="">Todas as prioridades</option>
            {leadPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {leadPriorityLabels[priority]}
              </option>
            ))}
          </select>

          <select
            value={draftFilters.service}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                service: event.target.value,
              }))
            }
          >
            <option value="">Todos os serviços</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <select
            value={draftFilters.source}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                source: event.target.value,
              }))
            }
          >
            <option value="">Todas as origens</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {leadSourceLabels[source] ?? source}
              </option>
            ))}
          </select>

          <select
            value={draftFilters.attention}
            onChange={(event) =>
              setDraftFilters((current) => ({
                ...current,
                attention: event.target.value,
              }))
            }
          >
            <option value="">Todos os follow-ups</option>
            <option value="pending">Somente pendências</option>
          </select>

          <div className={pipeline.filterActions}>
            <button className={styles.primaryButton} type="button" onClick={applyFilters}>
              Filtrar
            </button>
            <button className={styles.secondaryButton} type="button" onClick={clearFilters}>
              <RefreshCcw size={14} /> Limpar
            </button>
          </div>
        </section>

        <div className={pipeline.boardHeading}>
          <div>
            <span>PIPELINE</span>
            <strong>{leads.length} contatos visíveis</strong>
          </div>
          <p>
            <GripVertical size={14} /> Arraste um card para mudar a etapa.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>Carregando contatos...</div>
        ) : (
          <div className={pipeline.boardScroll}>
            <section className={pipeline.board} aria-label="Pipeline de leads">
              {leadStatuses.map((status) => {
                const columnLeads = leadsByStatus[status];
                const isDropTarget = dragOverStatus === status;

                return (
                  <div
                    className={`${pipeline.column} ${
                      isDropTarget ? pipeline.columnDropTarget : ""
                    }`}
                    data-status={status}
                    key={status}
                    onDragEnter={() => setDragOverStatus(status)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                        setDragOverStatus("");
                      }
                    }}
                    onDrop={(event) => dropLead(event, status)}
                  >
                    <header className={pipeline.columnHeader}>
                      <div>
                        <span className={pipeline.columnMarker} />
                        <strong>{leadStatusLabels[status]}</strong>
                      </div>
                      <span className={pipeline.columnCount}>{columnLeads.length}</span>
                    </header>

                    <div className={pipeline.columnBody}>
                      {columnLeads.length === 0 ? (
                        <div className={pipeline.emptyColumn}>
                          Solte um contato aqui.
                        </div>
                      ) : (
                        columnLeads.map((lead) => {
                          const isBusy =
                            savingId === lead.id || deletingId === lead.id;
                          return (
                            <article
                              className={`${pipeline.card} ${
                                draggingId === lead.id ? pipeline.cardDragging : ""
                              }`}
                              draggable={!isBusy}
                              key={lead.id}
                              onDragStart={(event) => {
                                event.dataTransfer.setData("text/plain", lead.id);
                                event.dataTransfer.effectAllowed = "move";
                                setDraggingId(lead.id);
                              }}
                              onDragEnd={() => {
                                setDraggingId("");
                                setDragOverStatus("");
                              }}
                              aria-label={`${lead.name}, ${leadStatusLabels[lead.status]}`}
                            >
                              <div className={pipeline.cardTop}>
                                <button
                                  className={pipeline.dragHandle}
                                  type="button"
                                  title="Arraste para mover"
                                  aria-label={`Arrastar ${lead.name}`}
                                >
                                  <GripVertical size={16} />
                                </button>

                                <div className={pipeline.cardBadges}>
                                  <span
                                    className={`${upgrade.priorityBadge} ${priorityClass(
                                      lead.priority,
                                    )}`}
                                  >
                                    {leadPriorityLabels[lead.priority]}
                                  </span>
                                  <span className={upgrade.scoreBadge}>
                                    {lead.score}/100
                                  </span>
                                </div>

                                <button
                                  className={pipeline.deleteButton}
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => void deleteLead(lead)}
                                  title="Excluir contato"
                                  aria-label={`Excluir ${lead.name}`}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>

                              <a
                                className={pipeline.identity}
                                href={`/admin/leads/${lead.id}`}
                              >
                                <strong>{lead.name}</strong>
                                <span>{lead.company}</span>
                              </a>

                              <div className={pipeline.need}>
                                <span>{lead.service}</span>
                                <p>{lead.challenge}</p>
                              </div>

                              <div className={pipeline.tags}>
                                <span>{leadSourceLabels[lead.source] ?? lead.source}</span>
                                <span>{lead.urgency}</span>
                              </div>

                              {lead.attention.active && (
                                <div className={pipeline.attention}>
                                  <Clock3 size={13} />
                                  <span>{lead.attention.label}</span>
                                </div>
                              )}

                              <div className={pipeline.cardMeta}>
                                <span>Entrada: {formatShortDate(lead.createdAt)}</span>
                                {lead.nextFollowUpAt && (
                                  <span>
                                    Próximo: {formatDate(lead.nextFollowUpAt)}
                                  </span>
                                )}
                              </div>

                              <div className={pipeline.cardActions}>
                                <a
                                  className={pipeline.whatsappAction}
                                  href={whatsappUrl(lead)}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => void registerContact(lead)}
                                >
                                  <MessageCircle size={15} />
                                  WhatsApp
                                </a>
                                <a
                                  className={pipeline.detailAction}
                                  href={`/admin/leads/${lead.id}`}
                                >
                                  <ExternalLink size={14} />
                                  Detalhes
                                </a>
                              </div>

                              <label className={pipeline.moveControl}>
                                <span>MOVER PARA</span>
                                <select
                                  value={lead.status}
                                  disabled={isBusy}
                                  onChange={(event) =>
                                    void moveLead(
                                      lead,
                                      event.target.value as LeadStatus,
                                    )
                                  }
                                >
                                  {leadStatuses.map((option) => (
                                    <option key={option} value={option}>
                                      {leadStatusLabels[option]}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </article>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
