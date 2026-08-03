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

function trackDiagnostic(eventName: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(
    new CustomEvent("ned:diagnostic", {
      detail: {
        event_name: eventName,
        source: "diagnostico_popup",
        ...detail,
      },
    }),
  );
}

export default function DiagnosticPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setOpen(false);
      return;
    }

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

      setOpen(true);
      trackDiagnostic("popup_opened", { delay_ms: popupDelay });
    }, popupDelay);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trackDiagnostic("popup_closed", { reason: "escape" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closePopup = (reason: CloseReason) => {
    setOpen(false);
    trackDiagnostic(reason === "submitted" ? "popup_completed" : "popup_closed", {
      reason,
    });
  };

  if (pathname !== "/") return null;

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
              <span className={styles.kicker}>DIAGNÓSTICO EXPRESSO / 04 RESPOSTAS</span>
              <h2 id="diagnostic-popup-title">
                Antes de continuar: <span>qual máquina você quer melhorar?</span>
              </h2>
              <p>
                Responda quatro perguntas rápidas. O WhatsApp será aberto com contexto suficiente
                para começar uma conversa útil — sem formulário burocrático.
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
                    Resumo pronto no WhatsApp
                  </span>
                </div>
                <div>
                  <ArrowRight size={17} />
                  <span>
                    <small>03</small>
                    Você decide se quer enviar
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
                source="diagnostico_popup"
                onSubmitted={() => closePopup("submitted")}
              />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
