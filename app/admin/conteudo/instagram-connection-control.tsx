"use client";

import { CheckCircle2, Instagram, Link2, Unlink } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./instagram-connection-control.module.css";

type ConnectionSummary = {
  connected: boolean;
  oauthConfigured: boolean;
  username: string;
  pageName: string;
  expiresAt: string | null;
};

const messages: Record<string, string> = {
  connected: "Instagram conectado com sucesso.",
  cancelled: "A conexão com o Instagram foi cancelada.",
  "invalid-state": "A validação de segurança expirou. Tente conectar novamente.",
  "missing-code": "O Meta não retornou a autorização esperada.",
  "professional-account-required":
    "Nenhuma conta profissional vinculada a uma Página do Facebook foi encontrada.",
  "permissions-required":
    "Autorize todas as permissões solicitadas para publicar, comentar e carregar a conta.",
  "missing-config":
    "Faltam as credenciais do aplicativo Meta nas variáveis da Vercel.",
  error: "Não foi possível concluir a conexão com o Instagram.",
};

export default function InstagramConnectionControl({
  initial,
}: {
  initial: ConnectionSummary;
}) {
  const [connection, setConnection] = useState(initial);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("instagram");
    if (!status) return;
    setNotice(messages[status] ?? messages.error);
    url.searchParams.delete("instagram");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const disconnect = async () => {
    if (!window.confirm("Desconectar a conta do Instagram deste painel?")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/instagram/disconnect", {
        method: "POST",
      });
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!response.ok) {
        setNotice("Não foi possível desconectar o Instagram.");
        return;
      }
      setConnection({
        ...connection,
        connected: false,
        username: "",
        pageName: "",
        expiresAt: null,
      });
      setNotice("Instagram desconectado.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className={styles.panel} aria-label="Conexão com Instagram">
      <div className={styles.icon}>
        <Instagram size={20} />
      </div>
      <div className={styles.copy}>
        <span>INSTAGRAM / META</span>
        {connection.connected ? (
          <>
            <strong>
              <CheckCircle2 size={14} /> @{connection.username || "conta conectada"}
            </strong>
            <small>{connection.pageName || "Conta profissional pronta para publicar"}</small>
          </>
        ) : (
          <>
            <strong>Conecte a conta profissional</strong>
            <small>
              O login salva os tokens de usuário e Página com criptografia, sem colar credenciais manualmente.
            </small>
          </>
        )}
        {notice && <p>{notice}</p>}
      </div>
      {connection.connected ? (
        <button type="button" disabled={busy} onClick={() => void disconnect()}>
          <Unlink size={14} /> {busy ? "Desconectando" : "Desconectar"}
        </button>
      ) : (
        <a
          href={connection.oauthConfigured ? "/api/admin/instagram/connect" : "#instagram-config"}
          aria-disabled={!connection.oauthConfigured}
          onClick={(event) => {
            if (connection.oauthConfigured) return;
            event.preventDefault();
            setNotice(messages["missing-config"]);
          }}
        >
          <Link2 size={14} /> Conectar Instagram
        </a>
      )}
    </aside>
  );
}
