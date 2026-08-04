"use client";

import { useEffect } from "react";

const DIAGNOSTIC_TRIGGER_SELECTOR = [
  "[data-open-diagnostic]",
  'a[data-track^="servico_"]',
  'a[data-track="ned_lab_result"]',
].join(",");

const servicePresetByPath: Record<string, string> = {
  "/servicos/marketing-conteudo": "Marketing e conteúdo",
  "/servicos/sites": "Site ou landing page",
  "/servicos/automacoes": "Automações",
  "/servicos/trafego-pago": "Tráfego pago",
  "/servicos/marketplaces": "Marketplaces",
};

export default function SiteRuntime() {
  useEffect(() => {
    const handleDiagnosticTrigger = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>(DIAGNOSTIC_TRIGGER_SELECTOR);
      if (!trigger) return;

      event.preventDefault();

      const isLabResult = trigger.dataset.track === "ned_lab_result";
      const context: Record<string, unknown> = {};
      if (trigger.dataset.leadScore) context.resultado = trigger.dataset.leadScore;
      if (trigger.dataset.leadProfile) context.perfil = trigger.dataset.leadProfile;
      if (trigger.dataset.leadBottleneck) context.gargalo = trigger.dataset.leadBottleneck;
      if (trigger.dataset.leadExperiment) context.experimento = trigger.dataset.leadExperiment;
      if (isLabResult) context.experimento = "A Máquina Quebrada";

      window.dispatchEvent(
        new CustomEvent("ned:diagnostic-open", {
          detail: {
            source: trigger.dataset.leadSource || (isLabResult ? "ned_lab" : "pagina_servico"),
            service:
              trigger.dataset.leadService ||
              (isLabResult ? "Ainda não sei" : servicePresetByPath[window.location.pathname] || ""),
            context,
          },
        }),
      );
    };

    document.addEventListener("click", handleDiagnosticTrigger);
    return () => document.removeEventListener("click", handleDiagnosticTrigger);
  }, []);

  return null;
}
