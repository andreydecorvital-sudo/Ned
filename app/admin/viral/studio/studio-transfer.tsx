"use client";

import { upload } from "@vercel/blob/client";
import {
  ArrowLeft,
  CheckCircle2,
  FileImage,
  LoaderCircle,
  Rocket,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  SocialFormat,
  SocialMediaAsset,
  SocialPostRecord,
} from "@/lib/social-types";
import type { ViralStudioDraft } from "@/lib/viral-types";
import styles from "./studio-transfer.module.css";

const STORAGE_KEY = "ned_viral_studio_draft";

function mediaLimit(format: SocialFormat) {
  return format === "carousel" ? 10 : 1;
}

function accepts(format: SocialFormat) {
  if (format === "feed") return "image/jpeg,image/png,image/webp";
  if (format === "reel") return "video/mp4,video/quicktime";
  return "image/jpeg,image/png,image/webp,video/mp4,video/quicktime";
}

function compatible(format: SocialFormat, contentType: string) {
  if (format === "feed") return contentType.startsWith("image/");
  if (format === "reel") return contentType.startsWith("video/");
  return contentType.startsWith("image/") || contentType.startsWith("video/");
}

function formatLabel(format: SocialFormat) {
  if (format === "carousel") return "Carrossel";
  if (format === "reel") return "Reel";
  if (format === "story") return "Story";
  return "Feed";
}

function validDraft(value: unknown): value is ViralStudioDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<ViralStudioDraft>;
  return (
    typeof draft.format === "string" &&
    ["feed", "carousel", "reel", "story"].includes(draft.format) &&
    typeof draft.caption === "string" &&
    typeof draft.title === "string"
  );
}

export default function StudioTransfer() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<ViralStudioDraft | null>(null);
  const [caption, setCaption] = useState("");
  const [firstComment, setFirstComment] = useState("");
  const [accountName, setAccountName] = useState("NED Marketing");
  const [altText, setAltText] = useState("");
  const [media, setMedia] = useState<SocialMediaAsset[]>([]);
  const [configurationReady, setConfigurationReady] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (validDraft(parsed)) {
          setDraft(parsed);
          setCaption(parsed.caption);
          setFirstComment(parsed.firstComment ?? "");
          setAccountName(parsed.accountName || "NED Marketing");
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    void (async () => {
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const payload = (await response.json()) as {
          configuration?: { blob?: boolean };
          error?: string;
        };
        if (response.status === 401) {
          window.location.assign("/admin/login");
          return;
        }
        setConfigurationReady(Boolean(payload.configuration?.blob));
      } catch {
        setConfigurationReady(false);
      }
    })();
  }, []);

  const readyToSave = useMemo(() => {
    if (!draft || !media.length || saving || uploading) return false;
    if (draft.format === "carousel" && media.length < 2) return false;
    return true;
  }, [draft, media.length, saving, uploading]);

  const uploadFiles = async (files: FileList | null) => {
    if (!draft || !files?.length || uploading) return;
    if (!configurationReady) {
      setError("Configure BLOB_READ_WRITE_TOKEN para enviar mídia.");
      return;
    }

    const remaining = mediaLimit(draft.format) - media.length;
    const selected = Array.from(files).slice(0, remaining);
    if (!selected.length) {
      setError("O limite de mídia deste formato já foi atingido.");
      return;
    }

    const invalid = selected.find((file) => !compatible(draft.format, file.type));
    if (invalid) {
      setError(`${invalid.name} não é compatível com ${formatLabel(draft.format)}.`);
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");
    try {
      const nextAssets: SocialMediaAsset[] = [];
      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        const blob = await upload(`ned-social/viral/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/content/upload",
          multipart: file.size >= 100 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => {
            setProgress(
              Math.round(((index + percentage / 100) / selected.length) * 100),
            );
          },
        });
        nextAssets.push({
          url: blob.url,
          pathname: blob.pathname,
          contentType: file.type,
          size: file.size,
        });
      }
      setMedia((current) => [...current, ...nextAssets]);
      setNotice("Mídia adicionada. Revise o texto e salve o rascunho.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Não foi possível enviar a mídia.",
      );
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveDraft = async () => {
    if (!draft || !readyToSave) return;
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName: accountName.trim() || "NED Marketing",
          format: draft.format,
          caption: caption.trim(),
          media,
          scheduledAt: null,
          status: "draft",
          shareToFeed: true,
          audio: null,
          audioName: "",
          coverUrl: "",
          collaborators: [],
          firstComment: firstComment.trim(),
          locationId: "",
          altText: altText.trim(),
          isAiGenerated: true,
        }),
      });
      const payload = (await response.json()) as {
        post?: SocialPostRecord;
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!response.ok || !payload.post) {
        setError(payload.error ?? "Não foi possível salvar o rascunho.");
        return;
      }

      if (draft.ideaId) {
        await fetch("/api/admin/viral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "markIdeaUsed", id: draft.ideaId }),
        }).catch(() => null);
      }

      window.localStorage.removeItem(STORAGE_KEY);
      setNotice("Rascunho criado. Abrindo a agenda de conteúdo...");
      window.setTimeout(() => window.location.assign("/admin/conteudo"), 800);
    } catch {
      setError("Falha de conexão ao salvar o rascunho.");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <Rocket size={38} />
          <h1>Nenhuma ideia foi enviada.</h1>
          <p>Volte para a Viral Machine, escolha uma ideia e clique em “Executar”.</p>
          <a href="/admin/viral"><ArrowLeft size={15} /> Voltar para a Viral Machine</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/admin/viral"><ArrowLeft size={15} /> Viral Machine</a>
        <strong>NED · FINALIZAÇÃO</strong>
        <a href="/admin/conteudo">Abrir agenda</a>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <span>IDEIA → RASCUNHO REAL</span>
          <h1>Finalize sem reconstruir o conteúdo.</h1>
          <p>
            O texto já veio da Viral Machine. Adicione a mídia, faça os últimos ajustes e
            salve na agenda. Nada será publicado automaticamente nesta etapa.
          </p>
        </section>

        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.grid}>
          <section className={styles.summaryCard}>
            <span>CONTEÚDO SELECIONADO</span>
            <div className={styles.scoreRow}>
              <div><strong>{draft.title}</strong><small>{formatLabel(draft.format)}</small></div>
              <b>{draft.score}<small>/100</small></b>
            </div>
            <ol>
              <li className={styles.done}><CheckCircle2 size={16} /> Estratégia e texto definidos</li>
              <li className={media.length ? styles.done : ""}><FileImage size={16} /> Mídia adicionada</li>
              <li><Rocket size={16} /> Rascunho salvo na agenda</li>
            </ol>
          </section>

          <section className={styles.editorCard}>
            <div className={styles.sectionTitle}>
              <span>01 · MÍDIA</span>
              <h2>{draft.format === "carousel" ? "Adicione de 2 a 10 arquivos" : "Adicione o arquivo principal"}</h2>
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple={draft.format === "carousel"}
              accept={accepts(draft.format)}
              onChange={(event) => void uploadFiles(event.target.files)}
              hidden
            />
            <button
              className={styles.uploadButton}
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || configurationReady === false}
            >
              {uploading ? <LoaderCircle className={styles.spin} size={18} /> : <UploadCloud size={18} />}
              {uploading ? `Enviando ${progress}%` : "Selecionar mídia"}
            </button>

            {media.length > 0 && (
              <div className={styles.mediaList}>
                {media.map((asset, index) => (
                  <div key={`${asset.pathname}-${index}`}>
                    <FileImage size={15} />
                    <span>{asset.pathname.split("/").pop()}</span>
                    <button type="button" onClick={() => setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remover</button>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.sectionTitle}>
              <span>02 · REVISÃO</span>
              <h2>Ajuste somente o necessário.</h2>
            </div>

            <label>
              <span>CONTA / CLIENTE</span>
              <input value={accountName} onChange={(event) => setAccountName(event.target.value)} />
            </label>
            <label>
              <span>LEGENDA</span>
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} />
            </label>
            <label>
              <span>PRIMEIRO COMENTÁRIO</span>
              <textarea value={firstComment} onChange={(event) => setFirstComment(event.target.value)} />
            </label>
            <label>
              <span>TEXTO ALTERNATIVO</span>
              <textarea value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Descreva a imagem para acessibilidade. Pode ser concluído depois no Estúdio." />
            </label>

            <div className={styles.finalActions}>
              <a href="/admin/viral">Cancelar</a>
              <button type="button" onClick={() => void saveDraft()} disabled={!readyToSave}>
                {saving ? <LoaderCircle className={styles.spin} size={17} /> : <Rocket size={17} />}
                {saving ? "Criando rascunho..." : "Salvar rascunho e abrir agenda"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
