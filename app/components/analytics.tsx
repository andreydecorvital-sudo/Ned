"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getLabSessionId() {
  const storageKey = "ned_lab_session_id";
  const current = window.sessionStorage.getItem(storageKey);
  if (current) return current;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `lab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(storageKey, next);
  return next;
}

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId) return;

    const sendEvent = (eventName: string, parameters: Record<string, unknown>) => {
      window.gtag?.("event", eventName, parameters);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;

      sendEvent("whatsapp_click", {
        source: link.dataset.track ?? "link_generico",
        link_url: link.href,
        page_path: window.location.pathname,
        transport_type: "beacon",
      });
    };

    const handleWhatsappEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      sendEvent("whatsapp_diagnostic", {
        ...(customEvent.detail ?? {}),
        page_path: window.location.pathname,
        transport_type: "beacon",
      });
    };

    const handleDiagnosticEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const parameters = { ...(customEvent.detail ?? {}) };
      const rawEventName = parameters.event_name;
      const eventName = typeof rawEventName === "string" ? rawEventName : "interaction";
      delete parameters.event_name;

      sendEvent(`diagnostic_${eventName}`, {
        ...parameters,
        page_path: window.location.pathname,
        page_title: document.title,
        transport_type: "beacon",
      });
    };

    const handleLabEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const parameters = { ...(customEvent.detail ?? {}) };
      const rawEventName = parameters.event_name;
      const eventName = typeof rawEventName === "string" ? rawEventName : "interaction";
      delete parameters.event_name;

      sendEvent(`ned_lab_${eventName}`, {
        ...parameters,
        lab_session_id: getLabSessionId(),
        page_path: window.location.pathname,
        page_title: document.title,
        transport_type: "beacon",
      });
    };

    const handleCommercialCapture = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      sendEvent("commercial_lead_capture", {
        ...(customEvent.detail ?? {}),
        page_path: window.location.pathname,
        page_title: document.title,
        transport_type: "beacon",
      });
    };

    const handleScoreEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const parameters = { ...(customEvent.detail ?? {}) };
      const rawEventName = parameters.event_name;
      const eventName = typeof rawEventName === "string" ? rawEventName : "interaction";
      delete parameters.event_name;

      sendEvent(`ned_score_${eventName}`, {
        ...parameters,
        page_path: window.location.pathname,
        transport_type: "beacon",
      });
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("ned:whatsapp", handleWhatsappEvent);
    window.addEventListener("ned:diagnostic", handleDiagnosticEvent);
    window.addEventListener("ned:lab", handleLabEvent);
    window.addEventListener("ned:commercial_capture", handleCommercialCapture);
    window.addEventListener("ned:score", handleScoreEvent);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("ned:whatsapp", handleWhatsappEvent);
      window.removeEventListener("ned:diagnostic", handleDiagnosticEvent);
      window.removeEventListener("ned:lab", handleLabEvent);
      window.removeEventListener("ned:commercial_capture", handleCommercialCapture);
      window.removeEventListener("ned:score", handleScoreEvent);
    };
  }, [gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ned-google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
