"use client";

import { upload } from "@vercel/blob/client";
import {
  CalendarClock,
  CheckCircle2,
  FileImage,
  Film,
  Globe2,
  LoaderCircle,
  LogOut,
  Trash2,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  socialFormatLabels,
  socialFormats,
  type InstagramAudioSearchResult,
  type SocialAudioType,
  type SocialFormat,
  type SocialMediaAsset,
  type SocialPostRecord,
} from "@/lib/social-types";
import ContentAgenda from "./content-agenda";
import ContentAudioPanel from "./content-audio-panel";
import ContentEngagementPanel from "./content-engagement-panel";
import {
  accepts,
  buildReadiness,
  collaboratorList,
  compatible,
  emptyForm,
  localMinimum,
  mediaLimit,
  type ApiResponse,
  type Configuration,
  type FormState,
} from "./content-studio-types";
import styles from "./content-dashboard.module.css";
import studio from "./content-studio.module.css";

export default function ContentDashboardV2() {
  const inputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<SocialPostRecord[]>([]);
  const [configuration, setConfiguration] = useState<Configuration>();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [audioType, setAudioType] = useState<SocialAudioType>("music");
  const [audioQuery, setAudioQuery] = useState("");
  const [audioResults, setAudioResults] = useState<InstagramAudioSearchResult[]>([]);
  const [audioLoading, setAudioLoading] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = (await response.json()) as ApiResponse;
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok) {
        setError(data.error ?? "Não foi possível carregar a agenda.");
        return;
      }
      setPosts(data.posts ?? []);
      setConfiguration(data.configuration);
    } catch {
      setError("Falha de conexão ao carregar a agenda.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(
    () => ({
      scheduled: posts.filter((post) => post.status === "scheduled").length,
      drafts: posts.filter((post) => post.status === "draft").length,
      published: posts.filter((post) => post.status === "published").length,
      failed: posts.filter((post) => post.status === "failed").length,
    }),
    [posts],
  );

  const collaborators = useMemo(
    () => collaboratorList(form.collaborators),
    [form.collaborators],
  );
  const readiness = useMemo(
    () => buildReadiness(form, collaborators.length),
    [collaborators.length, form],
  );

  const changeFormat = (format: SocialFormat) => {
    setForm((current) => ({
      ...current,
      format,
      media: current.media
        .filter((asset) => compatible(format, asset.contentType))
        .slice(0, mediaLimit(format)),
      audio: format === "reel" ? current.audio : null,
      audioName: format === "reel" ? current.audioName : "",
      coverUrl: format === "reel" ? current.coverUrl : "",
    }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length || uploading) return;
    if (!configuration?.blob) {
      setError("Configure BLOB_READ_WRITE_TOKEN para enviar mídia.");
      return;
    }

    const selected = Array.from(files).slice(
      0,
      mediaLimit(form.format) - form.media.length,
    );
    if (!selected.length) {
      setError("O limite de mídia deste formato já foi atingido.");
      return;
    }
    const invalid = selected.find((file) => !compatible(form.format, file.type));
    if (invalid) {
      setError(`${invalid.name} não é compatível com ${socialFormatLabels[form.format]}.`);
      return;
    }

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
            setProgress(
              Math.round(((index + percentage / 100) / selected.length) * 100),
            ),
        });
        assets.push({
          url: blob.url,
          pathname: blob.pathname,
          contentType: file.type,
          size: file.size,
        });
      }
      setForm((current) => ({ ...current, media: [...current.media, ...assets] }));
      setNotice("Mídia enviada com sucesso.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Falha no envio da mídia.",
      );
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file || coverUploading) return;
    if (!configuration?.blob) {
      setError("Configure BLOB_READ_WRITE_TOKEN para enviar a capa.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("A capa precisa ser uma imagem.");
      return;
    }

    setCoverUploading(true);
    setError("");
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const blob = await upload(`ned-social/covers/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/content/upload",
      });
      setForm((current) => ({ ...current, coverUrl: blob.url }));
      setNotice("Capa do Reel enviada.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Falha no envio da capa.",
      );
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const searchAudio = async (query = audioQuery) => {
    if (!configuration?.audio) {
      setError("Conecte o Instagram pelo Facebook Login para buscar músicas e áudios.");
      return;
    }

    setAudioLoading(true);
    setError("");
    setNotice("");
    try {
      const params = new URLSearchParams({ type: audioType });
      if (query.trim()) params.set("q", query.trim());
      const response = await fetch(`/api/admin/content/audio?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        audio?: InstagramAudioSearchResult[];
        error?: string;
      };
      if (response.status === 401) return window.location.assign("/admin/login");
      if (!response.ok) {
        setError(data.error ?? "Não foi possível buscar áudio.");
        return;
      }
      setAudioResults(data.audio ?? []);
      if (!data.audio?.length) setNotice("Nenhum áudio encontrado para essa busca.");
    } catch {
      setError("Falha de conexão ao buscar áudio.");
    } finally {
      setAudioLoading(false);
    }
  };

  const selectAudio = (audio: InstagramAudioSearchResult) => {
    setForm((current) => ({
      ...current,
      audio: {
        id: audio.id,
        title: audio.title,
        artist: audio.artist,
        type: audio.type,
        thumbnailUrl: audio.thumbnailUrl,
        previewUrl: audio.previewUrl,
        musicVolume: 80,
        originalAudioVolume: 35,
      },
      audioName: "",
    }));
  };

  const submit = async (status: "draft" | "scheduled") => {
    setError("");
    setNotice("");
    if (!form.media.length) {
      setError("Adicione pelo menos uma imagem ou vídeo.");
      return;
    }
    if (form.format === "carousel" && form.media.length < 2) {
      setError("Carrossel precisa de pelo menos duas mídias.");
      return;
    }
    if (status === "scheduled" && !form.scheduledAt) {
      setError("Escolha data e horário.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          collaborators,
          status,
          scheduledAt: form.scheduledAt
            ? new Date(form.scheduledAt).toISOString()
            : null,
        }),
      });
      const data = (await response.json()) as {
        post?: SocialPostRecord;
        warning?: string;
        error?: string;
      };
      if (!response.ok || !data.post) {
        setError(data.error ?? "Não foi possível salvar.");
        return;
      }
      setForm(emptyForm);
      setAudioResults([]);
      setNotice(
        data.warning ||
          (status === "scheduled" ? "Publicação agendada." : "Rascunho salvo."),
      );
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
      const response = await fetch(`/api/admin/content/${post.id}/publish`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        post?: SocialPostRecord;
        error?: string;
      };
      if (!response.ok || !data.post) {
        await load(true);
        setError(data.error ?? "A publicação falhou.");
        return;
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
      const response = await fetch(`/api/admin/content/${post.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Não foi possível excluir.");
        return;
      }
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
    ["Música", configuration?.audio],
    ["Agenda", configuration?.scheduler],
  ] as const;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <strong>NED</strong><small>CONTEÚDO</small>
        </a>
        <nav>
          <a href="/admin/leads">CRM</a>
          <a className={styles.active} href="/admin/conteudo">Conteúdo</a>
          <a href="/" target="_blank" rel="noreferrer"><Globe2 size={14} /> Site</a>
        </nav>
        <button type="button" onClick={logout}><LogOut size={15} /> Sair</button>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <span>ESTÚDIO DE CONTEÚDO / NED</span>
            <h1>Crie para parar.<em>Publique para engajar.</em></h1>
          </div>
          <p>
            Música, capa, colaboradores, primeiro comentário e um checklist antes de cada
            publicação — além do agendamento no horário de Brasília.
          </p>
        </section>

        <section className={`${styles.integrations} ${studio.integrationsFive}`}>
          {integrationItems.map(([label, ready]) => (
            <div className={ready ? styles.ready : styles.pending} key={label}>
              {ready ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}
              <strong>{label}</strong>
              <small>{ready ? "Conectado" : "Configurar"}</small>
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
            <label>
              <span>CONTA / CLIENTE</span>
              <input
                value={form.accountName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, accountName: event.target.value }))
                }
              />
            </label>

            <div className={styles.field}>
              <span>FORMATO</span>
              <div className={styles.formats}>
                {socialFormats.map((format) => (
                  <button
                    className={form.format === format ? styles.selected : ""}
                    type="button"
                    onClick={() => changeFormat(format)}
                    key={format}
                  >
                    {format === "reel" || format === "story" ? (
                      <Film size={15} />
                    ) : (
                      <FileImage size={15} />
                    )}
                    {socialFormatLabels[format]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span>MÍDIA · {form.media.length}/{mediaLimit(form.format)}</span>
              <button
                className={styles.upload}
                type="button"
                disabled={uploading || !configuration?.blob}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? <LoaderCircle className={styles.spin} /> : <UploadCloud />}
                <strong>
                  {uploading ? `Enviando ${progress}%` : "Enviar imagem ou vídeo"}
                </strong>
                <small>JPEG, PNG, WEBP, MP4 ou MOV</small>
              </button>
              <input
                ref={inputRef}
                className={styles.hidden}
                type="file"
                accept={accepts(form.format)}
                multiple={form.format === "carousel"}
                onChange={(event) => void uploadFiles(event.target.files)}
              />
              {!!form.media.length && (
                <div className={styles.previews}>
                  {form.media.map((asset, index) => (
                    <div key={asset.pathname}>
                      {asset.contentType.startsWith("video/") ? (
                        <video src={asset.url} muted playsInline />
                      ) : (
                        <img src={asset.url} alt={`Mídia ${index + 1}`} />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            media: current.media.filter(
                              (item) => item.pathname !== asset.pathname,
                            ),
                          }))
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ContentAudioPanel
              configuration={configuration}
              form={form}
              setForm={setForm}
              audioType={audioType}
              setAudioType={setAudioType}
              audioQuery={audioQuery}
              setAudioQuery={setAudioQuery}
              audioResults={audioResults}
              setAudioResults={setAudioResults}
              audioLoading={audioLoading}
              searchAudio={searchAudio}
              selectAudio={selectAudio}
              coverUploading={coverUploading}
              coverInputRef={coverInputRef}
              uploadCover={uploadCover}
            />

            {form.format !== "story" && (
              <label>
                <span>LEGENDA · {form.caption.length}/2200</span>
                <textarea
                  rows={6}
                  maxLength={2200}
                  value={form.caption}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, caption: event.target.value }))
                  }
                  placeholder="Gancho, contexto, CTA e de 3 a 8 hashtags relevantes..."
                />
              </label>
            )}

            <ContentEngagementPanel
              form={form}
              setForm={setForm}
              readiness={readiness}
            />

            <label>
              <span>DATA E HORÁRIO · BRASÍLIA</span>
              <input
                type="datetime-local"
                min={localMinimum()}
                value={form.scheduledAt}
                onChange={(event) =>
                  setForm((current) => ({ ...current, scheduledAt: event.target.value }))
                }
              />
            </label>

            <div className={styles.actions}>
              <button
                type="button"
                disabled={saving || uploading || coverUploading}
                onClick={() => void submit("draft")}
              >
                Salvar rascunho
              </button>
              <button
                type="button"
                disabled={saving || uploading || coverUploading}
                onClick={() => void submit("scheduled")}
              >
                <CalendarClock size={15} /> Agendar
              </button>
            </div>
          </aside>

          <ContentAgenda
            posts={posts}
            loading={loading}
            busyId={busyId}
            configuration={configuration}
            load={load}
            publishNow={publishNow}
            removePost={removePost}
          />
        </div>
      </div>
    </main>
  );
}
