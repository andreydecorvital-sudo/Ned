import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Megaphone,
  MessageCircle,
  MonitorSmartphone,
  SearchCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import DiagnosticForm from "../components/diagnostic-form";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../commercial.module.css";

export const metadata: Metadata = {
  title: "Estratégia de crescimento NED — marketing integrado",
  description:
    "Estratégia de marketing que conecta posicionamento, conteúdo, presença digital, mídia, conversão e acompanhamento conforme o momento da empresa.",
  alternates: { canonical: "/maquina-de-clientes" },
  openGraph: {
    title: "Estratégia de crescimento NED",
    description: "Marketing integrado para atrair, posicionar, converter e evoluir com mais clareza.",
    url: "/maquina-de-clientes",
  },
};

const stages = [
  ["01", "Diagnóstico", "Entendemos marca, público, oferta, momento, concorrência e objetivo comercial."],
  ["02", "Posicionamento", "Definimos a mensagem, os diferenciais e a percepção que a comunicação precisa construir."],
  ["03", "Criação", "Transformamos a estratégia em conteúdo, campanhas, páginas e experiências de marca."],
  ["04", "Distribuição", "Escolhemos canais, mídia, públicos e formatos para levar a mensagem até as pessoas certas."],
  ["05", "Otimização", "Acompanhamos sinais de interesse, contatos e desempenho para melhorar as próximas decisões."],
];

const deliverables = [
  [Target, "Estratégia e posicionamento", "Direção de marca, público, proposta de valor, mensagem e prioridades de marketing."],
  [Megaphone, "Conteúdo e direção criativa", "Campanhas, conceitos, roteiros, peças e comunicação alinhados ao posicionamento."],
  [MonitorSmartphone, "Presença digital e conversão", "Sites e landing pages que apresentam a oferta e conduzem para uma ação clara."],
  [TrendingUp, "Mídia e aquisição", "Campanhas pagas e distribuição conectadas ao criativo, à oferta e ao atendimento."],
  [BarChart3, "Mensuração e aprendizado", "Leitura de origem, comportamento e qualidade das oportunidades para orientar ajustes."],
  [MessageCircle, "Relacionamento e acompanhamento", "Organização da jornada após o interesse para que a experiência não termine no primeiro contato."],
] as const;

const engagementOptions = [
  {
    title: "Posicionamento e presença",
    label: "BASE DE MARCA",
    description: "Para empresas que precisam apresentar melhor o negócio, organizar a mensagem e fortalecer a presença digital.",
    features: ["Diagnóstico de marca e oferta", "Direção de comunicação", "Conteúdo ou landing page", "Próximos passos definidos"],
  },
  {
    title: "Campanha e aquisição",
    label: "CRESCIMENTO",
    description: "Para empresas que já possuem uma oferta e precisam criar campanhas, alcançar públicos e melhorar conversão.",
    features: ["Conceito e criativos", "Página ou jornada de campanha", "Planejamento de mídia", "Mensuração e otimização"],
  },
  {
    title: "Marketing contínuo",
    label: "ACOMPANHAMENTO",
    description: "Para empresas que precisam de direção recorrente, criação, campanhas e melhorias organizadas ao longo do tempo.",
    features: ["Planejamento periódico", "Prioridades mensais", "Criação e distribuição", "Análise e próximos testes"],
  },
];

export default function GrowthStrategyPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>ESTRATÉGIA INTEGRADA / MARKETING E CRESCIMENTO</span>
          <h1>Marketing para ser encontrado, escolhido e lembrado.</h1>
          <p className={styles.heroLead}>
            A NED organiza estratégia, posicionamento, criação, presença digital, mídia e acompanhamento em uma direção única. Não existe pacote pronto: o trabalho começa entendendo o negócio e definindo o que realmente precisa ser feito.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#diagnostico">Quero analisar meu marketing <ArrowRight size={16} /></a>
            <a className={styles.secondary} href="/portfolio">Ver projetos e experiências</a>
          </div>
          <div className={styles.heroMeta}>
            <span>Investimento definido após análise</span>
            <span>Escopo personalizado</span>
            <span>Atendimento direto</span>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <span className={styles.panelKicker}>JORNADA DE MARKETING CONECTADA</span>
          <h2 className={styles.panelTitle}>Estratégia → criação → distribuição → evolução.</h2>
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
            <span className={styles.eyebrow}>O QUE PODE COMPOR O PROJETO</span>
            <h2 className={styles.sectionTitle}>As ações precisam seguir a mesma <span>direção.</span></h2>
          </div>
          <p>
            Um anúncio não resolve uma oferta confusa. Um site não sustenta uma marca sem mensagem. Conteúdo sem distribuição pode não chegar a ninguém. O escopo combina apenas as frentes necessárias para o objetivo e para o momento da empresa.
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
            <span className={styles.eyebrow}>COMO TRABALHAMOS</span>
            <h2 className={styles.sectionTitle}>Primeiro a estratégia. Depois a <span>execução.</span></h2>
          </div>
          <p>
            O projeto começa entendendo o que a empresa quer conquistar, como o público decide e quais ativos já existem. A partir disso, definimos prioridades, entregas, canais, prazo e investimento.
          </p>
        </div>
        <div className={styles.grid4}>
          {[
            ["01", "Diagnóstico", "Leitura do negócio, marca, público, concorrência, comunicação e objetivo."],
            ["02", "Direção", "Posicionamento, mensagem, prioridades, escopo e critérios de sucesso."],
            ["03", "Criação e distribuição", "Produção das entregas e ativação nos canais definidos."],
            ["04", "Análise e evolução", "Leitura dos sinais, ajustes e recomendação dos próximos movimentos."],
          ].map(([number, title, description]) => (
            <article className={styles.card} key={number}>
              <span className={styles.cardNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="formas-de-atuacao">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>FORMAS DE ATUAÇÃO</span>
            <h2 className={styles.sectionTitle}>O formato depende do que sua marca precisa <span>agora.</span></h2>
          </div>
          <p>
            Todas as propostas são feitas após análise. O investimento varia conforme objetivo, entregas, quantidade de canais, volume de criação, mídia, prazo e nível de acompanhamento.
          </p>
        </div>
        <div className={styles.grid3}>
          {engagementOptions.map((option) => (
            <article className={styles.card} key={option.title}>
              <span className={styles.eyebrow}>{option.label}</span>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <ul className={styles.featureList}>
                {option.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}
              </ul>
              <div className={styles.heroActions}>
                <a className={styles.textLink} href="#diagnostico">Solicitar análise <ArrowRight size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sectionSoft} id="continuidade">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>MARKETING CONTÍNUO</span>
            <h2 className={styles.sectionTitle}>Marcas consistentes não aparecem apenas quando precisam <span>vender.</span></h2>
          </div>
          <p>
            A continuidade pode incluir planejamento, conteúdo, criativos, páginas, campanhas, análise de dados e reuniões de direção. Frequência e investimento são definidos de acordo com a estrutura e as metas da empresa.
          </p>
        </div>
        <div className={styles.grid2}>
          <article className={styles.card}>
            <span className={styles.eyebrow}>MARCA E CONTEÚDO</span>
            <h3>Presença consistente</h3>
            <p>Para organizar comunicação, campanhas, conteúdo e melhorias na presença digital ao longo do tempo.</p>
            <ul className={styles.featureList}>
              <li><Check size={14} /> Planejamento por prioridade</li>
              <li><Check size={14} /> Direção criativa e conteúdo</li>
              <li><Check size={14} /> Páginas e materiais de campanha</li>
              <li><Check size={14} /> Reuniões e próximos movimentos</li>
            </ul>
          </article>
          <article className={styles.card}>
            <span className={styles.eyebrow}>AQUISIÇÃO E CRESCIMENTO</span>
            <h3>Campanhas em evolução</h3>
            <p>Para empresas que precisam testar mensagens, criativos, públicos e páginas com acompanhamento recorrente.</p>
            <ul className={styles.featureList}>
              <li><Check size={14} /> Planejamento de campanhas</li>
              <li><Check size={14} /> Produção e adaptação de criativos</li>
              <li><Check size={14} /> Acompanhamento de mídia e conversão</li>
              <li><Check size={14} /> Análise e novos testes</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.splitSection}>
        <div>
          <span className={styles.eyebrow}>PARA QUEM FAZ SENTIDO</span>
          <h2>Empresas que querem construir presença e crescimento com mais direção.</h2>
          <p>
            A estratégia é indicada para negócios que precisam melhorar posicionamento, comunicação, aquisição ou conversão. Não existe promessa automática de vendas: o trabalho cria uma base de marketing mais clara, consistente e preparada para aprender.
          </p>
        </div>
        <aside className={styles.callout}>
          <Clock3 size={28} />
          <strong>Próximo passo</strong>
          <p>Conte o momento da empresa. A NED analisa o desafio e recomenda quais frentes devem entrar primeiro.</p>
        </aside>
      </section>

      <section className={styles.formSection} id="diagnostico">
        <div className={styles.formIntro}>
          <span className={styles.eyebrow}>ANÁLISE DE MARKETING</span>
          <h2>Vamos entender o que sua marca precisa <span>primeiro.</span></h2>
          <p>
            Responda sobre o negócio, o desafio e o momento atual. A conversa começa com contexto suficiente para avaliar prioridades e preparar uma proposta sob análise.
          </p>
        </div>
        <DiagnosticForm
          source="estrategia_crescimento"
          presetService="Ainda não sei"
          context={{ interest: "marketing_integrado", landing_page: "maquina_de_clientes" }}
        />
      </section>
    </CommercialPage>
  );
}
