import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Eye,
  FlaskConical,
  Gamepad2,
  MessageSquareText,
  Route,
  ShoppingBag,
  Target,
} from "lucide-react";
import Link from "next/link";
import evolutionStyles from "./lab-evolution.module.css";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "NED LAB — jogos e experiências interativas",
  description:
    "Experimentos jogáveis criados para transformar problemas de marketing, vendas e operação em participação, aprendizado e conversa.",
  alternates: {
    canonical: "/lab",
  },
};

const upcomingExperiences = [
  {
    icon: Route,
    title: "Funil Furado",
    description:
      "Uma investigação sobre onde o interesse desaparece entre anúncio, página, atendimento e follow-up.",
    mechanics: ["Mapa de jornada", "Escolhas por etapa", "Diagnóstico do maior vazamento"],
  },
  {
    icon: MessageSquareText,
    title: "Atendimento Fantasma",
    description:
      "Uma simulação sobre demora, resposta vaga, falta de contexto e oportunidades que esfriam na fila.",
    mechanics: ["Caixa de entrada dinâmica", "Priorização de contatos", "Consequências por tempo de resposta"],
  },
  {
    icon: ShoppingBag,
    title: "Vitrine Fraca",
    description:
      "Uma experiência para mostrar como título, imagem, prova e descrição alteram a percepção de um anúncio em marketplace.",
    mechanics: ["Comparação de anúncios", "Decisões de catálogo", "Leitura de clareza e confiança"],
  },
];

export default function LabPage() {
  return (
    <main className={styles.labPage}>
      <header className={styles.labHeader}>
        <Link className={styles.labBrand} href="/" aria-label="Voltar para a Ned Marketing">
          <span>NED</span>
          <small>LAB</small>
        </Link>
        <Link className={styles.headerBack} href="/">
          <ArrowLeft size={16} /> Site principal
        </Link>
      </header>

      <section className={styles.labHero}>
        <div className={styles.labHeroGrid} aria-hidden="true" />
        <div className={styles.labHeroCopy}>
          <span className={styles.kicker}>EXPERIMENTOS • JOGOS • NEGÓCIOS</span>
          <h1>
            Ideias que não foram feitas apenas para serem <span>assistidas.</span>
          </h1>
          <p>
            O NED LAB transforma problemas de marketing, vendas e operação em experiências que
            podem ser exploradas, jogadas e discutidas.
          </p>
          <div className={styles.labPills}>
            <span><Gamepad2 size={15} /> Portfólio jogável</span>
            <span><FlaskConical size={15} /> Protótipos reais</span>
            <span><Target size={15} /> Aprendizado com função</span>
          </div>
        </div>
        <div className={styles.labMark} aria-hidden="true">
          <span>NED</span>
          <small>EXPERIMENTAL UNIT / 001</small>
        </div>
      </section>

      <section className={styles.experimentsSection}>
        <div className={styles.sectionHeading}>
          <span>EXPERIMENTOS PUBLICADOS</span>
          <strong>01 / EM EVOLUÇÃO CONTÍNUA</strong>
        </div>

        <Link className={styles.experimentCard} href="/lab/maquina-quebrada">
          <div className={styles.experimentVisual}>
            <div className={styles.cardGrid} aria-hidden="true" />
            <div className={styles.cardTarget} aria-hidden="true">
              <span />
              <span />
              <Target size={42} />
            </div>
            <span className={styles.experimentNumber}>001</span>
            <span className={styles.experimentStatus}>PROTÓTIPO JOGÁVEL</span>
          </div>
          <div className={styles.experimentCopy}>
            <span>DIAGNÓSTICO EMPRESARIAL INTERATIVO</span>
            <h2>A Máquina Quebrada</h2>
            <p>
              Entre em uma loja virtual, encontre três gargalos escondidos e tome decisões sobre
              oferta, atendimento e operação. Suas escolhas alteram o diagnóstico final.
            </p>
            <div className={styles.experimentMeta}>
              <span><Clock3 size={15} /> 3 minutos</span>
              <span>Responsivo</span>
              <span>Sem cadastro</span>
            </div>
            <strong className={styles.playLink}>
              Jogar experimento <ArrowRight size={19} />
            </strong>
          </div>
        </Link>
      </section>

      <section className={evolutionStyles.publishedDetail}>
        <div className={evolutionStyles.sectionHead}>
          <div>
            <span>O QUE O EXPERIMENTO DEMONSTRA</span>
            <h2>Interação precisa <em>ensinar alguma coisa.</em></h2>
          </div>
          <p>
            A Máquina Quebrada não foi criada apenas para parecer diferente. Cada etapa demonstra
            uma competência de estratégia, conteúdo, experiência e conversão.
          </p>
        </div>

        <div className={evolutionStyles.detailGrid}>
          <article className={evolutionStyles.detailCard}>
            <span><Eye size={21} /></span>
            <h3>Atenção orientada</h3>
            <p>O usuário precisa observar a cena e encontrar sinais, em vez de receber uma lista pronta de problemas.</p>
          </article>
          <article className={evolutionStyles.detailCard}>
            <span><Gamepad2 size={21} /></span>
            <h3>Escolhas com consequência</h3>
            <p>As decisões de oferta, atendimento e operação mudam a pontuação e o perfil apresentado no final.</p>
          </article>
          <article className={evolutionStyles.detailCard}>
            <span><Target size={21} /></span>
            <h3>Conversa comercial coerente</h3>
            <p>O CTA final nasce do gargalo encontrado na simulação, sem interromper a experiência com uma oferta aleatória.</p>
          </article>
        </div>

        <Link className={evolutionStyles.caseLink} href="/portfolio/maquina-quebrada">
          Ver estudo de caso completo <ArrowRight size={16} />
        </Link>
      </section>

      <section className={evolutionStyles.roadmapSection}>
        <div className={evolutionStyles.sectionHead}>
          <div>
            <span>PRÓXIMOS CONCEITOS / NED LAB</span>
            <h2>Problemas de negócio que podem virar <em>experiência.</em></h2>
          </div>
          <p>
            Estes projetos ainda não estão publicados. Eles formam uma direção de desenvolvimento,
            não uma promessa de entrega ou um portfólio fictício.
          </p>
        </div>

        <div className={evolutionStyles.roadmapGrid}>
          {upcomingExperiences.map(({ icon: Icon, title, description, mechanics }) => (
            <article className={evolutionStyles.roadmapCard} key={title}>
              <div className={evolutionStyles.roadmapTop}>
                <span><Icon size={21} /></span>
                <span className={evolutionStyles.status}>CONCEITO</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>
                {mechanics.map((mechanic) => <li key={mechanic}>— {mechanic}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className={evolutionStyles.disclaimer}>
          O próximo experimento será escolhido pelo valor estratégico, pela qualidade da mecânica e pela capacidade de demonstrar uma competência real da NED — não pela quantidade de jogos no portfólio.
        </div>
      </section>

      <section className={styles.labManifesto}>
        <span>O PRINCÍPIO</span>
        <h2>
          Um jogo só entra aqui quando consegue <em>entreter, explicar e demonstrar.</em>
        </h2>
        <p>
          O LAB não substitui o site comercial da NED. Ele mostra, na prática, como uma marca
          pode transformar uma mensagem passiva em participação.
        </p>
      </section>
    </main>
  );
}
