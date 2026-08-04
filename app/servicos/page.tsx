import type { Metadata } from "next";
import { ArrowRight, BarChart3, Bot, Check, Globe2, ShoppingBag } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";
import { serviceOrder, services, type ServiceSlug } from "./service-data";

export const metadata: Metadata = {
  title: "Serviços de marketing — estratégia, presença, aquisição e vendas",
  description:
    "Conheça as frentes da NED Marketing para posicionamento, presença digital, tráfego, conversão, automação de apoio e marketplaces.",
  alternates: { canonical: "/servicos" },
};

const icons = {
  sites: Globe2,
  automacoes: Bot,
  "trafego-pago": BarChart3,
  marketplaces: ShoppingBag,
} satisfies Record<ServiceSlug, typeof Globe2>;

const paths = [
  {
    label: "MARCA E PRESENÇA",
    title: "Preciso apresentar melhor meu negócio e gerar interesse.",
    text: "Comece por posicionamento, mensagem, conteúdo e uma presença digital que facilite a decisão do público.",
    href: "/servicos/sites",
  },
  {
    label: "AQUISIÇÃO E CAMPANHAS",
    title: "Já tenho uma oferta e quero alcançar mais pessoas.",
    text: "Campanhas e tráfego fazem mais sentido quando criativo, página, rastreamento e atendimento trabalham na mesma direção.",
    href: "/servicos/trafego-pago",
  },
  {
    label: "VENDAS E MARKETPLACES",
    title: "Quero melhorar minha presença nos canais de venda.",
    text: "Catálogo, anúncios, criativos, reputação e operação precisam sustentar a comunicação e o desempenho da marca.",
    href: "/servicos/marketplaces",
  },
  {
    label: "ATENDIMENTO E EFICIÊNCIA",
    title: "Meu marketing gera trabalho, mas o processo perde oportunidades.",
    text: "Automações entram como apoio para organizar contatos, informações e tarefas — sem substituir estratégia ou atendimento humano.",
    href: "/servicos/automacoes",
  },
];

export default function ServicesPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>SERVIÇOS / NED MARKETING</span>
          <h1>
            Escolha pelo <span>objetivo.</span>
          </h1>
          <p className={styles.heroLead}>
            Você não precisa chegar com um escopo técnico pronto. Comece pelo que sua marca precisa conquistar e veja como cada frente de marketing pode contribuir.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#servicos">
              Explorar serviços <ArrowRight size={17} />
            </a>
            <a className={styles.secondaryButton} href="/analise-gratuita">
              Quero uma recomendação
            </a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Mapa dos serviços NED">
          <span className={styles.panelLabel}>MAPA DE MARKETING / 04 FRENTES</span>
          <div className={styles.panelStack}>
            {serviceOrder.map((slug) => (
              <div className={styles.panelItem} key={slug}>
                <span>{services[slug].number}</span>
                <strong>{services[slug].shortName}</strong>
                <small>{services[slug].heroPoints[0]}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.pageSection} id="servicos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>VISÃO GERAL</span>
            <h2 className={styles.sectionTitle}>
              Quatro frentes. <span>Uma estratégia coerente.</span>
            </h2>
          </div>
          <p>
            Cada página detalha problemas atendidos, entregáveis, processo, público indicado e dúvidas frequentes. Uma frente pode ser contratada isoladamente ou combinada com outras após a análise.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {serviceOrder.map((slug) => {
            const service = services[slug];
            const Icon = icons[slug];
            return (
              <article className={styles.serviceCard} key={slug}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}><Icon size={23} /></span>
                  <span className={styles.cardNumber}>{service.number}</span>
                </div>
                <h2>{service.eyebrow}</h2>
                <div>
                  <p>{service.description}</p>
                  <ul className={styles.problemList}>
                    {service.heroPoints.map((point) => (
                      <li key={point}><Check size={14} /> {point}</li>
                    ))}
                  </ul>
                </div>
                <a className={styles.cardLink} href={`/servicos/${slug}`}>
                  Ver serviço completo <ArrowRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>ESCOLHA RÁPIDA</span>
            <h2 className={styles.sectionTitle}>Qual objetivo parece mais com o seu momento?</h2>
          </div>
          <p>Os caminhos abaixo são uma orientação inicial. A recomendação final e o investimento dependem do objetivo, do momento, dos ativos existentes e da prioridade da empresa.</p>
        </div>

        <div className={styles.decisionGrid}>
          {paths.map((item) => (
            <article className={styles.decisionCard} key={item.label}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a className={styles.textLink} href={item.href}>Ver caminho <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Prefere mostrar o negócio em vez de escolher um serviço?</h2>
            <p>Envie seu site, Instagram ou marketplace. A NED analisa comunicação, posicionamento, jornada e oportunidades antes de sugerir uma direção.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">
            Solicitar análise <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </CommercialPage>
  );
}
