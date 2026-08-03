"use client";

import { useEffect } from "react";

const PROJECT_CTA_SELECTOR = [
  '[data-track="header"]',
  '[data-track="hero"]',
  '[data-track="menu_mobile"]',
  '[data-track="botao_flutuante"]',
  '[data-track="footer"]',
].join(",");

const DIAGNOSTIC_TRIGGER_SELECTOR = "[data-open-diagnostic]";

const SERVICE_NAVIGATION_ROUTES = new Map([
  ["#marketplaces", "/servicos/marketplaces"],
]);

function scrollToDiagnosis() {
  const diagnosis = document.getElementById("diagnostico");
  if (!diagnosis) return;

  diagnosis.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#diagnostico");
}

function rewriteServiceNavigation() {
  SERVICE_NAVIGATION_ROUTES.forEach((route, hash) => {
    document
      .querySelectorAll<HTMLAnchorElement>(
        `nav a[href="${hash}"], .mobile-menu-links a[href="${hash}"]`,
      )
      .forEach((link) => {
        link.setAttribute("href", route);
        link.dataset.track = `navigation_${hash.slice(1)}`;
      });
  });
}

function rebuildMarquee() {
  const track = document.querySelector<HTMLElement>(".capability-track");
  if (!track) return;

  const currentItems = Array.from(track.children) as HTMLElement[];
  if (currentItems.length < 6) return;

  const baseItems = currentItems.slice(0, 6).map((item) => item.cloneNode(true) as HTMLElement);
  const sequenceWidth = currentItems
    .slice(0, 6)
    .reduce((total, item) => total + item.getBoundingClientRect().width, 0);

  if (!sequenceWidth) return;

  const repeatsPerHalf = Math.max(3, Math.ceil((window.innerWidth * 1.35) / sequenceWidth) + 1);
  const fragment = document.createDocumentFragment();

  for (let half = 0; half < 2; half += 1) {
    for (let repeat = 0; repeat < repeatsPerHalf; repeat += 1) {
      baseItems.forEach((item) => fragment.appendChild(item.cloneNode(true)));
    }
  }

  track.replaceChildren(fragment);
  track.style.setProperty("--marquee-duration", `${Math.max(32, (sequenceWidth * repeatsPerHalf) / 58)}s`);
}

export default function SiteRuntime() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const forceHeroStart = () => {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    forceHeroStart();
    requestAnimationFrame(forceHeroStart);
    const topTimeout = window.setTimeout(forceHeroStart, 250);

    const handleDiagnosticTrigger = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>(DIAGNOSTIC_TRIGGER_SELECTOR);
      if (!trigger) return;

      event.preventDefault();

      const context: Record<string, unknown> = {};
      if (trigger.dataset.leadScore) context.resultado = trigger.dataset.leadScore;
      if (trigger.dataset.leadProfile) context.perfil = trigger.dataset.leadProfile;
      if (trigger.dataset.leadBottleneck) context.gargalo = trigger.dataset.leadBottleneck;
      if (trigger.dataset.leadExperiment) context.experimento = trigger.dataset.leadExperiment;

      window.dispatchEvent(
        new CustomEvent("ned:diagnostic-open", {
          detail: {
            source: trigger.dataset.leadSource || "pagina_servico",
            service: trigger.dataset.leadService || "",
            context,
          },
        }),
      );
    };

    const handleProjectCta = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>(PROJECT_CTA_SELECTOR);
      if (!link) return;

      event.preventDefault();

      if (link.dataset.track === "menu_mobile") {
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.click();
        window.setTimeout(scrollToDiagnosis, 420);
        return;
      }

      scrollToDiagnosis();
    };

    document.addEventListener("click", handleDiagnosticTrigger);
    document.addEventListener("click", handleProjectCta);

    rewriteServiceNavigation();
    const navigationObserver = new MutationObserver(rewriteServiceNavigation);
    navigationObserver.observe(document.body, { childList: true, subtree: true });

    rebuildMarquee();
    const resizeTimeout = { current: 0 };
    const handleResize = () => {
      window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(rebuildMarquee, 160);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.clearTimeout(topTimeout);
      window.clearTimeout(resizeTimeout.current);
      document.removeEventListener("click", handleDiagnosticTrigger);
      document.removeEventListener("click", handleProjectCta);
      navigationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}
