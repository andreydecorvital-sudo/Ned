"use client";

import { usePathname } from "next/navigation";
import styles from "./brand-shell.module.css";

const navigation = [
  ["Serviços", "/servicos"],
  ["Trabalhos", "/portfolio"],
  ["Processo", "/processo"],
  ["Sobre", "/sobre"],
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CommercialDesktopNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.headerLinks} aria-label="Navegação principal">
      {navigation.map(([label, href]) => {
        const active = isActive(pathname, href);
        return (
          <a href={href} key={href} aria-current={active ? "page" : undefined}>
            {label}
          </a>
        );
      })}
    </nav>
  );
}
