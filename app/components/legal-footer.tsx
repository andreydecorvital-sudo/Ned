"use client";

import { usePathname } from "next/navigation";
import styles from "./legal-footer.module.css";

export default function LegalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className={styles.footer}>
      <a href="/privacidade">Privacidade e tratamento de dados</a>
    </div>
  );
}
