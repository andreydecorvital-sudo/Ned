"use client";

import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Palette,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./admin-dock.module.css";

const destinations = [
  {
    href: "/admin",
    label: "Painel",
    icon: LayoutDashboard,
    active: (pathname: string) => pathname === "/admin",
  },
  {
    href: "/admin/leads",
    label: "CRM",
    icon: Users,
    active: (pathname: string) => pathname.startsWith("/admin/leads"),
  },
  {
    href: "/admin/conteudo",
    label: "Conteúdo",
    icon: CalendarDays,
    active: (pathname: string) => pathname.startsWith("/admin/conteudo"),
  },
  {
    href: "/admin/marca",
    label: "Marca",
    icon: Palette,
    active: (pathname: string) => pathname.startsWith("/admin/marca"),
  },
] as const;

export default function AdminDock() {
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/admin/login");
  };

  return (
    <nav className={styles.dock} aria-label="Navegação administrativa">
      <button
        className={styles.back}
        type="button"
        onClick={() => window.history.back()}
        aria-label="Voltar à tela anterior"
        title="Voltar"
      >
        <ArrowLeft size={17} />
        <span>Voltar</span>
      </button>

      <span className={styles.divider} aria-hidden="true" />

      {destinations.map(({ href, label, icon: Icon, active }) => (
        <a
          className={active(pathname) ? styles.active : undefined}
          href={href}
          key={href}
          aria-current={active(pathname) ? "page" : undefined}
        >
          <Icon size={16} />
          <span>{label}</span>
        </a>
      ))}

      <a href="/" target="_blank" rel="noreferrer" title="Abrir o site público">
        <ExternalLink size={16} />
        <span>Site</span>
      </a>

      <span className={styles.divider} aria-hidden="true" />

      <button className={styles.logout} type="button" onClick={() => void logout()}>
        <LogOut size={16} />
        <span>Sair</span>
      </button>
    </nav>
  );
}
