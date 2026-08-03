import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import LoginForm from "./login-form";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/leads");
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <a className={styles.brand} href="/" aria-label="NED Marketing">
          <strong>NED</strong>
          <small>ADMIN</small>
        </a>
        <span className={styles.eyebrow}>ÁREA RESTRITA / LEADS</span>
        <h1>Controle comercial sem perder contexto.</h1>
        <p>
          Acesse os contatos gerados pelo diagnóstico, acompanhe o atendimento e exporte os dados.
        </p>
        <LoginForm configured={isAdminConfigured()} />
      </section>
    </main>
  );
}
