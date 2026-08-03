"use client";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "../commercial.module.css";

const whatsappNumber = "5511917814612";

type Variant = "analysis" | "partner";

type FormState = {
  name: string;
  company: string;
  whatsapp: string;
  primaryUrl: string;
  challenge: string;
  urgency: string;
  role: string;
  audience: string;
  partnership: string;
  consent: boolean;
  website: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  whatsapp: "",
  primaryUrl: "",
  challenge: "",
  urgency: "Quero receber uma análise inicial",
  role: "",
  audience: "",
  partnership: "Indicação de projetos",
  consent: false,
  website: "",
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function attribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
  };
}

export default function CommercialLeadForm({ variant }: { variant: Variant }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const valid = useMemo(() => {
    const common =
      form.name.trim().length >= 2 &&
      form.company.trim().length >= 2 &&
      digits(form.whatsapp).length >= 10 &&
      form.consent;

    if (!common) return false;
    if (variant === "analysis") {
      return form.primaryUrl.trim().length >= 5 && form.challenge.trim().length >= 10;
    }
    return form.role.trim().length >= 2 && form.audience.trim().length >= 10;
  }, [form, variant]);

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError("");

    const isAnalysis = variant === "analysis";
    const challenge = isAnalysis
      ? `${form.challenge.trim()} | Link enviado: ${form.primaryUrl.trim()}`
      : `${form.role.trim()} | Público/atuação: ${form.audience.trim()} | Modelo: ${form.partnership}`;
    const service = isAnalysis ? "Análise gratuita" : "Parceria e indicações";
    const source = isAnalysis ? "analise_gratuita" : "parceiros";

    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      whatsapp: form.whatsapp.trim(),
      businessType: isAnalysis ? `Negócio em análise: ${form.primaryUrl.trim()}` : form.role.trim(),
      challenge,
      service,
      urgency: isAnalysis ? form.urgency : "Quero conversar sobre parceria",
      source,
      pagePath: window.location.pathname,
      pageUrl: window.location.href,
      referrer: document.referrer,
      ...attribution(),
      metadata: isAnalysis
        ? { submitted_url: form.primaryUrl.trim(), capture_product: "analise_gratuita" }
        : { partner_role: form.role.trim(), partner_audience: form.audience.trim(), partnership_model: form.partnership },
      consent: form.consent,
      website: form.website,
    };

    let stored = false;
    let leadId = "";

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível registrar seus dados.");
      stored = true;
      leadId = data.id ?? "";
      setSuccess(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? `${submissionError.message} Você ainda pode continuar pelo WhatsApp.`
          : "Não foi possível registrar agora. Continue pelo WhatsApp.",
      );
    }

    const message = isAnalysis
      ? [
          "Olá, Ned! Solicitei uma análise gratuita pelo site.",
          `Nome: ${form.name.trim()}`,
          `Empresa: ${form.company.trim()}`,
          `Link: ${form.primaryUrl.trim()}`,
          `Principal dificuldade: ${form.challenge.trim()}`,
          `Momento: ${form.urgency}`,
        ].join("\n")
      : [
          "Olá, Ned! Quero conversar sobre o programa de parceiros.",
          `Nome: ${form.name.trim()}`,
          `Empresa/Marca: ${form.company.trim()}`,
          `Atuação: ${form.role.trim()}`,
          `Público: ${form.audience.trim()}`,
          `Interesse: ${form.partnership}`,
        ].join("\n");

    window.dispatchEvent(
      new CustomEvent("ned:commercial_capture", {
        detail: { source, service, lead_id: leadId, lead_stored: stored },
      }),
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitting(false);
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formGrid}>
        <div className={styles.formGrid2}>
          <label className={styles.field}>
            <span>SEU NOME</span>
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Como podemos chamar você?"
              autoComplete="name"
              maxLength={120}
            />
          </label>
          <label className={styles.field}>
            <span>{variant === "analysis" ? "EMPRESA" : "EMPRESA OU MARCA"}</span>
            <input
              value={form.company}
              onChange={(event) => update("company", event.target.value)}
              placeholder="Nome do negócio"
              autoComplete="organization"
              maxLength={160}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>WHATSAPP COM DDD</span>
          <input
            value={form.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
            placeholder="Ex.: (13) 99999-9999"
            autoComplete="tel"
            inputMode="tel"
            maxLength={24}
          />
        </label>

        {variant === "analysis" ? (
          <>
            <label className={styles.field}>
              <span>LINK PRINCIPAL</span>
              <input
                value={form.primaryUrl}
                onChange={(event) => update("primaryUrl", event.target.value)}
                placeholder="Site, Instagram, Google ou marketplace"
                inputMode="url"
                maxLength={700}
              />
            </label>
            <label className={styles.field}>
              <span>O QUE MAIS TE INCOMODA HOJE?</span>
              <textarea
                value={form.challenge}
                onChange={(event) => update("challenge", event.target.value)}
                placeholder="Ex.: recebo visitas, mas poucos contatos; o atendimento está desorganizado..."
                maxLength={1000}
              />
            </label>
            <label className={styles.field}>
              <span>MOMENTO</span>
              <select value={form.urgency} onChange={(event) => update("urgency", event.target.value)}>
                <option>Quero receber uma análise inicial</option>
                <option>Quero começar em breve</option>
                <option>Preciso resolver com urgência</option>
                <option>Só estou pesquisando</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label className={styles.field}>
              <span>SUA ATUAÇÃO</span>
              <input
                value={form.role}
                onChange={(event) => update("role", event.target.value)}
                placeholder="Ex.: social media, contador, designer, consultor..."
                maxLength={220}
              />
            </label>
            <label className={styles.field}>
              <span>QUE TIPO DE CLIENTE VOCÊ ATENDE?</span>
              <textarea
                value={form.audience}
                onChange={(event) => update("audience", event.target.value)}
                placeholder="Conte brevemente quais empresas ou profissionais fazem parte da sua rede."
                maxLength={1000}
              />
            </label>
            <label className={styles.field}>
              <span>INTERESSE PRINCIPAL</span>
              <select value={form.partnership} onChange={(event) => update("partnership", event.target.value)}>
                <option>Indicação de projetos</option>
                <option>Execução em parceria</option>
                <option>Terceirização técnica</option>
                <option>Quero entender as possibilidades</option>
              </select>
            </label>
          </>
        )}

        <label className={styles.honeypot} aria-hidden="true">
          Site
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </label>

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
          />
          <span>
            Autorizo a NED a armazenar estes dados e entrar em contato sobre esta solicitação. Consulte a <a href="/privacidade">política de privacidade</a>.
          </span>
        </label>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            <CheckCircle2 size={15} /> Solicitação registrada no CRM. O WhatsApp foi aberto para continuar a conversa.
          </div>
        )}

        <button className={styles.submit} type="button" disabled={!valid || submitting} onClick={() => void submit()}>
          {variant === "analysis" ? <MessageCircle size={17} /> : <ArrowRight size={17} />}
          {submitting
            ? "Registrando..."
            : variant === "analysis"
              ? "Registrar e solicitar análise"
              : "Quero conversar sobre parceria"}
        </button>
      </div>
    </div>
  );
}
