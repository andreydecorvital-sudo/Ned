import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import styles from "../commercial.module.css";

export function CommercialHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="NED Marketing — início">
        <strong>NED</strong>
        <span>MARKETING</span>
      </a>
      <nav className={styles.headerLinks} aria-label="Navegação principal">
        <a href="/servicos">Serviços</a>
        <a href="/processo">Processo</a>
        <a href="/portfolio">Portfólio</a>
        <a href="/ned-score">NED Score</a>
      </nav>
      <a className={styles.headerCta} href="/analise-gratuita">
        Solicitar análise <ArrowRight size={15} />
      </a>
    </header>
  );
}

export function CommercialFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <span>© {new Date().getFullYear()} NED Marketing</span>
        <span>Estrutura digital, captação e operação comercial.</span>
      </div>
      <nav aria-label="Links do rodapé">
        <a href="/servicos">Serviços</a>
        <a href="/processo">Processo</a>
        <a href="/portfolio">Portfólio</a>
        <a href="/parceiros">Parceiros</a>
        <a href="/privacidade">Privacidade</a>
      </nav>
    </footer>
  );
}

export function CommercialPage({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <CommercialHeader />
      {children}
      <CommercialFooter />
    </main>
  );
}
