import { ArrowRight, Gauge, Gamepad2, LayoutDashboard } from "lucide-react";
import styles from "../commercial.module.css";

const projects = [
  {
    icon: Gauge,
    label: "FERRAMENTA INTERATIVA",
    title: "NED Score",
    text: "Diagnóstico com pontuação, perfil, gargalo principal e envio de contexto para o CRM.",
    href: "/ned-score",
  },
  {
    icon: Gamepad2,
    label: "EXPERIÊNCIA / NED LAB",
    title: "A Máquina Quebrada",
    text: "Experiência gamificada sobre oferta, atendimento e operação com resultado compartilhável.",
    href: "/lab/maquina-quebrada",
  },
  {
    icon: LayoutDashboard,
    label: "SISTEMA INTERNO",
    title: "CRM NED",
    text: "Pipeline Kanban, prioridade, histórico, follow-up, métricas, filtros e proteção de dados.",
    href: "/portfolio",
  },
];

export default function PortfolioPreview() {
  return (
    <section className={styles.sectionSoft} aria-labelledby="portfolio-preview-title">
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>PORTFÓLIO / PROJETOS REAIS</span>
          <h2 className={styles.sectionTitle} id="portfolio-preview-title">
            Veja o que a NED já <span>construiu.</span>
          </h2>
        </div>
        <p>
          Produtos próprios, ferramentas internas e experiências públicas demonstram estratégia, design, desenvolvimento e operação sem depender de cases fictícios.
        </p>
      </div>

      <div className={styles.grid3}>
        {projects.map(({ icon: Icon, label, title, text, href }) => (
          <article className={styles.toolCard} key={title}>
            <span className={styles.toolIcon}><Icon size={22} /></span>
            <small>{label}</small>
            <h3>{title}</h3>
            <p>{text}</p>
            <a className={styles.textLink} href={href}>Abrir projeto <ArrowRight size={15} /></a>
          </article>
        ))}
      </div>

      <div className={styles.heroActions}>
        <a className={styles.primary} href="/portfolio">
          Ver portfólio completo <ArrowRight size={16} />
        </a>
        <a className={styles.secondary} href="/processo">Entender o processo</a>
      </div>
    </section>
  );
}
