"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileImage,
  LoaderCircle,
  Music2,
  RefreshCcw,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import type { SocialPostRecord } from "@/lib/social-types";
import { socialFormatLabels, socialStatusLabels } from "@/lib/social-types";
import type { Configuration } from "./content-studio-types";
import { audioLabel, formatDate } from "./content-studio-types";
import base from "./content-dashboard.module.css";
import studio from "./content-studio.module.css";

type Props = {
  posts: SocialPostRecord[];
  loading: boolean;
  busyId: string;
  configuration?: Configuration;
  load: (silent?: boolean) => Promise<void>;
  publishNow: (post: SocialPostRecord) => Promise<void>;
  removePost: (post: SocialPostRecord) => Promise<void>;
};

export default function ContentAgenda({
  posts,
  loading,
  busyId,
  configuration,
  load,
  publishNow,
  removePost,
}: Props) {
  return (
    <section className={base.agenda}>
      <div className={base.agendaHead}>
        <div><span>AGENDA</span><h2>Publicações</h2></div>
        <button type="button" onClick={() => void load()}>
          <RefreshCcw className={loading ? base.spin : ""} size={17} />
        </button>
      </div>

      {loading ? (
        <div className={base.empty}><LoaderCircle className={base.spin} /> Carregando...</div>
      ) : !posts.length ? (
        <div className={base.empty}><CalendarClock /> Nenhum conteúdo agendado.</div>
      ) : (
        <div className={base.list}>
          {posts.map((post) => (
            <article key={post.id}>
              <div className={base.thumb}>
                {post.media[0]?.contentType.startsWith("video/") ? (
                  <video src={post.media[0].url} muted playsInline />
                ) : post.media[0] ? (
                  <img src={post.media[0].url} alt="Prévia" />
                ) : (
                  <FileImage />
                )}
              </div>

              <div className={base.postBody}>
                <div className={base.meta}>
                  <span data-status={post.status}>{socialStatusLabels[post.status]}</span>
                  <small>{socialFormatLabels[post.format]}</small>
                  {post.audio && (
                    <small className={studio.audioBadge}><Music2 size={11} /> Música</small>
                  )}
                  {!!post.collaborators.length && (
                    <small className={studio.audioBadge}>
                      <Users size={11} /> {post.collaborators.length}
                    </small>
                  )}
                </div>
                <strong>{post.accountName}</strong>
                <p>{post.caption || "Sem legenda"}</p>
                {post.format === "reel" && (
                  <div className={studio.audioLine}>
                    <Music2 size={12} /> {audioLabel(post.audio)}
                  </div>
                )}
                <div className={base.date}>
                  <Clock3 size={13} /> {formatDate(post.scheduledAt)}
                </div>
                {post.errorMessage && <div className={base.cardError}>{post.errorMessage}</div>}
              </div>

              <div className={base.postActions}>
                {post.status !== "published" && post.status !== "publishing" && (
                  <>
                    <button
                      type="button"
                      disabled={busyId === post.id || !configuration?.instagram}
                      onClick={() => void publishNow(post)}
                    >
                      {busyId === post.id ? (
                        <LoaderCircle className={base.spin} size={14} />
                      ) : (
                        <Send size={14} />
                      )}
                      {post.status === "failed" ? "Tentar novamente" : "Publicar agora"}
                    </button>
                    <button type="button" onClick={() => void removePost(post)}>
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
                {post.status === "published" && (
                  <span><CheckCircle2 size={14} /> Concluído</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
