"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
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
      });
    };

    const handleWhatsappEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      sendEvent("whatsapp_diagnostic", customEvent.detail ?? {});
    };

    const handleLabEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, unknown>>;
      const parameters = { ...(customEvent.detail ?? {}) };
      const rawEventName = parameters.event_name;
      const eventName = typeof rawEventName === "string" ? rawEventName : "interaction";
      delete parameters.event_name;
      sendEvent(`ned_lab_${eventName}`, parameters);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("ned:whatsapp", handleWhatsappEvent);
    window.addEventListener("ned:lab", handleLabEvent);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("ned:whatsapp", handleWhatsappEvent);
      window.removeEventListener("ned:lab", handleLabEvent);
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
