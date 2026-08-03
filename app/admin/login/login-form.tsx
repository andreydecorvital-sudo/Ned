"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import styles from "../admin.module.css";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }

      window.location.assign("/admin/leads");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      {!configured && (
        <div className={styles.warning}>
          Este deploy não recebeu NED_ADMIN_PASSWORD. Confirme que a variável está vinculada ao
          ambiente Production do projeto Ned e faça um novo redeploy.
        </div>
      )}

      <label htmlFor="admin-password">SENHA ADMINISTRATIVA</label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        autoFocus
        disabled={!configured}
        placeholder="Digite a senha do painel"
      />

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.primaryButton} type="submit" disabled={!configured || loading}>
        <LockKeyhole size={17} />
        {loading ? "Entrando..." : "Acessar painel"}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
