import type { Metadata } from "next";
import { ArrowRight, BarChart3, Bot, Check, Globe2, ShoppingBag } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";
import { serviceOrder, services, type ServiceSlug } from "./service-data";

export const metadata: Metadata = {
  title: "Serviços — escolha a estrutura certa",
  description:
    "Conheça os serviços da NED Marketing para sites, automações, tráfego pago e marketplaces e encontre o caminho mais adequado para o seu negócio.",
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
    label: "PRESENÇA E CONVERSÃO",
    title: "Preciso apresentar melhor meu negócio e gerar contatos.",
    text: "Comece por sites e landing pages. Depois, conecte captação, CRM e tráfego quando a base estiver pronta.",
    href: "/servicos/sites",
  },
  {
    label: "ATENDIMENTO E OPERAÇÃO",
    title: "Minha equipe perde tempo com tarefas repetitivas.",
    text: "Automações ajudam a organizar mensagens, registros, integrações e tarefas que hoje dependem de cópia manual.",
    href: "/servicos/automacoes",
  },
  {
    label: "AQUISIÇÃO",
    title: "Já tenho uma oferta e quero alcançar mais pessoas.",
    text: "Tráfego pago faz mais sentido quando página, rastreamento e atendimento conseguem transformar atenção em oportunidade.",
    href: "/servicos/trafego-pago",
  },
];

export default function ServicesPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>SERVIÇOS / NED MARKETING</span>
          <h1>
            Escolha pelo <span>problema.</span>
          </h1>
          <p className={styles.heroLead}>
            Você não precisa saber o nome técnico da solução. Comece pelo que está travando seu negócio e veja exatamente o que cada serviço resolve, entrega e exige.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#servicos">
              Explorar serviços <ArrowRight size={17} />
            </a>
            <a className={styles.secondaryButton} href="/analise-gratuita">
              Não sei por onde começar
            </a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Mapa dos serviços NED">
          <span className={styles.panelLabel}>MAPA DE DECISÃO / 04 ÁREAS</span>
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
              Quatro áreas. <span>Uma operação conectada.</span>
            </h2>
          </div>
          <p>
            Cada página detalha problemas atendidos, entregáveis, processo, público indicado e dúvidas frequentes. Você pode contratar uma frente isolada ou combinar serviços conforme o diagnóstico.
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
            <h2 className={styles.sectionTitle}>Qual situação parece mais com a sua?</h2>
          </div>
          <p>Esses caminhos servem apenas como orientação inicial. A recomendação final depende do momento, orçamento, operação e prioridade da empresa.</p>
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
            <h2>Prefere mostrar o problema em vez de escolher um serviço?</h2>
            <p>Envie seu site, Instagram ou marketplace. A NED registra o contexto e identifica os pontos que merecem atenção primeiro.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">
            Solicitar análise <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </CommercialPage>
  );
}
