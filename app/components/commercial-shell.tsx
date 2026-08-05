import { ArrowRight, LockKeyhole, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import CommercialDesktopNav from "./commercial-desktop-nav";
import CommercialMobileNav from "./commercial-mobile-nav";
import NedBrandMark from "./ned-brand-mark";
import styles from "./brand-shell.module.css";

const navigation = [
  ["Serviços", "/servicos"],
  ["Trabalhos", "/portfolio"],
  ["Processo", "/processo"],
  ["Sobre", "/sobre"],
] as const;

type BrandAccent = "institutional" | "misterios" | "sites" | "ia" | "automacao" | "marketplaces";

export function CommercialHeader() {
  return (
    <header className={styles.header}>
      <NedBrandMark variant="wordmark" />
      <CommercialDesktopNav />
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
      <div className={styles.footerIdentity}>
        <NedBrandMark variant="signature" />
        <div>
          <span>© {new Date().getFullYear()} NED Marketing</span>
          <span>Direção antes de ferramenta.</span>
        </div>
      </div>
      <div className={styles.footerLinks}>
        <nav aria-label="Links do rodapé">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          <a href="/privacidade">Privacidade</a>
          <a href="https://wa.me/5511917814612?text=Ol%C3%A1%2C%20Ned!%20Quero%20conversar%20sobre%20marketing%20para%20minha%20empresa." target="_blank" rel="noreferrer">
            <MessageCircle size={12} /> WhatsApp
          </a>
        </nav>
        <a
          className={styles.internalLink}
          href="/admin"
          aria-label="Abrir painel administrativo e CRM"
          title="Painel administrativo e CRM"
        >
          <LockKeyhole size={12} />
        </a>
      </div>
    </footer>
  );
}

export function CommercialPage({
  children,
  accent = "institutional",
}: {
  children: ReactNode;
  accent?: BrandAccent;
}) {
  return (
    <main
      className={styles.page}
      data-ned-brand="institutional"
      data-ned-accent={accent}
    >
      <CommercialHeader />
      {children}
      <CommercialFooter />
    </main>
  );
}
