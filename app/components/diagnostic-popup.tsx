"use client";

import { ArrowRight, Clock3, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DiagnosticForm from "./diagnostic-form";
import styles from "./diagnostic-popup.module.css";

const popupStorageKey = "ned_diagnostic_popup_seen";
const popupDelay = 12000;
const popupScrollThreshold = 0.28;

type CloseReason = "backdrop" | "button" | "escape" | "submitted";
type PopupPhase = "invitation" | "form";

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
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<PopupPhase>("invitation");
  const [invitation, setInvitation] = useState<Invitation>(defaultInvitation);

  useEffect(() => {
    if (pathname !== "/") return;

    try {
      if (window.sessionStorage.getItem(popupStorageKey)) return;
    } catch {
      // Browsers with restricted storage can still display the invitation.
    }

    let elapsed = false;
    let engaged = false;
    let opened = false;

    const maybeOpen = () => {
      if (!elapsed || !engaged || opened) return;
      opened = true;

      try {
        window.sessionStorage.setItem(popupStorageKey, "1");
      } catch {
        // The popup remains functional even when storage is unavailable.
      }

      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setInvitation(defaultInvitation);
      setPhase("invitation");
      setOpen(true);
      trackDiagnostic("popup_opened", "popup", {
        delay_ms: popupDelay,
        scroll_threshold: popupScrollThreshold,
        mode: "automatic_invitation",
      });
    };

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 1;
      if (progress < popupScrollThreshold) return;
      engaged = true;
      window.removeEventListener("scroll", onScroll);
      maybeOpen();
    };

    const timeout = window.setTimeout(() => {
      elapsed = true;
      maybeOpen();
    }, popupDelay);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const openFromTrigger = (event: Event) => {
      const detail = (event as CustomEvent<DiagnosticOpenDetail>).detail ?? {};
      const nextInvitation: Invitation = {
        source: detail.source || "pagina_servico",
        presetService: detail.service || "",
        context: detail.context ?? {},
      };

      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setInvitation(nextInvitation);
      setPhase("form");
      setOpen(true);
      trackDiagnostic("popup_opened", nextInvitation.source, {
        trigger: "manual",
        service: nextInvitation.presetService,
        mode: "direct_form",
      });
    };

    window.addEventListener("ned:diagnostic-open", openFromTrigger);
    return () => window.removeEventListener("ned:diagnostic-open", openFromTrigger);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trackDiagnostic("popup_closed", invitation.source, { reason: "escape", phase });
        window.setTimeout(() => previousFocusRef.current?.focus(), 220);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [invitation.source, open, phase]);

  const closePopup = (reason: CloseReason) => {
    setOpen(false);
    trackDiagnostic(
      reason === "submitted" ? "popup_completed" : "popup_closed",
      invitation.source,
      { reason, phase },
    );
    window.setTimeout(() => previousFocusRef.current?.focus(), 220);
  };

  const startAnalysis = () => {
    setPhase("form");
    trackDiagnostic("popup_started", invitation.source, {
      trigger: "invitation_cta",
    });
  };

  const isLab = invitation.source === "ned_lab";
  const isServicePage = invitation.source === "pagina_servico";

  const invitationCopy = isLab
    ? {
        kicker: "DO PROTÓTIPO PARA O NEGÓCIO",
        title: "Encontrou um problema parecido na sua empresa?",
        description:
          "Conte o cenário e leve o diagnóstico da experiência para uma conversa real. Nada é enviado sem sua confirmação.",
      }
    : isServicePage
      ? {
          kicker: "PEDIDO ORGANIZADO · CERCA DE 2 MIN",
          title: "Conte o que você precisa antes de chamar no WhatsApp.",
          description:
            "Assim a conversa já começa com contexto e conseguimos entender melhor o próximo passo.",
        }
      : {
          kicker: "ANÁLISE INICIAL · CERCA DE 2 MIN",
          title: "Vamos entender o que sua empresa precisa melhorar?",
          description:
            "Responda quatro perguntas rápidas. A NED recebe o contexto e prepara a conversa no WhatsApp. Nada é enviado sem sua confirmação.",
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePopup("backdrop");
          }}
        >
          <motion.section
            ref={modalRef}
            className={styles.modal}
            data-phase={phase}
            role="dialog"
            aria-modal="true"
            aria-label="Diagnóstico inicial da NED"
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.topbar}>
              <span>{phase === "invitation" ? "ANÁLISE NED" : "DIAGNÓSTICO NED · 4 ETAPAS"}</span>
              <button
                ref={closeButtonRef}
                className={styles.close}
                type="button"
                aria-label="Fechar diagnóstico"
                onClick={() => closePopup("button")}
                data-cursor="FECHAR"
              >
                <span>Fechar</span>
                <X size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {phase === "invitation" ? (
                <motion.div
                  key="invitation"
                  className={styles.invitation}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24 }}
                >
                  <span className={styles.kicker}>{invitationCopy.kicker}</span>
                  <h2>{invitationCopy.title}</h2>
                  <p>{invitationCopy.description}</p>

                  <div className={styles.benefits}>
                    <div>
                      <Clock3 size={17} />
                      <span>4 perguntas objetivas</span>
                    </div>
                    <div>
                      <MessageCircle size={17} />
                      <span>WhatsApp só abre no final</span>
                    </div>
                  </div>

                  <div className={styles.invitationActions}>
                    <button
                      className={styles.start}
                      type="button"
                      onClick={startAnalysis}
                    >
                      Começar análise <ArrowRight size={17} />
                    </button>
                    <button
                      className={styles.keepBrowsing}
                      type="button"
                      onClick={() => closePopup("button")}
                    >
                      Continuar no site
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className={styles.formPanel}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.24 }}
                >
                  <DiagnosticForm
                    key={`${invitation.source}-${invitation.presetService}-${JSON.stringify(invitation.context)}`}
                    source={invitation.source}
                    presetService={invitation.presetService}
                    context={invitation.context}
                    onSubmitted={() => closePopup("submitted")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
