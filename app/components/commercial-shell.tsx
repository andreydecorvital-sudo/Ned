import { ArrowRight, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import styles from "../commercial.module.css";
import CommercialMobileNav from "./commercial-mobile-nav";

const navigation = [
  ["Serviços", "/servicos"],
  ["Trabalhos", "/portfolio"],
  ["Processo", "/processo"],
  ["Sobre", "/sobre"],
] as const;

export function CommercialHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="NED Marketing — início">
        <strong>NED</strong>
        <span>MARKETING</span>
      </a>
      <nav className={styles.headerLinks} aria-label="Navegação principal">
        {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
      </nav>
      <a className={styles.headerCta} href="/analise-gratuita">
        Solicitar análise <ArrowRight size={15} />
      </a>
      <CommercialMobileNav />
    </header>
  );
}

export function CommercialFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <span>© {new Date().getFullYear()} NED Marketing</span>
        <span>Marketing, conteúdo, conversão e marketplaces.</span>
      </div>
      <nav aria-label="Links do rodapé">
        {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        <a href="/privacidade">Privacidade</a>
        <a href="https://wa.me/5511917814612?text=Ol%C3%A1%2C%20Ned!%20Quero%20conversar%20sobre%20marketing%20para%20minha%20empresa." target="_blank" rel="noreferrer">
          <MessageCircle size={12} /> WhatsApp
        </a>
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
