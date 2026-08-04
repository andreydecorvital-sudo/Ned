"use client";

import { LockKeyhole } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import styles from "./legal-footer.module.css";

const commercialRoutes = [
  "/",
  "/servicos",
  "/processo",
  "/portfolio",
  "/sobre",
  "/analise-gratuita",
  "/ned-score",
  "/maquina-de-clientes",
  "/parceiros",
  "/privacidade",
];

function hasCommercialFooter(pathname: string) {
  return commercialRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default function LegalFooter() {
  const pathname = usePathname();

  useEffect(() => {
    const openAdmin = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        window.location.assign("/admin");
      }
    };

    window.addEventListener("keydown", openAdmin);
    return () => window.removeEventListener("keydown", openAdmin);
  }, []);

  if (pathname.startsWith("/admin") || hasCommercialFooter(pathname)) return null;

  return (
    <footer className={styles.footer}>
      <span aria-hidden="true" />
      <a className={styles.privacy} href="/privacidade">Privacidade e tratamento de dados</a>
      <a className={styles.internal} href="/admin" aria-label="Abrir área administrativa" title="Área interna">
        <LockKeyhole size={11} />
      </a>
    </footer>
  );
}
