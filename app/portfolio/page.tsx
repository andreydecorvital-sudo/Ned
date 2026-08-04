import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import CaseVisual from "../components/case-visual";
import { CommercialPage } from "../components/commercial-shell";
import styles from "./portfolio-brand.module.css";

export const metadata: Metadata = {
  title: "Trabalhos — estudos de caso e experiências NED",
  description:
    "Veja estudos de caso de projetos próprios da NED Marketing, com contexto, decisões, entregas, competências demonstradas e próximas evoluções.",
  alternates: { canonical: "/portfolio" },
};

const cases = [
  {
    id: "ned-score",
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
    demonstrates:
      "Estratégia traduzida em fluxo simples, lógica de pontuação, feedback personalizado e captação com contexto.",
    next:
      "Usar dados reais de navegação para revisar pesos, melhorar recomendações e fortalecer o resumo compartilhável.",
    evidence: "A experiência é pública e pode ser testada diretamente no site.",
    tags: ["Estratégia", "Diagnóstico", "Conversão", "Experiência"],
    href: "/ned-score",
    cta: "Testar NED Score",
    variant: "score" as const,
  },
  {
    id: "maquina-quebrada",
    type: "CONTEÚDO INTERATIVO / NED LAB",
    title: "A Máquina Quebrada",
    summary:
      "Uma narrativa gamificada sobre oferta, atendimento e operação, construída para gerar participação em vez de apenas consumo passivo.",
    context:
      "Problemas de negócio costumam virar conteúdo abstrato ou listas repetidas. A proposta era falar sobre falhas reais de marketing de uma forma mais memorável.",
    decision:
      "Usar observação, descoberta e escolhas para fazer o visitante perceber como decisões diferentes alteram o resultado da empresa.",
    deliveries: [
      "Cena com três gargalos investigáveis",
      "Explicação de sintomas e consequências",
      "Três desafios com escolhas",
      "Pontuação e perfil dinâmicos",
      "Resultado compartilhável e CTA contextualizado",
    ],
    demonstrates:
      "Storytelling, interface interativa, gerenciamento de estado, sistema de pontuação e conversão conectada à experiência.",
    next:
      "Adicionar mais variações, reforçar feedback entre etapas, melhorar o cartão final e medir dificuldade e abandono por fase.",
    evidence: "O projeto está disponível publicamente no NED LAB e possui um estudo de caso detalhado.",
    tags: ["Storytelling", "Gamificação", "Conteúdo", "Compartilhamento"],
    href: "/portfolio/maquina-quebrada",
    cta: "Ver estudo completo",
    variant: "machine" as const,
  },
  {
    id: "growth-studio",
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
    demonstrates:
      "Arquitetura de produto interno, método editorial, persistência de dados, revisão humana e integração com publicação.",
    next:
      "Preparar múltiplas marcas, aprovação por cliente e aprendizado orientado por resultados reais das publicações.",
    evidence: "A ferramenta é interna; o case mostra o raciocínio e as entregas sem expor dados administrativos.",
    tags: ["Conteúdo", "Método", "IA supervisionada", "Produção"],
    href: "/processo",
    cta: "Entender o método",
    variant: "studio" as const,
  },
];

export default function PortfolioPage() {
  return (
    <CommercialPage>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>TRABALHOS / NED MARKETING</span>
          <h1>Menos vitrine vazia. <span>Mais contexto e evolução.</span></h1>
          <p className={styles.heroLead}>
            Estes estudos de caso mostram o problema, o raciocínio, a entrega, o que cada projeto demonstra e o que ainda precisa evoluir. Todos são projetos próprios da NED.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#casos">Ver estudos de caso <ArrowRight size={17} /></a>
            <a className={styles.secondary} href="/analise-gratuita">Solicitar análise</a>
          </div>
        </div>
        <aside className={styles.heroPanel} aria-label="Critérios do portfólio NED">
          <span className={styles.panelLabel}>COMO OS CASES SÃO APRESENTADOS</span>
          <div className={styles.panelStack}>
            <div className={styles.panelItem}><span>01</span><div><strong>Contexto</strong><small>Qual problema precisava ser resolvido</small></div></div>
            <div className={styles.panelItem}><span>02</span><div><strong>Decisão</strong><small>Por que o caminho foi escolhido</small></div></div>
            <div className={styles.panelItem}><span>03</span><div><strong>Entrega</strong><small>O que foi realmente construído</small></div></div>
            <div className={styles.panelItem}><span>04</span><div><strong>Evolução</strong><small>O que ainda pode ficar melhor</small></div></div>
          </div>
        </aside>
      </section>

      <section className={styles.section} id="casos">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>ESTUDOS DE CASO</span>
            <h2 className={styles.sectionTitle}>Três projetos. <span>Três sistemas em evolução.</span></h2>
          </div>
          <p>Os cases não usam clientes fictícios, depoimentos inventados ou números que não podem ser comprovados.</p>
        </div>

        <div className={styles.notice}>
          Projetos próprios demonstram capacidade de estratégia e execução, mas não substituem cases de clientes. Essa diferença continua explícita.
        </div>

        <div className={styles.caseList}>
          {cases.map(({ id, type, title, summary, context, decision, deliveries, demonstrates, next, evidence, tags, href, cta, variant }) => (
            <article className={styles.case} key={id} id={id}>
              <div className={styles.media}><CaseVisual variant={variant} large /></div>
              <div className={styles.content}>
                <div className={styles.topline}>
                  <span className={styles.type}>{type}</span>
                  <span className={styles.status}>PROJETO PRÓPRIO</span>
                </div>
                <h2>{title}</h2>
                <p className={styles.summary}>{summary}</p>

                <div className={styles.twoCol}>
                  <article className={styles.info}><h3>Contexto</h3><p>{context}</p></article>
                  <article className={styles.info}><h3>Decisão</h3><p>{decision}</p></article>
                </div>

                <h3 className={styles.deliveryTitle}>Entregas</h3>
                <ul className={styles.deliveries}>
                  {deliveries.map((delivery) => <li key={delivery}><Check size={14} /> {delivery}</li>)}
                </ul>

                <div className={styles.twoCol}>
                  <article className={styles.info}><h3>O que demonstra</h3><p>{demonstrates}</p></article>
                  <article className={styles.info}><h3>Próxima evolução</h3><p>{next}</p></article>
                </div>

                <div className={styles.evidence}>{evidence}</div>
                <div className={styles.tags}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className={styles.textLink} href={href}>{cta} <ArrowRight size={15} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.paper}>
        <section className={styles.finalCta}>
          <div>
            <span className={styles.eyebrow}>PRÓXIMO PROJETO</span>
            <h2>Seu problema pode virar <span>um trabalho verificável.</span></h2>
          </div>
          <div>
            <p>Mostre o cenário atual. A NED identifica a prioridade antes de recomendar conteúdo, campanha, página, mídia ou marketplace.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>
      </div>
    </CommercialPage>
  );
}
