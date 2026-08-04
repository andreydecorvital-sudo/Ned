import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Megaphone,
  MousePointerClick,
  Settings2,
  ShoppingBag,
} from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Serviços — marketing, conversão e marketplaces",
  description:
    "Conheça as três frentes da NED Marketing: marketing e conteúdo, conversão e aquisição, e marketplaces. Escopo e investimento definidos após análise.",
  alternates: { canonical: "/servicos" },
};

const pillars = [
  {
    icon: Megaphone,
    number: "01",
    eyebrow: "MARKETING E CONTEÚDO",
    title: "Apresentar melhor a marca e criar comunicação com função.",
    description:
      "Para empresas que precisam organizar posicionamento, mensagem, campanhas e presença nas redes sem depender de postagem aleatória.",
    deliveries: [
      "Posicionamento e proposta de valor",
      "Campanhas e direção criativa",
      "Criativos, copy e calendário",
      "Feed, Stories, carrosséis e peças comerciais",
    ],
    href: "/servicos/marketing-conteudo",
  },
  {
    icon: MousePointerClick,
    number: "02",
    eyebrow: "CONVERSÃO E AQUISIÇÃO",
    title: "Transformar atenção em contato e próximo passo claro.",
    description:
      "Para empresas que já têm uma oferta, mas precisam melhorar páginas, campanhas, rastreamento ou a jornada até o WhatsApp.",
    deliveries: [
      "Sites e landing pages",
      "Meta Ads e Google Ads",
      "Oferta, CTA e jornada de conversão",
      "Métricas, testes e otimização",
    ],
    href: "/servicos/sites",
    secondHref: "/servicos/trafego-pago",
  },
  {
    icon: ShoppingBag,
    number: "03",
    eyebrow: "MARKETPLACES",
    title: "Fortalecer comunicação, catálogo e rotina nos canais de venda.",
    description:
      "Para operações que vendem em Mercado Livre, Shopee, Amazon ou TikTok Shop e precisam de mais consistência na apresentação e execução.",
    deliveries: [
      "Catálogo e estrutura de anúncios",
      "Criativos e campanhas",
      "Reputação e experiência de compra",
      "Acompanhamento de oportunidades",
    ],
    href: "/servicos/marketplaces",
  },
];

export default function ServicesPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>SERVIÇOS / NED MARKETING</span>
          <h1>Comece pelo problema. <span>Não pela ferramenta.</span></h1>
          <p className={styles.heroLead}>
            A NED organiza a oferta pública em três frentes para facilitar a escolha. O projeto pode começar em uma delas ou combinar entregas depois da análise do negócio.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#frentes">Ver as três frentes <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise</a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Resumo das frentes de marketing">
          <span className={styles.panelLabel}>OFERTA NED / 03 FRENTES</span>
          <div className={styles.panelStack}>
            {pillars.map((pillar) => (
              <div className={styles.panelItem} key={pillar.number}>
                <span>{pillar.number}</span><strong>{pillar.eyebrow}</strong><small>{pillar.deliveries[0]}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.pageSection} id="frentes">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>ENTREGAS CONCRETAS</span>
            <h2 className={styles.sectionTitle}>O que pode entrar <span>no projeto.</span></h2>
          </div>
          <p>As listas abaixo mostram entregas possíveis, não pacotes fechados. O escopo final depende do objetivo, dos ativos existentes, do prazo e da capacidade de execução da empresa.</p>
        </div>

        <div className={styles.serviceGrid}>
          {pillars.map(({ icon: Icon, number, eyebrow, title, description, deliveries, href, secondHref }) => (
            <article className={styles.serviceCard} key={number}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}><Icon size={23} /></span>
                <span className={styles.cardNumber}>{number}</span>
              </div>
              <h2>{eyebrow}</h2>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul className={styles.problemList}>
                  {deliveries.map((delivery) => <li key={delivery}><Check size={14} /> {delivery}</li>)}
                </ul>
              </div>
              <div className={styles.heroActions}>
                <a className={styles.cardLink} href={href}>Ver detalhes <ArrowRight size={16} /></a>
                {secondHref && <a className={styles.textLink} href={secondHref}>Ver tráfego pago</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.communication}>
          <aside className={styles.communicationAside}>
            <span className={styles.eyebrow}>TECNOLOGIA NOS BASTIDORES</span>
            <h2>Automação não é a oferta principal.</h2>
            <p>Ela entra quando ajuda a organizar contatos, reduzir tarefas repetitivas, registrar decisões ou diminuir oportunidades perdidas.</p>
          </aside>
          <div className={styles.communicationMain}>
            <span className={styles.eyebrow}>APOIO À EXECUÇÃO</span>
            <h2>Ferramenta só faz sentido quando resolve uma perda real.</h2>
            <ul className={styles.checkList}>
              <li><Settings2 size={15} /> CRM e organização de oportunidades.</li>
              <li><Settings2 size={15} /> Respostas iniciais e triagem de contatos.</li>
              <li><Settings2 size={15} /> Integrações entre formulário, atendimento e agenda.</li>
              <li><Settings2 size={15} /> Inteligência artificial supervisionada para rascunhos e análise.</li>
            </ul>
            <a className={styles.textLink} href="/servicos/automacoes">Conhecer automações de apoio <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Não sabe qual frente precisa vir primeiro?</h2>
            <p>Envie o site, Instagram ou marketplace. A NED organiza o cenário e recomenda uma prioridade antes de discutir investimento.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
