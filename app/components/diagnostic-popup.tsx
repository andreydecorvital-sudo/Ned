"use client";

import { ArrowRight, Clock3, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DiagnosticForm from "./diagnostic-form";
import styles from "./diagnostic-popup.module.css";

const popupStorageKey = "ned_diagnostic_popup_seen";
const popupDelay = 5000;

type CloseReason = "backdrop" | "button" | "escape" | "submitted";

type DiagnosticOpenDetail = {
  source?: string;
  service?: string;
  context?: Record<string, unknown>;
};

type Invitation = {
  source: string;
  presetService: string;
  context: Record<string, unknown>;
};

const defaultInvitation: Invitation = {
  source: "popup",
  presetService: "",
  context: {},
};

function trackDiagnostic(
  eventName: string,
  source: string,
  detail: Record<string, unknown> = {},
) {
  window.dispatchEvent(
    new CustomEvent("ned:diagnostic", {
      detail: {
        event_name: eventName,
        source,
        ...detail,
      },
    }),
  );
}

export default function DiagnosticPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [invitation, setInvitation] = useState<Invitation>(defaultInvitation);

  useEffect(() => {
    if (pathname !== "/") return;

    try {
      if (window.sessionStorage.getItem(popupStorageKey)) return;
    } catch {
      // Browsers with restricted storage can still display the invitation.
    }

    const timeout = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(popupStorageKey, "1");
      } catch {
        // The popup remains functional even when storage is unavailable.
      }

      setInvitation(defaultInvitation);
      setOpen(true);
      trackDiagnostic("popup_opened", "popup", { delay_ms: popupDelay });
    }, popupDelay);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const openFromTrigger = (event: Event) => {
      const detail = (event as CustomEvent<DiagnosticOpenDetail>).detail ?? {};
      const nextInvitation: Invitation = {
        source: detail.source || "pagina_servico",
        presetService: detail.service || "",
        context: detail.context ?? {},
      };

      setInvitation(nextInvitation);
      setOpen(true);
      trackDiagnostic("popup_opened", nextInvitation.source, {
        trigger: "manual",
        service: nextInvitation.presetService,
      });
    };

    window.addEventListener("ned:diagnostic-open", openFromTrigger);
    return () => window.removeEventListener("ned:diagnostic-open", openFromTrigger);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trackDiagnostic("popup_closed", invitation.source, { reason: "escape" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [invitation.source, open]);

  const closePopup = (reason: CloseReason) => {
    setOpen(false);
    trackDiagnostic(
      reason === "submitted" ? "popup_completed" : "popup_closed",
      invitation.source,
      { reason },
    );
  };

  const isLab = invitation.source === "ned_lab";
  const isServicePage = invitation.source === "pagina_servico";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePopup("backdrop");
          }}
        >
          <motion.section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnostic-popup-title"
            initial={{ opacity: 0, y: 34, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.985 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className={styles.close}
              type="button"
              aria-label="Fechar diagnóstico"
              onClick={() => closePopup("button")}
              data-cursor="FECHAR"
            >
              <X size={20} />
            </button>

            <div className={styles.invitation}>
              <span className={styles.kicker}>
                {isLab
                  ? "NED LAB / PRÓXIMO PASSO"
                  : isServicePage
                    ? "DIAGNÓSTICO DO SERVIÇO / 05 ETAPAS"
                    : "DIAGNÓSTICO EXPRESSO / 05 ETAPAS"}
              </span>
              <h2 id="diagnostic-popup-title">
                {isLab ? (
                  <>Leve o resultado do jogo para a <span>máquina real.</span></>
                ) : isServicePage ? (
                  <>Antes do WhatsApp, vamos <span>organizar seu pedido.</span></>
                ) : (
                  <>Antes de continuar: <span>qual máquina você quer melhorar?</span></>
                )}
              </h2>
              <p>
                O contato será salvo com contexto e o WhatsApp abrirá com um resumo pronto. Você ainda decide se deseja enviar a mensagem.
              </p>

              <div className={styles.benefits}>
                <div>
                  <Clock3 size={17} />
                  <span>
                    <small>01</small>
                    Menos de dois minutos
                  </span>
                </div>
                <div>
                  <MessageCircle size={17} />
                  <span>
                    <small>02</small>
                    Contexto salvo no painel
                  </span>
                </div>
                <div>
                  <ArrowRight size={17} />
                  <span>
                    <small>03</small>
                    Resumo pronto no WhatsApp
                  </span>
                </div>
              </div>

              <button
                className={styles.keepBrowsing}
                type="button"
                onClick={() => closePopup("button")}
                data-cursor="FECHAR"
              >
                Continuar navegando
              </button>
            </div>

            <div className={styles.formPanel}>
              <DiagnosticForm
                key={`${invitation.source}-${invitation.presetService}-${JSON.stringify(invitation.context)}`}
                source={invitation.source}
                presetService={invitation.presetService}
                context={invitation.context}
                onSubmitted={() => closePopup("submitted")}
              />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
