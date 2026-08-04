"use client";

import { upload } from "@vercel/blob/client";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileImage,
  Film,
  Globe2,
  LoaderCircle,
  LogOut,
  RefreshCcw,
  Send,
  Trash2,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  socialFormatLabels,
  socialFormats,
  socialStatusLabels,
  type SocialFormat,
  type SocialMediaAsset,
  type SocialPostRecord,
} from "@/lib/social-types";
import styles from "./content-dashboard.module.css";

type Configuration = { database: boolean; blob: boolean; instagram: boolean; scheduler: boolean };
type ApiResponse = { posts?: SocialPostRecord[]; configuration?: Configuration; error?: string };
type FormState = {
  accountName: string;
  format: SocialFormat;
  caption: string;
  scheduledAt: string;
  shareToFeed: boolean;
  media: SocialMediaAsset[];
};

const emptyForm: FormState = {
  accountName: "NED Marketing",
  format: "feed",
  caption: "",
  scheduledAt: "",
  shareToFeed: true,
  media: [],
};

function localMinimum() {
  const date = new Date(Date.now() + 120_000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) return "Sem horário definido";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

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

export default function ContentDashboard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<SocialPostRecord[]>([]);
  const [configuration, setConfiguration] = useState<Configuration>();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = (await response.json()) as ApiResponse;
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok) return setError(data.error ?? "Não foi possível carregar a agenda.");
      setPosts(data.posts ?? []);
      setConfiguration(data.configuration);
    } catch {
      setError("Falha de conexão ao carregar a agenda.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const metrics = useMemo(() => ({
    scheduled: posts.filter((post) => post.status === "scheduled").length,
    drafts: posts.filter((post) => post.status === "draft").length,
    published: posts.filter((post) => post.status === "published").length,
    failed: posts.filter((post) => post.status === "failed").length,
  }), [posts]);

  const changeFormat = (format: SocialFormat) => {
    setForm((current) => ({
      ...current,
      format,
      media: current.media.filter((asset) => compatible(format, asset.contentType)).slice(0, mediaLimit(format)),
    }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length || uploading) return;
    if (!configuration?.blob) return setError("Configure BLOB_READ_WRITE_TOKEN para enviar mídia.");
    const selected = Array.from(files).slice(0, mediaLimit(form.format) - form.media.length);
    if (!selected.length) return setError("O limite de mídia deste formato já foi atingido.");
    const invalid = selected.find((file) => !compatible(form.format, file.type));
    if (invalid) return setError(`${invalid.name} não é compatível com ${socialFormatLabels[form.format]}.`);

    setUploading(true);
    setError("");
    setNotice("");
    try {
      const assets: SocialMediaAsset[] = [];
      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
        const blob = await upload(`ned-social/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/content/upload",
          multipart: file.size >= 100 * 1024 * 1024,
          onUploadProgress: ({ percentage }) =>
            setProgress(Math.round(((index + percentage / 100) / selected.length) * 100)),
        });
        assets.push({ url: blob.url, pathname: blob.pathname, contentType: file.type, size: file.size });
      }
      setForm((current) => ({ ...current, media: [...current.media, ...assets] }));
      setNotice("Mídia enviada com sucesso.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no envio da mídia.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const submit = async (status: "draft" | "scheduled") => {
    setError("");
    setNotice("");
    if (!form.media.length) return setError("Adicione pelo menos uma imagem ou vídeo.");
    if (form.format === "carousel" && form.media.length < 2) return setError("Carrossel precisa de pelo menos duas mídias.");
    if (status === "scheduled" && !form.scheduledAt) return setError("Escolha data e horário.");

    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        }),
      });
      const data = (await response.json()) as { post?: SocialPostRecord; warning?: string; error?: string };
      if (!response.ok || !data.post) return setError(data.error ?? "Não foi possível salvar.");
      setForm(emptyForm);
      setNotice(data.warning || (status === "scheduled" ? "Publicação agendada." : "Rascunho salvo."));
      await load(true);
    } catch {
      setError("Falha de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const publishNow = async (post: SocialPostRecord) => {
    if (!window.confirm(`Publicar ${socialFormatLabels[post.format]} agora?`)) return;
    setBusyId(post.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${post.id}/publish`, { method: "POST" });
      const data = (await response.json()) as { post?: SocialPostRecord; error?: string };
      if (!response.ok || !data.post) {
        await load(true);
        return setError(data.error ?? "A publicação falhou.");
      }
      setNotice("Conteúdo publicado no Instagram.");
      await load(true);
    } catch {
      setError("Falha de conexão ao publicar.");
    } finally {
      setBusyId("");
    }
  };

  const removePost = async (post: SocialPostRecord) => {
    if (!window.confirm("Excluir esta publicação da agenda?")) return;
    setBusyId(post.id);
    try {
      const response = await fetch(`/api/admin/content/${post.id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) return setError(data.error ?? "Não foi possível excluir.");
      setNotice("Publicação removida.");
      await load(true);
    } finally {
      setBusyId("");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  const integrationItems = [
    ["Banco", configuration?.database],
    ["Mídia", configuration?.blob],
    ["Instagram", configuration?.instagram],
    ["Agenda", configuration?.scheduler],
  ] as const;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/"><strong>NED</strong><small>CONTEÚDO</small></a>
        <nav><a href="/admin/leads">CRM</a><a className={styles.active} href="/admin/conteudo">Conteúdo</a><a href="/" target="_blank" rel="noreferrer"><Globe2 size={14} /> Site</a></nav>
        <button type="button" onClick={logout}><LogOut size={15} /> Sair</button>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div><span>CALENDÁRIO EDITORIAL / NED</span><h1>Crie hoje.<em>Publique na hora certa.</em></h1></div>
          <p>Agende Feed, carrossel, Reels e Stories no horário de Brasília e acompanhe cada tentativa.</p>
        </section>

        <section className={styles.integrations}>
          {integrationItems.map(([label, ready]) => (
            <div className={ready ? styles.ready : styles.pending} key={label}>
              {ready ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}<strong>{label}</strong><small>{ready ? "Conectado" : "Configurar"}</small>
            </div>
          ))}
        </section>

        {notice && <div className={styles.notice}>{notice}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.metrics}>
          <article><span>AGENDADOS</span><strong>{metrics.scheduled}</strong></article>
          <article><span>RASCUNHOS</span><strong>{metrics.drafts}</strong></article>
          <article><span>PUBLICADOS</span><strong>{metrics.published}</strong></article>
          <article><span>COM FALHA</span><strong>{metrics.failed}</strong></article>
        </section>

        <div className={styles.workspace}>
          <aside className={styles.composer}>
            <h2>NOVA PUBLICAÇÃO</h2>
            <label><span>CONTA / CLIENTE</span><input value={form.accountName} onChange={(event) => setForm((current) => ({ ...current, accountName: event.target.value }))} /></label>

            <div className={styles.field}><span>FORMATO</span><div className={styles.formats}>
              {socialFormats.map((format) => <button className={form.format === format ? styles.selected : ""} type="button" onClick={() => changeFormat(format)} key={format}>{format === "reel" || format === "story" ? <Film size={15} /> : <FileImage size={15} />}{socialFormatLabels[format]}</button>)}
            </div></div>

            <div className={styles.field}><span>MÍDIA · {form.media.length}/{mediaLimit(form.format)}</span>
              <button className={styles.upload} type="button" disabled={uploading || !configuration?.blob} onClick={() => inputRef.current?.click()}>
                {uploading ? <LoaderCircle className={styles.spin} /> : <UploadCloud />}<strong>{uploading ? `Enviando ${progress}%` : "Enviar imagem ou vídeo"}</strong><small>JPEG, PNG, WEBP, MP4 ou MOV</small>
              </button>
              <input ref={inputRef} className={styles.hidden} type="file" accept={accepts(form.format)} multiple={form.format === "carousel"} onChange={(event) => void uploadFiles(event.target.files)} />
              {!!form.media.length && <div className={styles.previews}>{form.media.map((asset, index) => <div key={asset.pathname}>
                {asset.contentType.startsWith("video/") ? <video src={asset.url} muted playsInline /> : <img src={asset.url} alt={`Mídia ${index + 1}`} />}
                <button type="button" onClick={() => setForm((current) => ({ ...current, media: current.media.filter((item) => item.pathname !== asset.pathname) }))}><Trash2 size={13} /></button>
              </div>)}</div>}
            </div>

            {form.format !== "story" && <label><span>LEGENDA · {form.caption.length}/2200</span><textarea rows={6} maxLength={2200} value={form.caption} onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))} placeholder="Legenda, CTA e hashtags..." /></label>}
            {form.format === "reel" && <label className={styles.check}><input type="checkbox" checked={form.shareToFeed} onChange={(event) => setForm((current) => ({ ...current, shareToFeed: event.target.checked }))} /><span>Mostrar também no Feed</span></label>}
            <label><span>DATA E HORÁRIO · BRASÍLIA</span><input type="datetime-local" min={localMinimum()} value={form.scheduledAt} onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))} /></label>
            <div className={styles.actions}><button type="button" disabled={saving || uploading} onClick={() => void submit("draft")}>Salvar rascunho</button><button type="button" disabled={saving || uploading} onClick={() => void submit("scheduled")}><CalendarClock size={15} /> Agendar</button></div>
          </aside>

          <section className={styles.agenda}>
            <div className={styles.agendaHead}><div><span>AGENDA</span><h2>Publicações</h2></div><button type="button" onClick={() => void load()}><RefreshCcw className={loading ? styles.spin : ""} size={17} /></button></div>
            {loading ? <div className={styles.empty}><LoaderCircle className={styles.spin} /> Carregando...</div> : !posts.length ? <div className={styles.empty}><CalendarClock /> Nenhum conteúdo agendado.</div> : <div className={styles.list}>
              {posts.map((post) => <article key={post.id}>
                <div className={styles.thumb}>{post.media[0]?.contentType.startsWith("video/") ? <video src={post.media[0].url} muted playsInline /> : post.media[0] ? <img src={post.media[0].url} alt="Prévia" /> : <FileImage />}</div>
                <div className={styles.postBody}><div className={styles.meta}><span data-status={post.status}>{socialStatusLabels[post.status]}</span><small>{socialFormatLabels[post.format]}</small></div><strong>{post.accountName}</strong><p>{post.caption || "Sem legenda"}</p><div className={styles.date}><Clock3 size={13} /> {formatDate(post.scheduledAt)}</div>{post.errorMessage && <div className={styles.cardError}>{post.errorMessage}</div>}</div>
                <div className={styles.postActions}>{post.status !== "published" && post.status !== "publishing" && <><button type="button" disabled={busyId === post.id || !configuration?.instagram} onClick={() => void publishNow(post)}>{busyId === post.id ? <LoaderCircle className={styles.spin} size={14} /> : <Send size={14} />}{post.status === "failed" ? "Tentar novamente" : "Publicar agora"}</button><button type="button" onClick={() => void removePost(post)}><Trash2 size={14} /></button></>}{post.status === "published" && <span><CheckCircle2 size={14} /> Concluído</span>}</div>
              </article>)}
            </div>}
          </section>
        </div>
      </div>
    </main>
  );
}
