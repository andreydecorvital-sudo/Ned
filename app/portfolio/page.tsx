import type { Metadata } from "next";
import { ArrowRight, Check, Gauge, Gamepad2, Megaphone, PanelsTopLeft, Target, TrendingUp } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Portfólio de marketing — estratégia, criação e experiências NED",
  description:
    "Conheça projetos próprios e experiências da NED Marketing que demonstram posicionamento, direção criativa, conteúdo, conversão e mensuração.",
  alternates: { canonical: "/portfolio" },
};

const projects = [
  {
    type: "ESTRATÉGIA DE MARKETING / FEATURED",
    title: "Estratégia de Crescimento NED",
    description:
      "Uma proposta de marketing integrado que organiza diagnóstico, posicionamento, criação, presença digital, aquisição e acompanhamento em uma direção única.",
    href: "/maquina-de-clientes",
    cta: "Explorar estratégia",
    tags: ["Posicionamento", "Campanhas", "Conversão", "Jornada"],
    facts: ["Marketing organizado por objetivo", "Escopo definido após análise", "Estratégia conectada à execução"],
    icon: TrendingUp,
    featured: true,
  },
  {
    type: "DIAGNÓSTICO INTERATIVO",
    title: "NED Score",
    description:
      "Experiência de oito etapas que transforma respostas em uma leitura inicial sobre oferta, posicionamento, presença, aquisição, atendimento e consistência.",
    href: "/ned-score",
    cta: "Testar NED Score",
    tags: ["Diagnóstico", "Experiência", "Conteúdo", "Qualificação"],
    facts: ["Pontuação de 0 a 100", "Leitura personalizada", "Próximos pontos de atenção"],
    icon: Gauge,
  },
  {
    type: "CONTEÚDO INTERATIVO / NED LAB",
    title: "A Máquina Quebrada",
    description:
      "Narrativa gamificada sobre oferta, atendimento e operação. O resultado muda conforme as decisões e pode ser compartilhado em formato vertical.",
    href: "/lab/maquina-quebrada",
    cta: "Jogar experiência",
    tags: ["Gamificação", "Storytelling", "Conteúdo", "Compartilhamento"],
    facts: ["Três desafios de negócio", "Resultado dinâmico", "Formato pensado para redes sociais"],
    icon: Gamepad2,
  },
  {
    type: "BASTIDOR COMERCIAL",
    title: "Organização de oportunidades NED",
    description:
      "Estrutura interna criada para acompanhar contatos, origem, prioridade e próximos passos. Ela demonstra como a tecnologia pode apoiar o marketing sem ocupar o lugar da estratégia.",
    href: "/processo",
    cta: "Entender o processo",
    tags: ["Atendimento", "Follow-up", "Dados", "Experiência"],
    facts: ["Visão do caminho comercial", "Histórico e prioridade", "Apoio à tomada de decisão"],
    icon: Target,
  },
  {
    type: "PLATAFORMA DE EXPERIÊNCIAS",
    title: "NED LAB",
    description:
      "Área criada para publicar experimentos de comunicação, interação e conteúdo que demonstram ideias em funcionamento, não apenas em apresentações.",
    href: "/lab",
    cta: "Abrir NED LAB",
    tags: ["Experimentos", "Interação", "Direção criativa", "Portfólio vivo"],
    facts: ["Ambiente de testes públicos", "Experiências compartilháveis", "Base para novos formatos"],
    icon: PanelsTopLeft,
  },
];

const capabilities = [
  {
    icon: Target,
    title: "Estratégia e posicionamento",
    text: "Leitura do negócio, público, proposta de valor, mensagem e prioridades antes de decidir canais ou formatos.",
  },
  {
    icon: Megaphone,
    title: "Direção criativa e conteúdo",
    text: "Conceitos, narrativas, peças e experiências que traduzem a estratégia em comunicação com personalidade e função.",
  },
  {
    icon: TrendingUp,
    title: "Aquisição e conversão",
    text: "Campanhas, páginas e jornadas pensadas para levar a mensagem até o público e facilitar o próximo passo.",
  },
  {
    icon: Gauge,
    title: "Mensuração e evolução",
    text: "Origem, comportamento e qualidade das oportunidades usados para melhorar mensagens, criativos, páginas e campanhas.",
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
          <span className={styles.eyebrow}>PORTFÓLIO / MARKETING EM PRÁTICA</span>
          <h1>
            Não inventamos resultado. <span>Mostramos raciocínio e execução.</span>
          </h1>
          <p className={styles.heroLead}>
            Este portfólio reúne estratégias, experiências e ferramentas próprias. Cada projeto demonstra uma parte real da capacidade da NED: posicionamento, direção criativa, conteúdo, conversão, interação e mensuração.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#projetos">Ver projetos <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/analise-gratuita">Trazer um desafio</a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Resumo do portfólio NED">
          <span className={styles.panelLabel}>PORTFÓLIO VIVO / MARKETING EM MOVIMENTO</span>
          <div className={styles.panelStack}>
            <div className={styles.panelItem}><span>01</span><strong>Estratégia</strong><small>Posicionamento e direção</small></div>
            <div className={styles.panelItem}><span>02</span><strong>Criação</strong><small>Conteúdo e campanhas</small></div>
            <div className={styles.panelItem}><span>03</span><strong>Experiência</strong><small>Interação e conversão</small></div>
            <div className={styles.panelItem}><span>04</span><strong>Aprendizado</strong><small>Dados e otimização</small></div>
          </div>
        </aside>
      </section>

      <section className={styles.pageSectionDark} id="projetos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PROJETOS SELECIONADOS</span>
            <h2 className={styles.sectionTitle}>Ideias que você pode <span>abrir e experimentar.</span></h2>
          </div>
          <p>Os projetos públicos possuem links diretos. Ferramentas internas são apresentadas sem expor dados, senhas ou informações comerciais.</p>
        </div>

        <div className={styles.portfolioNotice}>
          Estes trabalhos são projetos próprios e demonstrações da NED. Eles não são apresentados como resultados de clientes e não usam métricas comerciais fictícias.
        </div>

        <div className={styles.projectGrid} style={{ marginTop: 18 }}>
          {projects.map(({ type, title, description, href, cta, tags, facts, icon: Icon, featured }) => (
            <article className={`${styles.projectCard}${featured ? ` ${styles.projectCardFeatured}` : ""}`} key={title}>
              <div className={styles.projectContent}>
                <div className={styles.projectTop}>
                  <span className={styles.projectType}>{type}</span>
                  <span className={styles.projectStatus}>CRIADO PELA NED</span>
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
            <h2 className={styles.sectionTitle}>Marketing pensado em <span>várias camadas.</span></h2>
          </div>
          <p>Um bom portfólio não precisa mostrar apenas a peça final. Ele também precisa deixar claro o problema, a ideia, a experiência criada e o tipo de decisão que o trabalho ajuda a melhorar.</p>
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
            <h2>Seu projeto pode ser o próximo trabalho bem direcionado.</h2>
            <p>Envie o contexto atual. A NED analisa primeiro a marca, o objetivo e o público; depois define quais ações de marketing fazem sentido e qual investimento será necessário.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
