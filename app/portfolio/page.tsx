import type { Metadata } from "next";
import { ArrowRight, Check, Gauge, Gamepad2, Layers3 } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Trabalhos — estudos de caso e experiências NED",
  description:
    "Veja estudos de caso de projetos próprios da NED Marketing, com contexto, decisões, entregas e limites apresentados sem métricas fictícias.",
  alternates: { canonical: "/portfolio" },
};

const cases = [
  {
    id: "ned-score",
    icon: Gauge,
    type: "DIAGNÓSTICO INTERATIVO",
    title: "NED Score",
    summary:
      "Uma experiência que transforma perguntas de marketing em uma leitura inicial sobre oferta, posicionamento, presença, aquisição e atendimento.",
    context:
      "Muitas empresas sabem que o marketing está fraco, mas não conseguem identificar se o problema principal está na oferta, na mensagem, na aquisição ou no atendimento.",
    decision:
      "Criar um diagnóstico curto e compreensível, sem usar uma auditoria genérica como isca. A experiência precisava orientar a conversa e registrar contexto útil.",
    deliveries: [
      "Fluxo de oito perguntas",
      "Pontuação de 0 a 100",
      "Leitura por áreas de marketing",
      "Recomendações iniciais",
      "Integração com captação de oportunidades",
    ],
    evidence: "A experiência é pública e pode ser testada diretamente no site.",
    tags: ["Estratégia", "Diagnóstico", "Conversão", "Experiência"],
    href: "/ned-score",
    cta: "Testar NED Score",
  },
  {
    id: "maquina-quebrada",
    icon: Gamepad2,
    type: "CONTEÚDO INTERATIVO / NED LAB",
    title: "A Máquina Quebrada",
    summary:
      "Uma narrativa gamificada sobre oferta, atendimento e operação, construída para gerar participação em vez de apenas consumo passivo.",
    context:
      "Problemas de negócio costumam virar conteúdo abstrato ou listas repetidas. A proposta era falar sobre falhas reais de marketing de uma forma mais memorável.",
    decision:
      "Usar escolhas e consequências para fazer o visitante perceber como decisões diferentes alteram o resultado da empresa.",
    deliveries: [
      "Narrativa com três desafios",
      "Escolhas e resultados dinâmicos",
      "Direção visual própria",
      "Resultado compartilhável",
      "Experiência responsiva",
    ],
    evidence: "O projeto está disponível publicamente no NED LAB.",
    tags: ["Storytelling", "Gamificação", "Conteúdo", "Compartilhamento"],
    href: "/lab/maquina-quebrada",
    cta: "Abrir experiência",
  },
  {
    id: "growth-studio",
    icon: Layers3,
    type: "MÉTODO E PRODUÇÃO INTERNA",
    title: "NED Growth Studio",
    summary:
      "Uma ferramenta interna para planejar, estruturar, revisar e levar conteúdo até o Estúdio sem depender cegamente de inteligência artificial.",
    context:
      "Geradores automáticos produzem volume, mas frequentemente entregam textos genéricos, CTAs fracos e peças sem relação suficiente com a marca.",
    decision:
      "Colocar briefing, formato, direção, avaliação e aprovação humana antes da execução. A IA gratuita permanece opcional e subordinada ao método.",
    deliveries: [
      "Briefing por objetivo e formato",
      "Estruturas para Feed, Stories e carrosséis",
      "Avaliação de clareza, relevância e conversão",
      "Edição e aprovação humana obrigatória",
      "Fluxo para rascunho e publicação",
    ],
    evidence: "A ferramenta é interna; o case mostra o raciocínio e as entregas sem expor dados administrativos.",
    tags: ["Conteúdo", "Método", "IA supervisionada", "Produção"],
    href: "/processo",
    cta: "Entender o método",
  },
];

export default function PortfolioPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>TRABALHOS / NED MARKETING</span>
          <h1>Menos vitrine vazia. <span>Mais contexto e decisão.</span></h1>
          <p className={styles.heroLead}>
            Estes estudos de caso mostram o problema, o raciocínio e a entrega. Todos são projetos próprios da NED. Trabalhos de clientes serão publicados somente com autorização.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#casos">Ver estudos de caso <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise</a>
          </div>
        </div>
        <aside className={styles.heroPanel} aria-label="Critérios do portfólio NED">
          <span className={styles.panelLabel}>COMO OS CASES SÃO APRESENTADOS</span>
          <div className={styles.panelStack}>
            <div className={styles.panelItem}><span>01</span><strong>Contexto</strong><small>Qual problema precisava ser resolvido</small></div>
            <div className={styles.panelItem}><span>02</span><strong>Decisão</strong><small>Por que o caminho foi escolhido</small></div>
            <div className={styles.panelItem}><span>03</span><strong>Entrega</strong><small>O que foi realmente construído</small></div>
            <div className={styles.panelItem}><span>04</span><strong>Evidência</strong><small>O que pode ser verificado</small></div>
          </div>
        </aside>
      </section>

      <section className={styles.pageSectionDark} id="casos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>ESTUDOS DE CASO</span>
            <h2 className={styles.sectionTitle}>Três projetos. <span>Três problemas diferentes.</span></h2>
          </div>
          <p>Os cases não usam clientes fictícios, depoimentos inventados ou números que não podem ser comprovados.</p>
        </div>

        <div className={styles.portfolioNotice}>
          Projetos próprios demonstram capacidade de estratégia e execução, mas não substituem cases de clientes. Essa diferença é apresentada de forma explícita.
        </div>

        <div className={styles.projectGrid} style={{ marginTop: 18 }}>
          {cases.map(({ id, icon: Icon, type, title, summary, context, decision, deliveries, evidence, tags, href, cta }) => (
            <article className={styles.projectCard} key={id} id={id}>
              <div className={styles.projectContent}>
                <div className={styles.projectTop}>
                  <span className={styles.projectType}>{type}</span>
                  <span className={styles.projectStatus}>PROJETO PRÓPRIO</span>
                </div>
                <span className={styles.cardIcon}><Icon size={22} /></span>
                <h2 className={styles.projectTitle}>{title}</h2>
                <p className={styles.projectDescription}>{summary}</p>

                <div className={styles.faqGrid}>
                  <article className={styles.faqCard}><h3>Contexto</h3><p>{context}</p></article>
                  <article className={styles.faqCard}><h3>Decisão</h3><p>{decision}</p></article>
                </div>

                <h3>Entregas</h3>
                <ul className={styles.projectFacts}>
                  {deliveries.map((delivery) => <li key={delivery}><Check size={14} /> {delivery}</li>)}
                </ul>

                <div className={styles.portfolioNotice}>{evidence}</div>
                <div className={styles.tagRow}>{tags.map((tag) => <span className={styles.tag} key={tag}>{tag}</span>)}</div>
                <a className={styles.textLink} href={href}>{cta} <ArrowRight size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Seu projeto não precisa começar com uma solução pronta.</h2>
            <p>Mostre o cenário atual. A NED identifica a prioridade antes de recomendar conteúdo, campanha, página, mídia ou marketplace.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
