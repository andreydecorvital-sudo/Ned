"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./commercial-mobile-nav.module.css";

const links = [
  ["Serviços", "/servicos"],
  ["Trabalhos", "/portfolio"],
  ["Processo", "/processo"],
  ["Sobre", "/sobre"],
] as const;

export default function CommercialMobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        className={styles.trigger}
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <nav className={styles.panel} aria-label="Navegação mobile" onClick={(event) => event.stopPropagation()}>
            {links.map(([label, href], index) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label} <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            ))}
            <a className={styles.cta} href="/analise-gratuita" onClick={() => setOpen(false)}>
              Solicitar análise <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
