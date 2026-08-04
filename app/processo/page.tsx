import type { Metadata } from "next";
import { ArrowRight, Check, ClipboardCheck, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Processo — diagnóstico, direção, execução e aprendizado",
  description:
    "Entenda como um projeto avança com a NED Marketing: leitura do cenário, direção, proposta, produção, ativação e aprendizado.",
  alternates: { canonical: "/processo" },
};

const stages = [
  {
    number: "01",
    title: "Leitura do cenário",
    text: "Entendemos negócio, oferta, público, momento, canais, urgência e principal perda antes de recomendar qualquer entrega.",
    outputs: ["Contexto organizado", "Problema prioritário", "Aderência confirmada"],
  },
  {
    number: "02",
    title: "Direção",
    text: "Definimos o que precisa mudar primeiro, qual mensagem deve ser fortalecida e quais entregas fazem sentido para o objetivo.",
    outputs: ["Prioridade de marketing", "Direção recomendada", "Critérios de sucesso"],
  },
  {
    number: "03",
    title: "Proposta",
    text: "Escopo, prazo, investimento, responsabilidades e ciclos de aprovação são documentados antes do início da produção.",
    outputs: ["Entregas definidas", "Cronograma", "Condições comerciais"],
  },
  {
    number: "04",
    title: "Produção e ativação",
    text: "A estratégia vira campanha, conteúdo, página, mídia ou melhoria de marketplace. Decisões importantes chegam acompanhadas de contexto.",
    outputs: ["Peças e entregas", "Revisões objetivas", "Ativação controlada"],
  },
  {
    number: "05",
    title: "Aprendizado",
    text: "Dados, feedback e comportamento do público orientam correções e próximos testes. A continuidade só existe quando há uma razão clara.",
    outputs: ["Leitura do que aconteceu", "Melhorias prioritárias", "Continuidade opcional"],
  },
];

const responsibilities = [
  {
    icon: ClipboardCheck,
    title: "Informações confiáveis",
    text: "A empresa valida oferta, preços, regras, diferenciais e restrições antes da publicação.",
  },
  {
    icon: MessagesSquare,
    title: "Uma pessoa responsável",
    text: "Aprovações, materiais e decisões precisam ter um responsável para o projeto não depender de mensagens soltas.",
  },
  {
    icon: ShieldCheck,
    title: "Acessos e materiais",
    text: "Contas, identidade, fotos, vídeos, domínios e plataformas são disponibilizados pelos canais definidos.",
  },
  {
    icon: Sparkles,
    title: "Conhecimento do negócio",
    text: "A NED conduz marketing e execução, mas a verdade sobre cliente, operação e entrega vem da empresa.",
  },
];

export default function ProcessPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>PROCESSO / SEM CAIXA-PRETA</span>
          <h1>Você sabe o que acontece <span>depois do contato.</span></h1>
          <p className={styles.heroLead}>
            O processo da NED reduz achismo, retrabalho e aprovação sem contexto. Cada etapa termina com uma decisão ou saída concreta.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#etapas">Ver as etapas <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/portfolio">Ver trabalhos</a>
          </div>
        </div>
        <aside className={styles.heroPanel} aria-label="Resumo do processo NED">
          <span className={styles.panelLabel}>FLUXO DO PROJETO / 05 ETAPAS</span>
          <div className={styles.panelStack}>
            {stages.map((stage) => (
              <div className={styles.panelItem} key={stage.number}>
                <span>{stage.number}</span><strong>{stage.title}</strong><small>{stage.outputs[0]}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.pageSection} id="etapas">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>DO CONTEXTO À MELHORIA</span>
            <h2 className={styles.sectionTitle}>Etapas com <span>saídas verificáveis.</span></h2>
          </div>
          <p>O objetivo não é criar burocracia. É evitar que a produção comece sem prioridade, informação ou critério de aprovação.</p>
        </div>
        <div className={styles.stageList}>
          {stages.map((stage) => (
            <article className={styles.stage} key={stage.number}>
              <div className={styles.stageTitle}><span className={styles.stageNumber}>{stage.number}</span><h2>{stage.title}</h2></div>
              <p className={styles.stageCopy}>{stage.text}</p>
              <ul className={styles.stageOutputs}>{stage.outputs.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PARTICIPAÇÃO DO CLIENTE</span>
            <h2 className={styles.sectionTitle}>Conhecimento sem <span>microgerenciamento.</span></h2>
          </div>
          <p>A NED não transfere a estratégia para o cliente. Porém, materiais, informações e decisões sobre o negócio precisam chegar de uma fonte confiável.</p>
        </div>
        <div className={styles.roleGrid}>
          {responsibilities.map(({ icon: Icon, title, text }) => (
            <article className={styles.roleCard} key={title}><span className={styles.cardIcon}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.communication}>
          <aside className={styles.communicationAside}>
            <span className={styles.eyebrow}>COMUNICAÇÃO</span>
            <h2>Menos mensagem perdida.</h2>
            <p>Assunto importante precisa estar ligado a uma etapa, pendência ou decisão — não apenas espalhado em conversas.</p>
          </aside>
          <div className={styles.communicationMain}>
            <span className={styles.eyebrow}>NA PRÁTICA</span>
            <h2>Contexto antes da urgência.</h2>
            <ul className={styles.checkList}>
              <li><Check size={15} /> Um canal principal para decisões.</li>
              <li><Check size={15} /> Entregas acompanhadas da ação esperada.</li>
              <li><Check size={15} /> Pendências com responsável e impacto.</li>
              <li><Check size={15} /> Mudança de direção registrada antes da produção.</li>
              <li><Check size={15} /> Reunião somente quando acelera uma decisão.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div><h2>O próximo passo é mostrar o cenário real.</h2><p>A análise inicial identifica a prioridade antes de discutir formato, frequência ou investimento.</p></div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
