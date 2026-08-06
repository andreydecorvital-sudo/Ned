"use client";

import { CheckCircle2, Instagram, Link2, Unlink } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./instagram-connection-control.module.css";

type ConnectionSummary = {
  connected: boolean;
  oauthConfigured: boolean;
  missingConfiguration: string[];
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
    "Ainda faltam permissões obrigatórias no app Meta. Autorize novamente após adicioná-las.",
  "permissions-check-failed":
    "A Meta autorizou o login, mas não permitiu consultar as permissões concedidas.",
  "pages-read-failed":
    "A Meta não permitiu carregar as Páginas administradas por esta conta.",
  "token-exchange-failed":
    "A Meta recusou a troca do código de login pelo token. Confira App ID, App Secret e callback de produção.",
  "long-token-failed":
    "O login foi aceito, mas a Meta recusou a geração do token de longa duração.",
  "storage-failed":
    "A autorização funcionou, mas o NED não conseguiu salvar a conexão no banco de dados.",
  "missing-config": "A configuração do Instagram ainda está incompleta.",
  error: "Não foi possível concluir a conexão com o Instagram.",
};

function missingConfigurationMessage(items: string[]) {
  if (!items.length) return messages["missing-config"];
  return `Falta configurar na Vercel: ${items.join(", ")}.`;
}

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
    setNotice(
      status === "missing-config"
        ? missingConfigurationMessage(connection.missingConfiguration)
        : messages[status] ?? messages.error,
    );
    url.searchParams.delete("instagram");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [connection.missingConfiguration]);

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
        {!connection.connected && connection.missingConfiguration.length > 0 && (
          <p>{missingConfigurationMessage(connection.missingConfiguration)}</p>
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
            setNotice(missingConfigurationMessage(connection.missingConfiguration));
          }}
        >
          <Link2 size={14} /> Conectar Instagram
        </a>
      )}
    </aside>
  );
}
