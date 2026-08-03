import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Clock3,
  MessageCircle,
  MonitorSmartphone,
  Route,
  ShieldCheck,
} from "lucide-react";
import DiagnosticForm from "../components/diagnostic-form";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../commercial.module.css";

export const metadata: Metadata = {
  title: "Máquina de Clientes NED — captação, WhatsApp e CRM",
  description:
    "Uma estrutura que conecta landing page, oferta, captura de leads, WhatsApp, CRM, rastreamento e follow-up.",
  alternates: { canonical: "/maquina-de-clientes" },
  openGraph: {
    title: "Máquina de Clientes NED",
    description: "Transforme descoberta em conversa e conversa em acompanhamento comercial organizado.",
    url: "/maquina-de-clientes",
  },
};

const stages = [
  ["01", "Descoberta", "Google, Instagram, anúncios, conteúdo ou indicação levam o público para uma oferta clara."],
  ["02", "Conversão", "A página organiza problema, solução, diferenciais, dúvidas e um próximo passo objetivo."],
  ["03", "Captação", "O contato entra com nome, empresa, necessidade, serviço, urgência e origem."],
  ["04", "Atendimento", "O WhatsApp abre com contexto e o lead aparece no CRM para não depender apenas da conversa enviada."],
  ["05", "Follow-up", "Status, histórico, prioridade e próxima ação mantêm as oportunidades visíveis."],
];

const deliverables = [
  [MonitorSmartphone, "Landing page comercial", "Página responsiva com oferta, CTA, dúvidas e integração com WhatsApp."],
  [MessageCircle, "Contato contextualizado", "Mensagem pronta e formulário para que a conversa não comece de forma vaga."],
  [Route, "CRM com pipeline", "Leads organizados entre novo, contato, reunião, proposta, fechado ou perdido."],
  [BarChart3, "Rastreamento", "UTMs, página de origem e contexto da campanha registrados no contato."],
  [Bot, "Automação prática", "Regras de prioridade, deduplicação, follow-up e atividades comerciais."],
  [ShieldCheck, "Privacidade e proteção", "Consentimento, política de privacidade, limite de tentativas e exclusão de dados."],
] as const;

const offers = [
  {
    title: "NED Presença",
    label: "ENTRADA DIGITAL",
    price: "R$ 1.500",
    suffix: "a partir de",
    description: "Para organizar presença, oferta e caminho para o WhatsApp.",
    features: ["Landing page", "CTA e WhatsApp", "Analytics básico", "SEO técnico inicial"],
  },
  {
    title: "NED Conversão",
    label: "MÁQUINA DE CLIENTES",
    price: "R$ 2.500",
    suffix: "a partir de",
    description: "Para captar contatos com contexto e acompanhar o pipeline comercial.",
    features: ["Tudo do Presença", "Formulário e diagnóstico", "CRM Kanban", "Rastreamento de origem", "Roteiros de atendimento"],
    featured: true,
  },
  {
    title: "NED Automação",
    label: "PROCESSOS SOB MEDIDA",
    price: "Sob diagnóstico",
    suffix: "escopo personalizado",
    description: "Para integrar atendimento, dados, marketplace e tarefas repetitivas.",
    features: ["Mapeamento do processo", "Integrações", "Painel ou fluxo específico", "Implantação e suporte"],
  },
];

export default function MachineOfClientsPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>PRODUTO PRINCIPAL / NED CONVERSÃO</span>
          <h1>Uma estrutura para transformar atenção em oportunidade acompanhada.</h1>
          <p className={styles.heroLead}>
            A Máquina de Clientes NED conecta página, oferta, formulário, WhatsApp, CRM e follow-up. Ela não substitui uma boa venda, mas evita que o interesse se perca entre links confusos, mensagens vagas e retornos esquecidos.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#diagnostico">Quero estruturar meu funil <ArrowRight size={16} /></a>
            <a className={styles.secondary} href="/analise-gratuita">Solicitar análise gratuita</a>
          </div>
          <div className={styles.heroMeta}>
            <span>Projeto a partir de R$ 2.500</span>
            <span>Escopo definido antes do início</span>
            <span>Atendimento direto</span>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <span className={styles.panelKicker}>FLUXO COMERCIAL CONECTADO</span>
          <h2 className={styles.panelTitle}>Descoberta → conversa → acompanhamento.</h2>
          <div className={styles.pipeline}>
            {stages.slice(0, 4).map(([number, title, text]) => (
              <div className={styles.pipelineItem} key={number}>
                <span>{number}</span>
                <div><strong>{title}</strong><small>{text}</small></div>
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.sectionSoft}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>O QUE É ENTREGUE</span>
            <h2 className={styles.sectionTitle}>As partes precisam trabalhar <span>juntas.</span></h2>
          </div>
          <p>
            Um formulário isolado não resolve atendimento; um CRM vazio não gera demanda; tráfego para uma oferta confusa apenas acelera o desperdício. O projeto organiza a jornada completa de acordo com o momento da empresa.
          </p>
        </div>
        <div className={styles.grid3}>
          {deliverables.map(([Icon, title, description]) => (
            <article className={styles.card} key={title}>
              <span className={styles.toolIcon}><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PROCESSO DE IMPLANTAÇÃO</span>
            <h2 className={styles.sectionTitle}>Primeiro a lógica. Depois a <span>tecnologia.</span></h2>
          </div>
          <p>
            O projeto começa entendendo oferta, origem dos contatos, capacidade de atendimento e gargalos. Só depois são definidos páginas, automações e indicadores.
          </p>
        </div>
        <div className={styles.grid4}>
          {[
            ["01", "Diagnóstico", "Mapeamento do negócio, jornada, atendimento e objetivo."],
            ["02", "Escopo", "Entregáveis, prazo, investimento e responsabilidades definidos."],
            ["03", "Construção", "Página, captura, CRM, integrações e testes."],
            ["04", "Publicação", "Entrada em produção, acompanhamento e próximos ajustes."],
          ].map(([number, title, description]) => (
            <article className={styles.card} key={number}>
              <span className={styles.cardNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="planos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>FORMAS DE CONTRATAÇÃO</span>
            <h2 className={styles.sectionTitle}>Compre uma solução que faça sentido <span>agora.</span></h2>
          </div>
          <p>
            Os valores são referências iniciais para projetos com escopo controlado. Funcionalidades adicionais, integrações e volume de conteúdo são definidos na proposta.
          </p>
        </div>
        <div className={styles.grid3}>
          {offers.map((offer) => (
            <article className={`${styles.priceCard}${offer.featured ? ` ${styles.priceCardFeatured}` : ""}`} key={offer.title}>
              <span className={styles.priceLabel}>{offer.label}</span>
              <h3>{offer.title}</h3>
              <span className={styles.price}>{offer.price} <small>{offer.suffix}</small></span>
              <p>{offer.description}</p>
              <ul className={styles.featureList}>
                {offer.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}
              </ul>
              <a className={styles.textLink} href="#diagnostico">Quero conversar <ArrowRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionSoft} id="recorrencia">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>MANUTENÇÃO E EVOLUÇÃO</span>
            <h2 className={styles.sectionTitle}>Receita recorrente exige <span>continuidade.</span></h2>
          </div>
          <p>
            Após a entrega, os planos mensais mantêm a estrutura funcionando e permitem pequenas melhorias sem abrir um novo projeto a cada necessidade.
          </p>
        </div>
        <div className={styles.grid2}>
          <article className={styles.priceCard}>
            <span className={styles.priceLabel}>MANUTENÇÃO</span>
            <h3>NED Care</h3>
            <span className={styles.price}>R$ 297 <small>a partir de / mês</small></span>
            <p>Para manter site, formulários e CRM operacionais.</p>
            <ul className={styles.featureList}>
              <li><Check size={14} /> Monitoramento técnico</li>
              <li><Check size={14} /> Pequenas alterações mensais</li>
              <li><Check size={14} /> Revisão básica de leads e funcionamento</li>
              <li><Check size={14} /> Suporte técnico combinado</li>
            </ul>
          </article>
          <article className={styles.priceCard}>
            <span className={styles.priceLabel}>EVOLUÇÃO</span>
            <h3>NED Growth</h3>
            <span className={styles.price}>R$ 900 <small>a partir de / mês</small></span>
            <p>Para empresas que precisam testar páginas, campanhas e melhorias no funil.</p>
            <ul className={styles.featureList}>
              <li><Check size={14} /> Tudo do NED Care</li>
              <li><Check size={14} /> Novas páginas ou experimentos definidos no plano</li>
              <li><Check size={14} /> Revisão mensal do pipeline</li>
              <li><Check size={14} /> Reunião de evolução e próximos testes</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.splitSection}>
        <div>
          <span className={styles.eyebrow}>PARA QUEM FAZ SENTIDO</span>
          <h2>Empresas que já têm algo para vender, mas perdem clareza ou acompanhamento.</h2>
          <p>
            A solução é indicada para negócios que dependem de Instagram, Google, anúncios ou WhatsApp e precisam organizar o caminho entre interesse e atendimento. Não é uma promessa de vendas automáticas nem substitui a capacidade de atender e entregar.
          </p>
        </div>
        <aside className={styles.callout}>
          <Clock3 size={28} />
          <strong>Próximo passo</strong>
          <p>Preencha o diagnóstico. A NED avalia se o momento pede uma página, o CRM completo, automação ou uma solução menor.</p>
        </aside>
      </section>

      <section className={styles.formSection} id="diagnostico">
        <div className={styles.formIntro}>
          <span className={styles.eyebrow}>DIAGNÓSTICO COMERCIAL</span>
          <h2>Vamos descobrir o que sua empresa precisa <span>primeiro.</span></h2>
          <p>
            As respostas entram no CRM antes de o WhatsApp abrir. Assim, a conversa já começa com serviço, necessidade, urgência e origem organizados.
          </p>
        </div>
        <DiagnosticForm
          source="maquina_clientes"
          presetService="Máquina de Clientes NED"
          context={{ offer: "ned_conversao", landing_page: "maquina_de_clientes" }}
        />
      </section>
    </CommercialPage>
  );
}
