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
    redirect("/admin");
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <a className={styles.brand} href="/" aria-label="NED Marketing">
          <img src="/brand/ned-logo-official.webp" alt="NED Marketing" />
          <small>ADMIN</small>
        </a>
        <span className={styles.eyebrow}>ÁREA RESTRITA / OPERAÇÃO</span>
        <h1>Entre e escolha onde trabalhar.</h1>
        <p>
          A central administrativa reúne CRM, atendimento, conteúdo e os próximos módulos da NED.
        </p>
        <LoginForm configured={isAdminConfigured()} />
      </section>
    </main>
  );
}
