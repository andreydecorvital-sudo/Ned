"use client";

import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import styles from "./diagnostic-form.module.css";

const whatsappNumber = "5511917814612";
const attributionStorageKey = "ned_lead_attribution";

const serviceOptions = [
  "Marketing e conteúdo",
  "Site ou landing page",
  "Marketplaces",
  "Tráfego pago",
  "Automações",
  "Ainda não sei",
];

const urgencyOptions = [
  "Só estou pesquisando",
  "Quero começar em breve",
  "Preciso resolver com urgência",
  "Já tenho algo e quero melhorar",
];

type Answers = {
  name: string;
  company: string;
  whatsapp: string;
  business: string;
  challenge: string;
  service: string;
  urgency: string;
  consent: boolean;
  website: string;
};

type DiagnosticFormProps = {
  source?: string;
  presetService?: string;
  context?: Record<string, unknown>;
  onSubmitted?: () => void;
};

type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

const questions = [
  {
    kicker: "01 / NEGÓCIO",
    title: "O que sua empresa oferece?",
    description: "Explique de forma simples o que você vende ou qual serviço presta.",
  },
  {
    kicker: "02 / DESAFIO",
    title: "O que você quer melhorar agora?",
    description: "Pode ser vender mais, melhorar o site, organizar marketplace ou gerar contatos.",
  },
  {
    kicker: "03 / DIREÇÃO",
    title: "Qual frente parece mais próxima?",
    description: "Escolha o caminho mais parecido com sua necessidade e o momento do projeto.",
  },
  {
    kicker: "04 / CONTATO",
    title: "Onde continuamos essa conversa?",
    description: "A NED salva o diagnóstico e prepara seu WhatsApp. Você decide se envia a mensagem.",
  },
];

function initialAnswers(presetService = ""): Answers {
  return {
    name: "",
    company: "",
    whatsapp: "",
    business: "",
    challenge: "",
    service: serviceOptions.includes(presetService) ? presetService : "",
    urgency: "",
    consent: false,
    website: "",
  };
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function readAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
  };

  let stored: Partial<Attribution> = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(attributionStorageKey) ?? "{}") as Partial<Attribution>;
  } catch {
    stored = {};
  }

  const merged: Attribution = {
    utmSource: current.utmSource || stored.utmSource || "",
    utmMedium: current.utmMedium || stored.utmMedium || "",
    utmCampaign: current.utmCampaign || stored.utmCampaign || "",
    utmContent: current.utmContent || stored.utmContent || "",
    utmTerm: current.utmTerm || stored.utmTerm || "",
  };

  if (Object.values(current).some(Boolean)) {
    try {
      window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(merged));
    } catch {
      // Attribution remains available for the current submit even with restricted storage.
    }
  }

  return merged;
}

export default function DiagnosticForm({
  source = "rodape",
  presetService = "",
  context = {},
  onSubmitted,
}: DiagnosticFormProps = {}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(presetService));
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    readAttribution();
  }, []);

  const currentValid = useMemo(() => {
    if (step === 0) return Boolean(answers.business.trim());
    if (step === 1) return Boolean(answers.challenge.trim());
    if (step === 2) return Boolean(answers.service && answers.urgency);
    return (
      answers.name.trim().length >= 2 &&
      answers.company.trim().length >= 2 &&
      phoneDigits(answers.whatsapp).length >= 10 &&
      answers.consent
    );
  }, [answers, step]);

  const updateAnswer = <Key extends keyof Answers>(key: Key, value: Answers[Key]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setSubmissionError("");
  };

  const goNext = () => {
    if (!currentValid) return;
    window.dispatchEvent(
      new CustomEvent("ned:diagnostic", {
        detail: { event_name: "step_completed", source, step: step + 1 },
      }),
    );
    setStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submitDiagnostic = async () => {
    if (!currentValid || submitting) return;

    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;

    setSubmitting(true);
    setSubmissionError("");

    const attribution = readAttribution();
    const payload = {
      name: answers.name.trim(),
      company: answers.company.trim(),
      whatsapp: answers.whatsapp.trim(),
      businessType: answers.business.trim(),
      challenge: answers.challenge.trim(),
      service: answers.service,
      urgency: answers.urgency,
      source,
      pagePath: window.location.pathname,
      pageUrl: window.location.href,
      referrer: document.referrer,
      ...attribution,
      metadata: context,
      consent: answers.consent,
      website: answers.website,
    };

    let stored = false;
    let leadId = "";

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível registrar o contato.");
      stored = true;
      leadId = data.id ?? "";
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? `${error.message} O WhatsApp será aberto para você não perder o contato.`
          : "Não foi possível registrar automaticamente. O WhatsApp será aberto mesmo assim.",
      );
    }

    const contextLines = Object.entries(context)
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .slice(0, 5)
      .map(([key, value]) => `${key}: ${String(value)}`);

    const message = [
      "Olá, Ned! Preenchi o diagnóstico no site e quero conversar sobre meu projeto.",
      "",
      `Nome: ${answers.name.trim()}`,
      `Empresa: ${answers.company.trim()}`,
      `Meu negócio: ${answers.business.trim()}`,
      `O que preciso melhorar: ${answers.challenge.trim()}`,
      `Serviço que procuro: ${answers.service}`,
      `Urgência do projeto: ${answers.urgency}`,
      ...contextLines,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.dispatchEvent(
      new CustomEvent("ned:whatsapp", {
        detail: { source, service: answers.service, lead_id: leadId, lead_stored: stored },
      }),
    );

    window.dispatchEvent(
      new CustomEvent("ned:diagnostic", {
        detail: {
          event_name: "submitted",
          source,
          service: answers.service,
          project_stage: answers.urgency,
          lead_id: leadId,
          lead_stored: stored,
        },
      }),
    );

    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl;
    }

    if (stored) onSubmitted?.();
    setSubmitting(false);
  };

  return (
    <div className="diagnostic-card" data-cursor="RESPONDER">
      <div className="diagnostic-progress" aria-label={`Etapa ${step + 1} de ${questions.length}`}>
        <div className="diagnostic-progress-copy">
          <span>DIAGNÓSTICO NED</span>
          <strong>{String(step + 1).padStart(2, "0")} / 04</strong>
        </div>
        <div className="diagnostic-progress-track">
          <motion.span
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="diagnostic-question"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28 }}
        >
          <span className="diagnostic-kicker">{questions[step].kicker}</span>
          <h3>{questions[step].title}</h3>
          <p>{questions[step].description}</p>

          {step === 0 && (
            <label className="diagnostic-field">
              <span>TIPO DE NEGÓCIO</span>
              <input
                value={answers.business}
                onChange={(event) => updateAnswer("business", event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") goNext(); }}
                placeholder="Ex.: loja de roupas, clínica, restaurante..."
                maxLength={300}
              />
            </label>
          )}

          {step === 1 && (
            <label className="diagnostic-field">
              <span>PRINCIPAL DESAFIO</span>
              <textarea
                value={answers.challenge}
                onChange={(event) => updateAnswer("challenge", event.target.value)}
                placeholder="Ex.: vender mais, melhorar o site, organizar marketplace..."
                rows={4}
                maxLength={1000}
              />
            </label>
          )}

          {step === 2 && (
            <div className={styles.directionGrid}>
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>FRENTE MAIS PRÓXIMA</span>
                <div className="diagnostic-options" role="radiogroup" aria-label="Serviço desejado">
                  {serviceOptions.map((option) => (
                    <button
                      key={option}
                      className={answers.service === option ? "is-selected" : ""}
                      type="button"
                      role="radio"
                      aria-checked={answers.service === option}
                      onClick={() => updateAnswer("service", option)}
                    >
                      <span>{option}</span>
                      <Check size={17} />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>MOMENTO DO PROJETO</span>
                <div className="diagnostic-options" role="radiogroup" aria-label="Urgência do projeto">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option}
                      className={answers.urgency === option ? "is-selected" : ""}
                      type="button"
                      role="radio"
                      aria-checked={answers.urgency === option}
                      onClick={() => updateAnswer("urgency", option)}
                    >
                      <span>{option}</span>
                      <Check size={17} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className={styles.contactGrid}>
                <label>
                  <span>SEU NOME</span>
                  <input
                    value={answers.name}
                    onChange={(event) => updateAnswer("name", event.target.value)}
                    placeholder="Como podemos chamar você?"
                    maxLength={120}
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span>EMPRESA OU ATUAÇÃO</span>
                  <input
                    value={answers.company}
                    onChange={(event) => updateAnswer("company", event.target.value)}
                    placeholder="Nome da empresa ou Autônomo"
                    maxLength={160}
                    autoComplete="organization"
                  />
                </label>
                <label className={styles.contactWide}>
                  <span>WHATSAPP COM DDD</span>
                  <input
                    value={answers.whatsapp}
                    onChange={(event) => updateAnswer("whatsapp", event.target.value)}
                    placeholder="Ex.: (13) 99999-9999"
                    maxLength={24}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </label>
                <label className={styles.honeypot} aria-hidden="true">
                  Site
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={answers.website}
                    onChange={(event) => updateAnswer("website", event.target.value)}
                  />
                </label>
              </div>

              <label className={styles.consent}>
                <input
                  type="checkbox"
                  checked={answers.consent}
                  onChange={(event) => updateAnswer("consent", event.target.checked)}
                />
                <span>
                  Autorizo a NED a armazenar estes dados e entrar em contato exclusivamente para responder sobre meu projeto.
                </span>
              </label>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {submissionError && <div className={styles.error}>{submissionError}</div>}

      <div className="diagnostic-controls">
        <button className="diagnostic-back" type="button" onClick={goBack} disabled={step === 0 || submitting}>
          <ArrowLeft size={17} /> Voltar
        </button>

        {step < questions.length - 1 ? (
          <button className="diagnostic-next" type="button" onClick={goNext} disabled={!currentValid || submitting}>
            Continuar <ArrowRight size={17} />
          </button>
        ) : (
          <button
            className="diagnostic-next diagnostic-submit"
            type="button"
            onClick={() => void submitDiagnostic()}
            disabled={!currentValid || submitting}
          >
            <MessageCircle size={18} />
            {submitting ? "Registrando..." : "Registrar e abrir WhatsApp"}
          </button>
        )}
      </div>
    </div>
  );
}
