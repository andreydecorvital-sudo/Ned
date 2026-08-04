import type { Metadata } from "next";
import { ArrowRight, Check, ClipboardCheck, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Processo de marketing — como a NED trabalha",
  description:
    "Entenda como funciona um projeto de marketing com a NED: diagnóstico, direção, proposta, criação, ativação, revisão e evolução.",
  alternates: { canonical: "/processo" },
};

const stages = [
  {
    number: "01",
    title: "Triagem",
    text: "Entendemos o motivo do contato, o tipo de negócio, o objetivo, a urgência e se existe aderência com o que a NED consegue entregar.",
    outputs: ["Contexto inicial registrado", "Prioridade definida", "Próximo passo claro"],
  },
  {
    number: "02",
    title: "Diagnóstico de marketing",
    text: "Analisamos marca, oferta, público, concorrência, canais, comunicação e jornada antes de recomendar qualquer serviço.",
    outputs: ["Desafio central identificado", "Oportunidades e riscos", "Direção recomendada"],
  },
  {
    number: "03",
    title: "Direção e proposta",
    text: "Definimos posicionamento, entregas, canais, prazo, investimento, responsabilidades e critérios de aprovação.",
    outputs: ["Escopo documentado", "Cronograma", "Condições comerciais"],
  },
  {
    number: "04",
    title: "Criação e ativação",
    text: "A estratégia vira conteúdo, campanha, página, anúncio ou experiência. As decisões importantes são apresentadas com contexto, não apenas enviadas para aprovação.",
    outputs: ["Entregas intermediárias", "Validações objetivas", "Registro de decisões"],
  },
  {
    number: "05",
    title: "Revisão e lançamento",
    text: "Revisamos mensagem, identidade, experiência, funcionamento, rastreamento e comportamento nos canais antes de colocar a ação no ar.",
    outputs: ["Checklist de qualidade", "Publicação controlada", "Orientação de uso"],
  },
  {
    number: "06",
    title: "Análise e evolução",
    text: "Após a entrega, os próximos movimentos são definidos com base em dados, feedback e novas prioridades. Nem todo projeto precisa de acompanhamento mensal.",
    outputs: ["Período de suporte combinado", "Oportunidades de melhoria", "Continuidade opcional"],
  },
];

const responsibilities = [
  {
    icon: ClipboardCheck,
    title: "Informações confiáveis",
    text: "A empresa valida oferta, preços, regras, diferenciais, restrições e informações usadas na comunicação.",
  },
  {
    icon: MessagesSquare,
    title: "Retornos dentro do prazo",
    text: "Aprovações e materiais atrasados mudam o cronograma. O impacto é comunicado antes de qualquer nova data.",
  },
  {
    icon: ShieldCheck,
    title: "Acessos e materiais",
    text: "Contas, identidade, fotos, vídeos, domínios e plataformas devem ser disponibilizados pelos canais definidos para o projeto.",
  },
  {
    icon: Sparkles,
    title: "Participação nas decisões",
    text: "A NED conduz estratégia e execução, mas o conhecimento do negócio continua sendo essencial para criar uma comunicação verdadeira.",
  },
];

const faqs = [
  ["Quanto tempo leva um projeto?", "O prazo depende do escopo, volume de criação, canais envolvidos, disponibilidade de materiais e velocidade das validações. A data é definida na proposta, não prometida antes do diagnóstico."],
  ["Quantas revisões estão incluídas?", "A proposta define ciclos de revisão por etapa. Mudanças de direção ou novos itens podem virar ajuste de escopo."],
  ["Como acompanhamos o andamento?", "O projeto trabalha com etapas, responsáveis, entregas e próximos passos claros. O canal e a frequência são combinados no início."],
  ["A NED terceiriza tudo para outras pessoas?", "Quando houver especialistas ou fornecedores envolvidos, isso é tratado com transparência. A responsabilidade pela direção, coordenação e escopo contratado continua definida."],
];

export default function ProcessPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>PROCESSO DE MARKETING / SEM CAIXA-PRETA</span>
          <h1>
            Você sabe o que acontece <span>depois do contato.</span>
          </h1>
          <p className={styles.heroLead}>
            Um projeto de marketing não deve depender de inspiração solta, expectativa implícita ou aprovação sem contexto. O processo da NED transforma estratégia e criação em etapas verificáveis.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#etapas">Ver todas as etapas <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/portfolio">Ver projetos e experiências</a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Resumo do processo NED">
          <span className={styles.panelLabel}>FLUXO DO PROJETO / 06 ETAPAS</span>
          <div className={styles.panelStack}>
            {stages.slice(0, 4).map((stage) => (
              <div className={styles.panelItem} key={stage.number}>
                <span>{stage.number}</span>
                <strong>{stage.title}</strong>
                <small>{stage.outputs[0]}</small>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.pageSection} id="etapas">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>DA PRIMEIRA MENSAGEM À ATIVAÇÃO</span>
            <h2 className={styles.sectionTitle}>Etapas, decisões e <span>saídas concretas.</span></h2>
          </div>
          <p>Cada etapa termina com uma decisão, documento, entrega ou orientação. Isso reduz retrabalho e evita que a comunicação avance sem direção.</p>
        </div>

        <div className={styles.stageList}>
          {stages.map((stage) => (
            <article className={styles.stage} key={stage.number}>
              <div className={styles.stageTitle}>
                <span className={styles.stageNumber}>{stage.number}</span>
                <h2>{stage.title}</h2>
              </div>
              <p className={styles.stageCopy}>{stage.text}</p>
              <ul className={styles.stageOutputs}>
                {stage.outputs.map((output) => (
                  <li key={output}><Check size={14} /> {output}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>RESPONSABILIDADES DO CLIENTE</span>
            <h2 className={styles.sectionTitle}>Participação sem <span>microgerenciamento.</span></h2>
          </div>
          <p>A NED não transfere estratégia ou criação para o cliente. Porém, decisões sobre negócio, materiais, acessos e validações precisam de uma pessoa responsável.</p>
        </div>

        <div className={styles.roleGrid}>
          {responsibilities.map(({ icon: Icon, title, text }) => (
            <article className={styles.roleCard} key={title}>
              <span className={styles.cardIcon}><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.communication}>
          <aside className={styles.communicationAside}>
            <span className={styles.eyebrow}>COMUNICAÇÃO</span>
            <h2>Menos mensagem perdida.</h2>
            <p>Assunto importante precisa estar ligado a uma etapa, decisão ou pendência. O objetivo é evitar que o projeto dependa de memória e interpretação.</p>
          </aside>
          <div className={styles.communicationMain}>
            <span className={styles.eyebrow}>COMO FUNCIONA NA PRÁTICA</span>
            <h2>Contexto antes da urgência.</h2>
            <ul className={styles.checkList}>
              <li><Check size={15} /> Um canal principal para decisões do projeto.</li>
              <li><Check size={15} /> Entregas acompanhadas de explicação e ação esperada.</li>
              <li><Check size={15} /> Pendências com responsável e impacto no cronograma.</li>
              <li><Check size={15} /> Mudanças de direção registradas antes da execução.</li>
              <li><Check size={15} /> Reuniões usadas quando realmente aceleram uma decisão.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>DÚVIDAS ANTES DE CONTRATAR</span>
            <h2 className={styles.sectionTitle}>Sem promessa vaga.</h2>
          </div>
          <p>As respostas abaixo deixam claros os pontos que mais costumam gerar atrito em projetos de marketing e comunicação.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map(([question, answer]) => (
            <article className={styles.faqCard} key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div>
            <h2>Agora você já sabe como o projeto avança.</h2>
            <p>O próximo passo é mostrar o contexto da sua empresa para verificar qual direção de marketing faz sentido primeiro.</p>
          </div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Começar pela análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
