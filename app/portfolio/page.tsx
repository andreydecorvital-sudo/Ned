import type { Metadata } from "next";
import { ArrowRight, Check, Code2, Gauge, Gamepad2, LayoutDashboard, PanelsTopLeft, Workflow } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Portfólio — projetos e demonstrações NED",
  description:
    "Conheça projetos próprios, ferramentas e experiências construídas pela NED Marketing para sites, captação, CRM, automação e diagnóstico.",
  alternates: { canonical: "/portfolio" },
};

const projects = [
  {
    type: "PRODUTO COMERCIAL / FEATURED",
    title: "Máquina de Clientes NED",
    description:
      "Uma oferta transformada em produto digital: landing page, explicação do sistema, planos, captação contextualizada e integração com CRM.",
    href: "/maquina-de-clientes",
    cta: "Explorar produto",
    tags: ["Oferta", "Landing page", "CRM", "Conversão"],
    facts: ["Jornada da descoberta ao follow-up", "Planos com escopo inicial", "Formulário conectado ao pipeline"],
    icon: Workflow,
    featured: true,
  },
  {
    type: "FERRAMENTA INTERATIVA",
    title: "NED Score",
    description:
      "Diagnóstico de oito etapas que transforma respostas em pontuação, perfil, gargalo principal e recomendações, conduzindo o visitante para uma conversa com contexto.",
    href: "/ned-score",
    cta: "Testar NED Score",
    tags: ["Quiz", "Lead qualification", "UX", "Analytics"],
    facts: ["Pontuação de 0 a 100", "Resultado personalizado", "Contexto enviado ao CRM"],
    icon: Gauge,
  },
  {
    type: "EXPERIÊNCIA / NED LAB",
    title: "A Máquina Quebrada",
    description:
      "Experiência gamificada sobre oferta, atendimento e operação. O resultado muda conforme as decisões e pode ser compartilhado em formato vertical.",
    href: "/lab/maquina-quebrada",
    cta: "Jogar experiência",
    tags: ["Gamificação", "Storytelling", "Share card", "GA4"],
    facts: ["Três desafios de negócio", "Resultado dinâmico", "Imagem compartilhável"],
    icon: Gamepad2,
  },
  {
    type: "SISTEMA INTERNO",
    title: "CRM NED",
    description:
      "Sistema protegido para capturar, priorizar e acompanhar leads. A tela pública mostra a capacidade do produto; o acesso real permanece restrito por conter dados comerciais.",
    href: "/processo",
    cta: "Entender o processo",
    tags: ["PostgreSQL", "Kanban", "Follow-up", "LGPD"],
    facts: ["Pipeline arrastável", "Histórico e prioridade", "Filtros, métricas e exportação"],
    icon: LayoutDashboard,
  },
  {
    type: "PLATAFORMA DE DEMONSTRAÇÕES",
    title: "NED LAB",
    description:
      "Área criada para publicar experiências interativas que provam raciocínio, design e desenvolvimento em vez de depender apenas de textos institucionais.",
    href: "/lab",
    cta: "Abrir NED LAB",
    tags: ["Experimentos", "Interação", "Design editorial", "Portfólio vivo"],
    facts: ["Ambiente separado da home", "Experiências publicáveis", "Base para novos projetos"],
    icon: PanelsTopLeft,
  },
];

const capabilities = [
  {
    icon: Code2,
    title: "Produto e desenvolvimento",
    text: "Arquitetura de páginas, interfaces responsivas, APIs, banco de dados, autenticação e deploy em produção.",
  },
  {
    icon: PanelsTopLeft,
    title: "Design com função",
    text: "Hierarquia, narrativa, movimento e interação usados para orientar a pessoa, não apenas para decorar a tela.",
  },
  {
    icon: Workflow,
    title: "Operação conectada",
    text: "Formulários, WhatsApp, CRM, prioridade, histórico e analytics funcionando como uma jornada única.",
  },
  {
    icon: Gauge,
    title: "Mensuração e aprendizado",
    text: "Eventos, origem, campanhas e comportamento registrados para entender quais entradas realmente geram oportunidades.",
  },
];

function ProjectVisual({ title, icon: Icon }: { title: string; icon: typeof Gauge }) {
  return (
    <div className={styles.projectVisual} aria-hidden="true">
      <div className={styles.browserMock}>
        <div className={styles.browserBar}><i /><i /><i /></div>
        <div className={styles.browserBody}>
          <div className={styles.browserRail}><span /><span /><span /><span /></div>
          <div className={styles.browserCanvas}>
            <Icon size={28} />
            <strong>{title}</strong>
            <span /><span />
            <div className={styles.browserCards}><div /><div /><div /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>PORTFÓLIO / PROVA PELO PRODUTO</span>
          <h1>
            Não inventamos case. <span>Mostramos o que construímos.</span>
          </h1>
          <p className={styles.heroLead}>
            Este portfólio reúne produtos próprios, ferramentas internas e experiências públicas. Cada projeto demonstra uma parte real da capacidade da NED: estratégia, design, desenvolvimento, automação e operação comercial.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#projetos">Ver projetos <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/analise-gratuita">Trazer um desafio</a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Resumo do portfólio NED">
          <span className={styles.panelLabel}>PORTFÓLIO VIVO / SISTEMAS REAIS</span>
          <div className={styles.panelStack}>
            <div className={styles.panelItem}><span>01</span><strong>Produtos comerciais</strong><small>Oferta e conversão</small></div>
            <div className={styles.panelItem}><span>02</span><strong>Ferramentas interativas</strong><small>Diagnóstico e UX</small></div>
            <div className={styles.panelItem}><span>03</span><strong>Sistemas internos</strong><small>CRM e operação</small></div>
            <div className={styles.panelItem}><span>04</span><strong>Experiências</strong><small>NED LAB</small></div>
          </div>
        </aside>
      </section>

      <section className={styles.pageSectionDark} id="projetos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PROJETOS SELECIONADOS</span>
            <h2 className={styles.sectionTitle}>Estratégia que você pode <span>abrir e testar.</span></h2>
          </div>
          <p>Os projetos públicos possuem links diretos. Sistemas internos são apresentados sem expor dados, senhas ou áreas administrativas.</p>
        </div>

        <div className={styles.portfolioNotice}>
          Estes trabalhos são projetos próprios e demonstrações da NED. Eles não são apresentados como resultados de clientes nem usam métricas comerciais fictícias.
        </div>

        <div className={styles.projectGrid} style={{ marginTop: 18 }}>
          {projects.map(({ type, title, description, href, cta, tags, facts, icon: Icon, featured }) => (
            <article className={`${styles.projectCard}${featured ? ` ${styles.projectCardFeatured}` : ""}`} key={title}>
              <div className={styles.projectContent}>
                <div className={styles.projectTop}>
                  <span className={styles.projectType}>{type}</span>
                  <span className={styles.projectStatus}>CONSTRUÍDO PELA NED</span>
                </div>
                <h2 className={styles.projectTitle}>{title}</h2>
                <p className={styles.projectDescription}>{description}</p>
                <ul className={styles.projectFacts}>
                  {facts.map((fact) => <li key={fact}><Check size={14} /> {fact}</li>)}
                </ul>
                <div className={styles.tagRow}>
                  {tags.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}
                </div>
                <a className={styles.textLink} href={href}>{cta} <ArrowRight size={15} /></a>
              </div>
              <ProjectVisual title={title} icon={Icon} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>O QUE O PORTFÓLIO COMPROVA</span>
            <h2 className={styles.sectionTitle}>Capacidade em <span>várias camadas.</span></h2>
          </div>
          <p>Um bom portfólio não precisa mostrar apenas telas finais. Ele também precisa deixar claro o tipo de problema que conseguimos estruturar e executar.</p>
        </div>

        <div className={styles.valueGrid}>
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article className={styles.valueCard} key={title}>
              <span className={styles.cardIcon}><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Seu projeto pode ser o próximo sistema bem resolvido.</h2>
            <p>Envie o contexto atual. A NED analisa primeiro o problema, depois define se a solução exige site, automação, tráfego, marketplace ou uma combinação.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
