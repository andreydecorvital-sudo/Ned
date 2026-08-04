import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Gauge,
  Gamepad2,
  Layers3,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Settings2,
  ShoppingBag,
  Sparkles,
  Target,
} from "lucide-react";
import { CommercialPage } from "./components/commercial-shell";
import styles from "./home-commercial.module.css";

export const metadata: Metadata = {
  title: "Ned Marketing — estratégia, conteúdo, conversão e marketplaces",
  description:
    "Marketing para empresas que precisam apresentar melhor sua marca, gerar oportunidades e vender com mais direção. Atendimento e investimento definidos após análise.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    icon: Megaphone,
    number: "01",
    title: "Marketing e conteúdo",
    description:
      "Posicionamento, campanhas e comunicação para sua marca ser entendida, lembrada e escolhida.",
    deliverables: [
      "Posicionamento e mensagem principal",
      "Campanhas, conceitos e direção criativa",
      "Criativos, textos e calendário de conteúdo",
      "Peças para Feed, Stories e carrosséis",
    ],
    href: "/servicos/marketing-conteudo",
  },
  {
    icon: MousePointerClick,
    number: "02",
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
    icon: ShoppingBag,
    number: "03",
    title: "Marketplaces",
    description:
      "Comunicação, catálogo e rotina comercial para melhorar a presença da marca nos canais de venda.",
    deliverables: [
      "Catálogo e apresentação dos anúncios",
      "Criativos e campanhas",
      "Mercado Livre, Shopee, Amazon e TikTok Shop",
      "Acompanhamento de reputação e oportunidades",
    ],
    href: "/servicos/marketplaces",
  },
];

const works = [
  {
    icon: Gauge,
    type: "DIAGNÓSTICO INTERATIVO",
    title: "NED Score",
    context: "Empresas chegam ao marketing sem saber qual problema atacar primeiro.",
    decision: "Transformar perguntas estratégicas em uma leitura simples e acionável.",
    delivery: "Experiência de diagnóstico, score, recomendações e qualificação do contato.",
    href: "/ned-score",
  },
  {
    icon: Gamepad2,
    type: "CONTEÚDO INTERATIVO",
    title: "A Máquina Quebrada",
    context: "Falar de oferta, atendimento e operação sem produzir mais um post genérico.",
    decision: "Usar narrativa e escolhas para tornar o conteúdo participativo.",
    delivery: "Experiência gamificada, resultado dinâmico e formato compartilhável.",
    href: "/lab/maquina-quebrada",
  },
  {
    icon: Layers3,
    type: "MÉTODO E PRODUÇÃO",
    title: "NED Growth Studio",
    context: "Ferramentas de conteúdo costumam depender demais de geração automática.",
    decision: "Colocar briefing, método e revisão humana antes da inteligência artificial.",
    delivery: "Planejamento, estrutura por formato, avaliação e fluxo até o Estúdio.",
    href: "/portfolio#growth-studio",
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
        <div>
          <span className={styles.eyebrow}>NED MARKETING / ESTRATÉGIA E EXECUÇÃO</span>
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
            <a className={styles.secondary} href="/portfolio">
              Ver trabalhos
            </a>
          </div>
          <div className={styles.heroProof}>
            <span>Atendimento direto</span>
            <span>Escopo sob análise</span>
            <span>Projetos em todo o Brasil</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Marketing conectado à decisão do cliente">
          <span className={styles.orbitLabel}>Mensagem</span>
          <span className={styles.orbitLabel}>Aquisição</span>
          <span className={styles.orbitLabel}>Conversão</span>
          <div className={styles.visualCopy}>
            <span>UMA DIREÇÃO / TRÊS FRENTES</span>
            <strong>Marca, demanda e venda.</strong>
          </div>
        </div>
      </section>

      <section className={styles.section} id="servicos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>O QUE A NED RESOLVE</span>
            <h2 className={styles.sectionTitle}>
              Três frentes. <span>Uma conversa mais simples.</span>
            </h2>
          </div>
          <p>
            Você não precisa escolher entre uma lista técnica de serviços. Começamos pelo problema e combinamos apenas as entregas necessárias para o momento da empresa.
          </p>
        </div>

        <div className={styles.pillars}>
          {pillars.map(({ icon: Icon, number, title, description, deliverables, href }) => (
            <article className={styles.pillar} key={number}>
              <div className={styles.pillarTop}>
                <span className={styles.pillarIcon}><Icon size={22} /></span>
                <span className={styles.pillarNumber}>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul className={styles.deliverables}>
                {deliverables.map((item) => <li key={item}><Check size={14} /> {item}</li>)}
              </ul>
              <a className={styles.textLink} href={href}>
                Ver entregas <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>

        <div className={styles.supportNote}>
          <Settings2 size={20} />
          <span>
            <strong>Tecnologia entra como apoio.</strong> CRM, automação e inteligência artificial são usados quando ajudam a organizar atendimento, reduzir perda e executar melhor — não como a promessa principal da NED.
          </span>
        </div>
      </section>

      <div className={styles.sectionSoftWrap}>
        <section className={styles.sectionSoft}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>TRABALHOS SELECIONADOS</span>
              <h2 className={styles.sectionTitle}>
                Raciocínio que virou <span>experiência.</span>
              </h2>
            </div>
            <p>
              Os projetos abaixo são próprios da NED e podem ser abertos ou compreendidos em detalhes. Cases de clientes só serão publicados com autorização e sem números inventados.
            </p>
          </div>

          <div className={styles.workGrid}>
            {works.map(({ icon: Icon, type, title, context, decision, delivery, href }) => (
              <article className={styles.workCard} key={title}>
                <div className={styles.workCardTop}><span>{type}</span><Icon size={22} /></div>
                <h3>{title}</h3>
                <div className={styles.caseMeta}>
                  <div><strong>Contexto</strong><span>{context}</span></div>
                  <div><strong>Decisão</strong><span>{decision}</span></div>
                  <div><strong>Entrega</strong><span>{delivery}</span></div>
                </div>
                <a className={styles.textLink} href={href}>Abrir trabalho <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.primary} href="/portfolio">Ver portfólio completo <ArrowRight size={16} /></a>
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

      <div className={styles.sectionSoftWrap}>
        <section className={`${styles.sectionSoft} ${styles.human}`}>
          <div className={styles.humanCard} aria-label="Atendimento direto com Ned">
            <span className={styles.humanMonogram}>NED</span>
            <span className={styles.humanBadge}>ATENDIMENTO DIRETO</span>
          </div>
          <div className={styles.humanCopy}>
            <span className={styles.eyebrow}>QUEM CONDUZ O PROJETO</span>
            <h2>Você conversa com <span>Ned.</span></h2>
            <p>
              A NED funciona como uma estrutura enxuta de marketing. O atendimento começa com contexto, as decisões importantes são explicadas e especialistas podem entrar quando o projeto exigir — sempre com transparência sobre responsabilidade e escopo.
            </p>
            <div className={styles.principles}>
              <div className={styles.principle}><span>01</span><div><strong>Direção antes de ferramenta</strong><small>Canal, tecnologia e formato vêm depois do problema e do objetivo.</small></div></div>
              <div className={styles.principle}><span>02</span><div><strong>Trabalho sem resultado inventado</strong><small>O portfólio mostra o que existe e separa demonstração própria de trabalho autorizado.</small></div></div>
              <div className={styles.principle}><span>03</span><div><strong>Comunicação com próximo passo</strong><small>Entregas, pendências e decisões não ficam espalhadas em mensagens sem contexto.</small></div></div>
            </div>
            <div className={styles.actions}>
              <a className={styles.primary} href="/sobre">Conhecer a NED <ArrowRight size={15} /></a>
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
