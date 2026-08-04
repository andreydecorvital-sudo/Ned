import type { Metadata } from "next";
import { ArrowRight, Check, Eye, Handshake, MessageSquareText, ShieldCheck, Target } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../client-pages.module.css";

export const metadata: Metadata = {
  title: "Sobre a NED — atendimento direto e marketing com contexto",
  description:
    "Conheça a forma de trabalho da NED Marketing: estrutura enxuta, atendimento direto, estratégia antes da ferramenta e transparência sobre escopo e resultados.",
  alternates: { canonical: "/sobre" },
};

const principles = [
  {
    icon: Target,
    title: "Direção antes de canal",
    text: "O projeto começa pelo negócio, pelo público e pelo objetivo. Formato, mídia e tecnologia entram depois.",
  },
  {
    icon: MessageSquareText,
    title: "Atendimento com contexto",
    text: "Decisões importantes são explicadas. Entregas e pendências precisam ter responsável e próximo passo claro.",
  },
  {
    icon: Eye,
    title: "Portfólio sem ficção",
    text: "Projetos próprios são identificados como próprios. Cases de clientes só entram com autorização e sem números inventados.",
  },
  {
    icon: ShieldCheck,
    title: "Tecnologia supervisionada",
    text: "Automação e inteligência artificial apoiam a execução, mas não substituem revisão, responsabilidade ou decisão humana.",
  },
];

const involvement = [
  "A primeira conversa busca entender o cenário antes de recomendar serviço.",
  "O escopo, o prazo e o investimento são definidos depois da análise.",
  "Especialistas podem entrar quando o trabalho exigir fotografia, vídeo, design, mídia ou outra competência específica.",
  "A responsabilidade por direção, coordenação e entrega contratada continua documentada.",
  "A continuidade é opcional e depende do que o projeto realmente precisa depois da entrega inicial.",
];

export default function AboutPage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>SOBRE / NED MARKETING</span>
          <h1>Uma estrutura enxuta. <span>Uma conversa direta.</span></h1>
          <p className={styles.heroLead}>
            A NED existe para organizar marketing e execução sem transformar o cliente em gerente de uma lista de fornecedores, ferramentas e tarefas desconectadas.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={17} /></a>
            <a className={styles.secondaryButton} href="/portfolio">Ver trabalhos</a>
          </div>
        </div>

        <aside className={styles.heroPanel} aria-label="Atendimento direto da NED">
          <span className={styles.panelLabel}>QUEM VOCÊ ENCONTRA</span>
          <div className={styles.panelStack}>
            <div className={styles.panelItem}><span>01</span><strong>Ned</strong><small>Atendimento e direção do projeto</small></div>
            <div className={styles.panelItem}><span>02</span><strong>Contexto</strong><small>Negócio antes da recomendação</small></div>
            <div className={styles.panelItem}><span>03</span><strong>Transparência</strong><small>Escopo, responsabilidade e aprovação</small></div>
            <div className={styles.panelItem}><span>04</span><strong>Rede de apoio</strong><small>Especialistas quando o projeto exigir</small></div>
          </div>
        </aside>
      </section>

      <section className={styles.pageSection}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>COMO A NED SE POSICIONA</span>
            <h2 className={styles.sectionTitle}>Marketing com <span>responsabilidade.</span></h2>
          </div>
          <p>A NED não se apresenta como uma equipe enorme, não promete resultado antes do diagnóstico e não usa ferramenta como substituta de estratégia.</p>
        </div>
        <div className={styles.valueGrid}>
          {principles.map(({ icon: Icon, title, text }) => (
            <article className={styles.valueCard} key={title}>
              <span className={styles.cardIcon}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.communication}>
          <aside className={styles.communicationAside}>
            <span className={styles.eyebrow}>ATENDIMENTO DIRETO</span>
            <h2>Você não precisa traduzir o problema para uma fila de departamentos.</h2>
            <p>A conversa começa com a situação real da empresa. A partir dela, a NED organiza a direção e identifica quais competências precisam entrar.</p>
          </aside>
          <div className={styles.communicationMain}>
            <span className={styles.eyebrow}>COMO FUNCIONA O ENVOLVIMENTO</span>
            <h2>Clareza sobre quem faz o quê.</h2>
            <ul className={styles.checkList}>
              {involvement.map((item) => <li key={item}><Check size={15} /> {item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.pageSectionDark}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>PARCERIAS</span>
            <h2 className={styles.sectionTitle}>Especialistas entram quando <span>melhoram a entrega.</span></h2>
          </div>
          <p>Fotografia, vídeo, design, tráfego, desenvolvimento ou outras competências podem ser conectadas ao projeto. Essa participação é tratada com transparência, sem fingir uma estrutura que não existe.</p>
        </div>
        <div className={styles.roleGrid}>
          <article className={styles.roleCard}><span className={styles.cardIcon}><Handshake size={22} /></span><h3>Indicação e colaboração</h3><p>Profissionais podem indicar projetos, participar de uma entrega específica ou trabalhar em conjunto com a direção da NED.</p></article>
          <article className={styles.roleCard}><span className={styles.cardIcon}><ShieldCheck size={22} /></span><h3>Responsabilidade definida</h3><p>O cliente sabe quem está envolvido, qual é o papel de cada pessoa e quem responde pelo escopo contratado.</p></article>
        </div>
      </section>

      <section className={styles.pageSectionSoft}>
        <div className={styles.ctaBand}>
          <div><h2>Uma boa conversa começa com o cenário real.</h2><p>Mostre o negócio, o objetivo e o principal desafio. A NED organiza a análise antes de apresentar uma direção.</p></div>
          <a className={styles.secondaryButton} href="/analise-gratuita">Solicitar análise <ArrowRight size={16} /></a>
        </div>
      </section>
    </CommercialPage>
  );
}
