"use client";

import { Check, MessageCircle, Sparkles, Users } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { FormState } from "./content-studio-types";
import base from "./content-dashboard.module.css";
import studio from "./content-studio.module.css";

type Readiness = {
  score: number;
  checks: Array<{ label: string; ready: boolean; points: number }>;
};

type Props = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  readiness: Readiness;
};

export default function ContentEngagementPanel({ form, setForm, readiness }: Props) {
  return (
    <>
      <section className={studio.engagementPanel}>
        <div className={studio.sectionTitle}>
          <div><Sparkles size={17} /><strong>IMPULSO DE ENGAJAMENTO</strong></div>
          <small>Antes de publicar</small>
        </div>

        <label>
          <span><Users size={13} /> COLABORADORES · ATÉ 3</span>
          <input
            value={form.collaborators}
            onChange={(event) =>
              setForm((current) => ({ ...current, collaborators: event.target.value }))
            }
            placeholder="usuario1, usuario2"
          />
          <small>O convite de colaboração amplia a distribuição quando for aceito.</small>
        </label>

        {form.format !== "story" && (
          <label>
            <span><MessageCircle size={13} /> PRIMEIRO COMENTÁRIO</span>
            <textarea
              rows={3}
              maxLength={2200}
              value={form.firstComment}
              onChange={(event) =>
                setForm((current) => ({ ...current, firstComment: event.target.value }))
              }
              placeholder="Pergunta, CTA adicional ou hashtags complementares..."
            />
          </label>
        )}

        {form.format !== "story" && (
          <label>
            <span>TEXTO ALTERNATIVO</span>
            <input
              value={form.altText}
              maxLength={1000}
              onChange={(event) =>
                setForm((current) => ({ ...current, altText: event.target.value }))
              }
              placeholder="Descreva a imagem ou o conteúdo para acessibilidade e contexto"
            />
          </label>
        )}

        {form.format !== "story" && (
          <label>
            <span>ID DA LOCALIZAÇÃO · OPCIONAL</span>
            <input
              inputMode="numeric"
              value={form.locationId}
              onChange={(event) =>
                setForm((current) => ({ ...current, locationId: event.target.value }))
              }
              placeholder="ID da localização no Instagram"
            />
          </label>
        )}

        {form.format === "reel" && (
          <label className={base.check}>
            <input
              type="checkbox"
              checked={form.shareToFeed}
              onChange={(event) =>
                setForm((current) => ({ ...current, shareToFeed: event.target.checked }))
              }
            />
            <span>Mostrar também no Feed</span>
          </label>
        )}

        <label className={base.check}>
          <input
            type="checkbox"
            checked={form.isAiGenerated}
            onChange={(event) =>
              setForm((current) => ({ ...current, isAiGenerated: event.target.checked }))
            }
          />
          <span>Marcar como conteúdo gerado por IA</span>
        </label>
      </section>

      <section className={studio.readiness}>
        <div className={studio.readinessHead}>
          <div><Sparkles size={16} /><strong>PREPARAÇÃO DO POST</strong></div>
          <span data-score={readiness.score >= 70 ? "good" : "attention"}>
            {readiness.score}/100
          </span>
        </div>
        <div className={studio.scoreTrack}>
          <span style={{ width: `${readiness.score}%` }} />
        </div>
        <div className={studio.checklist}>
          {readiness.checks.map((item) => (
            <span className={item.ready ? studio.checkReady : ""} key={item.label}>
              {item.ready ? <Check size={12} /> : <span />}
              {item.label}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
