import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock3, FlaskConical, Gamepad2, Target } from "lucide-react";
import Link from "next/link";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "NED LAB — Experiências interativas",
  description:
    "Experimentos, jogos e experiências digitais criados para transformar atenção em participação.",
  alternates: {
    canonical: "/lab",
  },
};

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
            O NED LAB transforma estratégia, problemas empresariais e campanhas em experiências
            que podem ser exploradas, jogadas e compartilhadas.
          </p>
          <div className={styles.labPills}>
            <span><Gamepad2 size={15} /> Portfólio jogável</span>
            <span><FlaskConical size={15} /> Protótipos reais</span>
            <span><Target size={15} /> Conversão com propósito</span>
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
          <strong>01 / EM CONSTRUÇÃO CONTÍNUA</strong>
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
              Entre em uma loja virtual, encontre três gargalos escondidos e tome uma decisão
              que muda o diagnóstico final.
            </p>
            <div className={styles.experimentMeta}>
              <span><Clock3 size={15} /> 2 minutos</span>
              <span>Mobile first</span>
              <span>Sem cadastro</span>
            </div>
            <strong className={styles.playLink}>
              Jogar experimento <ArrowRight size={19} />
            </strong>
          </div>
        </Link>
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
