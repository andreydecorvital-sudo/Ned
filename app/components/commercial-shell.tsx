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
      <nav className={styles.headerLinks} aria-label="Navegação comercial">
        <a href="/maquina-de-clientes">Máquina de Clientes</a>
        <a href="/analise-gratuita">Análise gratuita</a>
        <a href="/ned-score">NED Score</a>
        <a href="/parceiros">Parceiros</a>
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
      <span>© {new Date().getFullYear()} NED Marketing</span>
      <span>Estrutura digital, captação e operação comercial.</span>
      <a href="/privacidade">Privacidade e dados</a>
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
