"use client";

import {
  Check,
  ImagePlus,
  LoaderCircle,
  Music2,
  Search,
  Sparkles,
  Trash2,
  TriangleAlert,
  Volume2,
  X,
} from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type {
  InstagramAudioSearchResult,
  SocialAudioType,
} from "@/lib/social-types";
import type { Configuration, FormState } from "./content-studio-types";
import base from "./content-dashboard.module.css";
import studio from "./content-studio.module.css";

type Props = {
  configuration?: Configuration;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  audioType: SocialAudioType;
  setAudioType: Dispatch<SetStateAction<SocialAudioType>>;
  audioQuery: string;
  setAudioQuery: Dispatch<SetStateAction<string>>;
  audioResults: InstagramAudioSearchResult[];
  setAudioResults: Dispatch<SetStateAction<InstagramAudioSearchResult[]>>;
  audioLoading: boolean;
  searchAudio: (query?: string) => Promise<void>;
  selectAudio: (audio: InstagramAudioSearchResult) => void;
  coverUploading: boolean;
  coverInputRef: RefObject<HTMLInputElement | null>;
  uploadCover: (file: File | undefined) => Promise<void>;
};

export default function ContentAudioPanel({
  configuration,
  form,
  setForm,
  audioType,
  setAudioType,
  audioQuery,
  setAudioQuery,
  audioResults,
  setAudioResults,
  audioLoading,
  searchAudio,
  selectAudio,
  coverUploading,
  coverInputRef,
  uploadCover,
}: Props) {
  if (form.format !== "reel") {
    return (
      <div className={studio.musicLimitation}>
        <Music2 size={17} />
        <div>
          <strong>Música neste formato</strong>
          <p>
            A biblioteca automática da Meta está disponível para Reels. Em Story de vídeo,
            envie o arquivo já com trilha; em Feed e carrossel, adicione a música pelo
            aplicativo do Instagram antes da publicação final.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={studio.audioStudio}>
      <div className={studio.sectionTitle}>
        <div><Music2 size={17} /><strong>MÚSICA E ÁUDIO</strong></div>
        <small>Instagram Audio API</small>
      </div>

      {!configuration?.audio && (
        <div className={studio.inlineWarning}>
          <TriangleAlert size={15} /> Conecte a conta pelo Facebook Login para buscar áudio
          em alta e músicas royalty-free.
        </div>
      )}

      <div className={studio.audioTabs}>
        <button
          className={audioType === "music" ? studio.selected : ""}
          type="button"
          onClick={() => {
            setAudioType("music");
            setAudioResults([]);
          }}
        >
          Músicas
        </button>
        <button
          className={audioType === "original_sound" ? studio.selected : ""}
          type="button"
          onClick={() => {
            setAudioType("original_sound");
            setAudioResults([]);
          }}
        >
          Sons originais
        </button>
      </div>

      <div className={studio.audioSearch}>
        <Search size={15} />
        <input
          value={audioQuery}
          onChange={(event) => setAudioQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void searchAudio();
          }}
          placeholder="Buscar música, artista ou som"
        />
        <button type="button" disabled={audioLoading} onClick={() => void searchAudio()}>
          {audioLoading ? <LoaderCircle className={base.spin} size={15} /> : "Buscar"}
        </button>
      </div>

      <button
        className={studio.trendingButton}
        type="button"
        disabled={audioLoading}
        onClick={() => {
          setAudioQuery("");
          void searchAudio("");
        }}
      >
        <Sparkles size={14} /> Ver áudios em alta
      </button>

      {!!audioResults.length && (
        <div className={studio.audioResults}>
          {audioResults.map((audio) => (
            <button
              type="button"
              className={form.audio?.id === audio.id ? studio.audioSelected : ""}
              onClick={() => selectAudio(audio)}
              key={audio.id}
            >
              <span className={studio.audioCover}>
                {audio.thumbnailUrl ? (
                  <img src={audio.thumbnailUrl} alt="" />
                ) : (
                  <Music2 size={17} />
                )}
              </span>
              <span>
                <strong>{audio.title}</strong>
                <small>
                  {audio.artist ||
                    (audio.type === "music" ? "Sound Collection" : "Som original")}
                </small>
              </span>
              {form.audio?.id === audio.id ? <Check size={15} /> : null}
            </button>
          ))}
        </div>
      )}

      {form.audio ? (
        <div className={studio.selectedAudio}>
          <div className={studio.selectedAudioHead}>
            <div>
              <Music2 size={16} />
              <span>
                <strong>{form.audio.title}</strong>
                <small>{form.audio.artist || "Áudio selecionado"}</small>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, audio: null }))}
            >
              <X size={14} />
            </button>
          </div>
          {form.audio.previewUrl && (
            <audio controls preload="none" src={form.audio.previewUrl} />
          )}
          <label className={studio.rangeField}>
            <span><Volume2 size={14} /> Música <strong>{form.audio.musicVolume}%</strong></span>
            <input
              type="range"
              min="0"
              max="100"
              value={form.audio.musicVolume}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  audio: current.audio
                    ? { ...current.audio, musicVolume: Number(event.target.value) }
                    : null,
                }))
              }
            />
          </label>
          <label className={studio.rangeField}>
            <span>
              <Volume2 size={14} /> Áudio do vídeo
              <strong>{form.audio.originalAudioVolume}%</strong>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={form.audio.originalAudioVolume}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  audio: current.audio
                    ? {
                        ...current.audio,
                        originalAudioVolume: Number(event.target.value),
                      }
                    : null,
                }))
              }
            />
          </label>
        </div>
      ) : (
        <label>
          <span>NOME DO ÁUDIO ORIGINAL</span>
          <input
            value={form.audioName}
            maxLength={120}
            onChange={(event) =>
              setForm((current) => ({ ...current, audioName: event.target.value }))
            }
            placeholder="Ex.: Som original — NED Marketing"
          />
        </label>
      )}

      <div className={studio.coverPicker}>
        <span>CAPA DO REEL</span>
        {form.coverUrl ? (
          <div className={studio.coverPreview}>
            <img src={form.coverUrl} alt="Capa selecionada" />
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, coverUrl: "" }))}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={coverUploading || !configuration?.blob}
            onClick={() => coverInputRef.current?.click()}
          >
            {coverUploading ? <LoaderCircle className={base.spin} /> : <ImagePlus />}
            <strong>{coverUploading ? "Enviando capa..." : "Adicionar capa vertical"}</strong>
          </button>
        )}
        <input
          ref={coverInputRef}
          className={base.hidden}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => void uploadCover(event.target.files?.[0])}
        />
      </div>
    </section>
  );
}
