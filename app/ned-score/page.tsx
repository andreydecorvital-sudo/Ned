import type { Metadata } from "next";
import { BarChart3, Bot, MessageCircle, MonitorSmartphone } from "lucide-react";
import { CommercialPage } from "../components/commercial-shell";
import styles from "../commercial.module.css";
import ScoreExperience from "./score-experience";

export const metadata: Metadata = {
  title: "NED Score — diagnóstico da estrutura comercial",
  description:
    "Avalie oferta, presença digital, captação, atendimento, follow-up, dados e automação em um diagnóstico interativo.",
  alternates: { canonical: "/ned-score" },
  openGraph: {
    title: "Descubra seu NED Score",
    description: "Uma pontuação objetiva para os principais pontos da sua estrutura comercial.",
    url: "/ned-score",
  },
};

const categories = [
  [MonitorSmartphone, "Presença e oferta", "Clareza, página, experiência no celular e próximo passo."],
  [MessageCircle, "Captação e atendimento", "Contato, velocidade de resposta, qualificação e follow-up."],
  [BarChart3, "Dados", "Origem dos leads, acompanhamento e melhoria com base em informação."],
  [Bot, "Automação", "Tarefas repetitivas, integrações e processos que podem ganhar eficiência."],
] as const;

export default function NedScorePage() {
  return (
    <CommercialPage>
      <section className={`${styles.hero} ${styles.heroCompact}`}>
        <div>
          <span className={styles.eyebrow}>DIAGNÓSTICO INTERATIVO / NED</span>
          <h1>Descubra onde sua estrutura comercial está vazando.</h1>
          <p className={styles.heroLead}>
            O NED Score transforma respostas sobre presença digital, captação, atendimento, dados e automação em uma pontuação de 0 a 100 com prioridades práticas.
          </p>
          <div className={styles.heroMeta}>
            <span>8 perguntas</span>
            <span>Resultado imediato</span>
            <span>Estimativa, não promessa financeira</span>
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <span className={styles.panelKicker}>O QUE SERÁ AVALIADO</span>
          <div className={styles.pipeline}>
            {categories.map(([Icon, title, description], index) => (
              <div className={styles.pipelineItem} key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
                <Icon size={16} />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.section}>
        <ScoreExperience />
      </section>
    </CommercialPage>
  );
}
