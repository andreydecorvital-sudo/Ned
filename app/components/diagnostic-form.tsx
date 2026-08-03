"use client";

import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const whatsappNumber = "5511917814612";

const serviceOptions = [
  "Site ou landing page",
  "Marketplaces",
  "Automações",
  "Tráfego pago",
  "Ainda não sei",
];

const stageOptions = [
  "Só estou pesquisando",
  "Quero começar em breve",
  "Preciso resolver com urgência",
  "Já tenho algo e quero melhorar",
];

type Answers = {
  business: string;
  challenge: string;
  service: string;
  stage: string;
};

type DiagnosticFormProps = {
  source?: string;
  onSubmitted?: () => void;
};

const initialAnswers: Answers = {
  business: "",
  challenge: "",
  service: "",
  stage: "",
};

const questions = [
  {
    kicker: "01 / NEGÓCIO",
    title: "Qual é o seu negócio?",
    description: "Conte de forma simples o que sua empresa vende ou oferece.",
  },
  {
    kicker: "02 / DESAFIO",
    title: "O que precisa melhorar?",
    description: "Qual é o principal problema ou oportunidade que você enxerga hoje?",
  },
  {
    kicker: "03 / SERVIÇO",
    title: "Qual serviço procura?",
    description: "Escolha o caminho mais próximo do que você precisa agora.",
  },
  {
    kicker: "04 / MOMENTO",
    title: "Em que momento está o projeto?",
    description: "Isso ajuda a Ned a preparar uma conversa mais objetiva.",
  },
];

export default function DiagnosticForm({
  source = "diagnostico",
  onSubmitted,
}: DiagnosticFormProps = {}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const currentValue = useMemo(() => {
    if (step === 0) return answers.business.trim();
    if (step === 1) return answers.challenge.trim();
    if (step === 2) return answers.service;
    return answers.stage;
  }, [answers, step]);

  const updateAnswer = (key: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => {
    if (!currentValue) return;
    setStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const submitDiagnostic = () => {
    if (!currentValue) return;

    const message = [
      "Olá, Ned! Preenchi o diagnóstico no site e quero conversar sobre meu projeto.",
      "",
      `Meu negócio: ${answers.business.trim()}`,
      `O que preciso melhorar: ${answers.challenge.trim()}`,
      `Serviço que procuro: ${answers.service}`,
      `Momento do projeto: ${answers.stage}`,
    ].join("\n");

    window.dispatchEvent(
      new CustomEvent("ned:whatsapp", {
        detail: { source, service: answers.service },
      }),
    );

    window.dispatchEvent(
      new CustomEvent("ned:diagnostic", {
        detail: {
          event_name: "submitted",
          source,
          service: answers.service,
          project_stage: answers.stage,
        },
      }),
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );

    onSubmitted?.();
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
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.35 }}
        >
          <span className="diagnostic-kicker">{questions[step].kicker}</span>
          <h3>{questions[step].title}</h3>
          <p>{questions[step].description}</p>

          {step === 0 && (
            <label className="diagnostic-field">
              <span>SEU NEGÓCIO</span>
              <input
                autoFocus
                value={answers.business}
                onChange={(event) => updateAnswer("business", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") goNext();
                }}
                placeholder="Ex.: loja de roupas, clínica, restaurante..."
                maxLength={120}
              />
            </label>
          )}

          {step === 1 && (
            <label className="diagnostic-field">
              <span>PRINCIPAL DESAFIO</span>
              <textarea
                autoFocus
                value={answers.challenge}
                onChange={(event) => updateAnswer("challenge", event.target.value)}
                placeholder="Ex.: organizar catálogo, vender mais, automatizar atendimento..."
                rows={4}
                maxLength={320}
              />
            </label>
          )}

          {step === 2 && (
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
          )}

          {step === 3 && (
            <div className="diagnostic-options" role="radiogroup" aria-label="Momento do projeto">
              {stageOptions.map((option) => (
                <button
                  key={option}
                  className={answers.stage === option ? "is-selected" : ""}
                  type="button"
                  role="radio"
                  aria-checked={answers.stage === option}
                  onClick={() => updateAnswer("stage", option)}
                >
                  <span>{option}</span>
                  <Check size={17} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="diagnostic-controls">
        <button className="diagnostic-back" type="button" onClick={goBack} disabled={step === 0}>
          <ArrowLeft size={17} /> Voltar
        </button>

        {step < questions.length - 1 ? (
          <button className="diagnostic-next" type="button" onClick={goNext} disabled={!currentValue}>
            Continuar <ArrowRight size={17} />
          </button>
        ) : (
          <button className="diagnostic-next diagnostic-submit" type="button" onClick={submitDiagnostic} disabled={!currentValue}>
            <MessageCircle size={18} /> Enviar para o WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
