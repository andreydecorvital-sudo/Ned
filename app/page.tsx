import type { Metadata } from "next";
import { ArrowRight, Check, MessageCircle, Settings2 } from "lucide-react";
import CaseVisual from "./components/case-visual";
import { CommercialPage } from "./components/commercial-shell";
import { NedSpiral } from "./components/ned-brand-mark";
import styles from "./home-commercial.module.css";

export const metadata: Metadata = {
  title: "Ned Marketing — estratégia, conteúdo, conversão e marketplaces",
  description:
    "Marketing para empresas que precisam apresentar melhor sua marca, gerar oportunidades e vender com mais direção. Atendimento e investimento definidos após análise.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    number: "01",
    accent: "content",
    label: "MARCA / CONTEÚDO",
    title: "Marketing e conteúdo",
    description:
      "Posicionamento, campanhas e comunicação para sua marca ser entendida, lembrada e escolhida.",
    deliverables: [
      "Posicionamento e mensagem principal",
      "Campanhas, conceitos e direção criativa",
      "Criativos, textos e calendário de conteúdo",
      "Feed, Stories, carrosséis e peças comerciais",
    ],
    href: "/servicos/marketing-conteudo",
  },
  {
    number: "02",
    accent: "sites",
    label: "AQUISIÇÃO / CONVERSÃO",
    title: "Conversão e aquisição",
    description:
      "Páginas e campanhas conectadas para transformar atenção em contato, oportunidade e próximo passo claro.",
    deliverables: [
      "Sites e landing pages",
      "Meta Ads e Google Ads",
      "Oferta, CTA e jornada para WhatsApp",
      "Rastreamento e otimização",
    ],
    href: "/servicos/sites",
  },
  {
    number: "03",
    accent: "marketplaces",
    label: "CATÁLOGO / OPERAÇÃO",
    title: "Marketplaces",
    description:
      "Comunicação, catálogo e rotina comercial para melhorar a presença da marca nos canais de venda.",
    deliverables: [
      "Catálogo e apresentação dos anúncios",
      "Criativos e campanhas",
      "Mercado Livre, Shopee, Amazon e TikTok Shop",
      "Reputação e oportunidades comerciais",
    ],
    href: "/servicos/marketplaces",
  },
];

const works = [
  {
    type: "DIAGNÓSTICO INTERATIVO",
    title: "NED Score",
    context: "Empresas chegam ao marketing sem saber qual problema atacar primeiro.",
    decision: "Transformar perguntas estratégicas em uma leitura simples e acionável.",
    delivery: "Diagnóstico, pontuação, recomendações e qualificação do contato.",
    href: "/ned-score",
    variant: "score" as const,
  },
  {
    type: "EXPERIÊNCIA / NED LAB",
    title: "A Máquina Quebrada",
    context: "Falar de oferta, atendimento e operação sem produzir mais um conteúdo passivo.",
    decision: "Usar observação, descoberta e escolhas para construir participação.",
    delivery: "Cena investigável, desafios, resultado dinâmico e CTA contextualizado.",
    href: "/portfolio/maquina-quebrada",
    variant: "machine" as const,
  },
  {
    type: "MÉTODO E PRODUÇÃO",
    title: "NED Growth Studio",
    context: "Ferramentas de conteúdo costumam depender demais de geração automática.",
    decision: "Colocar briefing, método e revisão humana antes da inteligência artificial.",
    delivery: "Planejamento, estrutura por formato, avaliação e fluxo de aprovação.",
    href: "/portfolio#growth-studio",
    variant: "studio" as const,
  },
];

const process = [
  ["01", "Entender", "Negócio, público, oferta, momento e objetivo antes de escolher canal ou formato."],
  ["02", "Direcionar", "Prioridades, mensagem, entregas, investimento e critérios de aprovação."],
  ["03", "Executar", "Conteúdo, campanha, página ou operação produzida com decisões explicadas."],
  ["04", "Aprender", "Dados e feedback usados para corrigir a próxima ação, sem continuidade forçada."],
];

export default function Home() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>NED MARKETING / DIREÇÃO ANTES DE FERRAMENTA</span>
          <h1>
            Sua marca não precisa de mais posts. <span>Precisa de direção.</span>
          </h1>
          <p className={styles.heroLead}>
            A NED organiza mensagem, conteúdo, páginas, campanhas e marketplaces para sua empresa apresentar melhor o que vende e transformar interesse em oportunidades reais.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/analise-gratuita">
              Solicitar análise <ArrowRight size={17} />
            </a>
            <a className={styles.secondary} href="/portfolio">Ver trabalhos</a>
          </div>
          <div className={styles.heroProof}>
            <span>Atendimento direto</span>
            <span>Escopo sob análise</span>
            <span>Projetos em todo o Brasil</span>
          </div>
        </div>

        <div className={styles.heroMatter} aria-label="Composição editorial da NED Marketing">
          <div className={styles.materialGrid} aria-hidden="true" />
          <div className={styles.materialPlate} aria-hidden="true">
            <span>ESTRATÉGIA</span>
            <strong>NED</strong>
          </div>
          <div className={styles.caseStrip}>
            <span>MARCA</span>
            <span>DEMANDA</span>
            <span>VENDA</span>
          </div>
          <div className={styles.heroStatement}>
            <small>UMA DIREÇÃO / TRÊS FRENTES</small>
            <strong>Clareza vira percepção. Percepção vira decisão.</strong>
          </div>
          <NedSpiral className={styles.heroSpiral} />
        </div>
      </section>

      <section className={styles.section} id="servicos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>O QUE A NED RESOLVE</span>
            <h2 className={styles.sectionTitle}>Três frentes. <span>Uma conversa mais simples.</span></h2>
          </div>
          <p>Você não precisa escolher entre uma lista técnica de serviços. Começamos pelo problema e combinamos somente as entregas necessárias para o momento da empresa.</p>
        </div>

        <div className={styles.pillars}>
          {pillars.map(({ number, accent, label, title, description, deliverables, href }) => (
            <article className={styles.pillar} data-pillar-accent={accent} key={number}>
              <div className={styles.pillarTop}>
                <span className={styles.pillarLabel}>{label}</span>
                <span className={styles.pillarNumber}>{number}</span>
              </div>
              <div className={styles.pillarRule} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
              <ul className={styles.deliverables}>
                {deliverables.map((item) => <li key={item}><Check size={14} /> {item}</li>)}
              </ul>
              <a className={styles.textLink} href={href}>Ver entregas <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>

        <div className={styles.supportNote}>
          <Settings2 size={20} />
          <span><strong>Tecnologia entra como apoio.</strong> CRM, automação e inteligência artificial são usados quando ajudam a organizar atendimento, reduzir perda e executar melhor — não como a promessa principal da NED.</span>
        </div>
      </section>

      <div className={styles.paperSection}>
        <section className={styles.sectionSoft}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrowDark}>TRABALHOS SELECIONADOS</span>
              <h2 className={styles.sectionTitleDark}>O trabalho precisa <span>aparecer acontecendo.</span></h2>
            </div>
            <p>Os projetos abaixo são próprios da NED. Em vez de ícones genéricos, cada case mostra um fragmento visual do sistema ou experiência construída.</p>
          </div>

          <div className={styles.workGrid}>
            {works.map(({ type, title, context, decision, delivery, href, variant }) => (
              <article className={styles.workCard} key={title}>
                <CaseVisual variant={variant} />
                <div className={styles.workContent}>
                  <span className={styles.workType}>{type}</span>
                  <h3>{title}</h3>
                  <div className={styles.caseMeta}>
                    <div><strong>Contexto</strong><span>{context}</span></div>
                    <div><strong>Decisão</strong><span>{decision}</span></div>
                    <div><strong>Entrega</strong><span>{delivery}</span></div>
                  </div>
                  <a className={styles.textLinkDark} href={href}>Abrir trabalho <ArrowRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.primaryDark} href="/portfolio">Ver portfólio completo <ArrowRight size={16} /></a>
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>COMO FUNCIONA</span>
            <h2 className={styles.sectionTitle}>Sem pacote empurrado. <span>Sem caixa-preta.</span></h2>
          </div>
          <p>Cada etapa termina com uma decisão ou entrega concreta. Você sabe o que está sendo feito, por que foi escolhido e qual é o próximo passo.</p>
        </div>
        <div className={styles.processGrid}>
          {process.map(([number, title, text]) => (
            <article className={styles.processStep} key={number}>
              <span>{number}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <div className={styles.actions}>
          <a className={styles.secondary} href="/processo">Entender o processo <ArrowRight size={15} /></a>
        </div>
      </section>

      <div className={styles.paperSection}>
        <section className={`${styles.sectionSoft} ${styles.human}`}>
          <div className={styles.humanCard} aria-label="Andrey, criador da NED Marketing">
            <div className={styles.humanTexture} aria-hidden="true" />
            <span className={styles.humanMonogram}>A</span>
            <span className={styles.humanBadge}>ANDREY / NED</span>
          </div>
          <div className={styles.humanCopy}>
            <span className={styles.eyebrowDark}>QUEM CONDUZ O PROJETO</span>
            <h2>Você conversa com <span>Andrey.</span></h2>
            <p>Minha trajetória começou aos 16 anos no atendimento, passou por vendas, treinamento, liderança, restaurantes e marketplaces até chegar ao marketing. Essa experiência formou a maneira como conduzo a NED: entendendo pessoas, conectando promessa à operação e explicando as decisões importantes do projeto.</p>
            <div className={styles.principles}>
              <div className={styles.principle}><span>01</span><div><strong>Direção antes de ferramenta</strong><small>Canal, tecnologia e formato vêm depois do problema e do objetivo.</small></div></div>
              <div className={styles.principle}><span>02</span><div><strong>Atendimento também é marketing</strong><small>A experiência depois do primeiro contato influencia a confiança e a decisão.</small></div></div>
              <div className={styles.principle}><span>03</span><div><strong>Presença sem exposição forçada</strong><small>A história é apresentada com transparência, sem foto obrigatória ou personagem artificial.</small></div></div>
            </div>
            <div className={styles.actions}>
              <a className={styles.primaryDark} href="/sobre">Conhecer minha história <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.finalCta}>
        <div>
          <span className={styles.eyebrow}>PRÓXIMO PASSO</span>
          <h2>Mostre o negócio. <span>A direção vem depois.</span></h2>
        </div>
        <div>
          <p>Envie seu site, Instagram ou marketplace. A análise inicial organiza o cenário antes de qualquer proposta, pacote ou promessa.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/analise-gratuita">Solicitar análise <ArrowRight size={17} /></a>
            <a className={styles.secondary} href="https://wa.me/5511917814612?text=Ol%C3%A1%2C%20Ned!%20Quero%20conversar%20sobre%20marketing%20para%20minha%20empresa." target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </CommercialPage>
  );
}
