import type { Metadata } from "next";
import { ArrowRight, CalendarDays, ExternalLink, Palette, ShieldCheck, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import styles from "./admin-home.module.css";

export const metadata: Metadata = {
  title: "Central administrativa",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const modules = [
  {
    href: "/admin/leads",
    eyebrow: "COMERCIAL",
    title: "CRM e leads",
    description:
      "Acompanhe novos contatos, mova oportunidades pelo pipeline e organize os próximos retornos.",
    action: "Abrir CRM",
    icon: Users,
  },
  {
    href: "/admin/conteudo",
    eyebrow: "SOCIAL MEDIA",
    title: "Conteúdo e agenda",
    description:
      "Prepare publicações, escolha músicas, revise o checklist e agende Feed, Reels e Stories.",
    action: "Abrir conteúdo",
    icon: CalendarDays,
  },
  {
    href: "/admin/marca",
    eyebrow: "BRAND OS",
    title: "Marca e Instagram",
    description:
      "Consulte cores, editorias e a estrutura dos Destaques sem tratar arquivos provisórios como oficiais.",
    action: "Abrir Brand Kit",
    icon: Palette,
  },
] as const;

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href="/" aria-label="Abrir o site da NED">
            <strong>NED</strong>
            <small>ADMIN</small>
          </a>
          <a className={styles.siteLink} href="/" target="_blank" rel="noreferrer">
            Ver site <ExternalLink size={15} />
          </a>
        </header>

        <section className={styles.hero}>
          <div>
            <span>CENTRAL DE OPERAÇÃO / NED</span>
            <h1>
              Tudo no lugar.
              <em>Escolha onde trabalhar.</em>
            </h1>
          </div>
          <div className={styles.security}>
            <ShieldCheck size={18} />
            <div>
              <strong>Sessão administrativa ativa</strong>
              <small>Use o menu flutuante para trocar de módulo ou sair.</small>
            </div>
          </div>
        </section>

        <section className={styles.modules} aria-label="Módulos administrativos">
          {modules.map(({ href, eyebrow, title, description, action, icon: Icon }) => (
            <a className={styles.module} href={href} key={href}>
              <div className={styles.moduleTop}>
                <span>{eyebrow}</span>
                <Icon size={26} />
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
              <strong>
                {action} <ArrowRight size={16} />
              </strong>
            </a>
          ))}
        </section>

        <section className={styles.help}>
          <span>ACESSO RÁPIDO</span>
          <p>
            No site público, clique no pequeno cadeado do rodapé ou use
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>.
          </p>
        </section>
      </div>
    </main>
  );
}
