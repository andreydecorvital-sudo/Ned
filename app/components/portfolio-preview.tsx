import { ArrowRight, Gauge, Gamepad2, Megaphone } from "lucide-react";
import styles from "../commercial.module.css";

const projects = [
  {
    icon: Gauge,
    label: "DIAGNÓSTICO DE MARKETING",
    title: "NED Score",
    text: "Experiência que transforma respostas em uma leitura inicial sobre oferta, posicionamento, presença, aquisição e atendimento.",
    href: "/ned-score",
  },
  {
    icon: Gamepad2,
    label: "CONTEÚDO INTERATIVO / NED LAB",
    title: "A Máquina Quebrada",
    text: "Narrativa gamificada sobre oferta, atendimento e operação, criada para gerar reflexão, interação e compartilhamento.",
    href: "/lab/maquina-quebrada",
  },
  {
    icon: Megaphone,
    label: "ESTRATÉGIA E CONVERSÃO",
    title: "Jornada NED",
    text: "Posicionamento, páginas, conteúdo, diagnóstico e acompanhamento conectados para transformar atenção em conversa com contexto.",
    href: "/portfolio",
  },
];

export default function PortfolioPreview() {
  return (
    <section className={styles.sectionSoft} aria-labelledby="portfolio-preview-title">
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>PORTFÓLIO / MARKETING EM PRÁTICA</span>
          <h2 className={styles.sectionTitle} id="portfolio-preview-title">
            Veja como a NED transforma estratégia em <span>experiência.</span>
          </h2>
        </div>
        <p>
          Projetos próprios e experiências públicas demonstram pensamento estratégico, direção criativa, conteúdo, conversão e mensuração sem inventar clientes ou resultados.
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
