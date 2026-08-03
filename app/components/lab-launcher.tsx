"use client";

import { FlaskConical } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./lab-launcher.module.css";

export default function LabLauncher() {
  const pathname = usePathname();

  if (pathname.startsWith("/lab")) return null;

  return (
    <a className={styles.launcher} href="/lab" aria-label="Abrir NED LAB" data-cursor="JOGAR">
      <span className={styles.icon}><FlaskConical size={17} /></span>
      <span className={styles.copy}>
        <small>NOVO</small>
        <strong>NED LAB</strong>
      </span>
    </a>
  );
}
