"use client";

import { Check, Copy, Download, Share2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./result-share-layer.module.css";

type GameResult = {
  total: number;
  profile: string;
  bottleneck: string;
  offer: number;
  service: number;
  operation: number;
  automation: number;
};

type LabEventDetail = Record<string, unknown> & {
  event_name?: string;
};

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;
const PURPLE = "#7040ff";
const PURPLE_LIGHT = "#aa92ff";
const INK = "#08080a";
const PAPER = "#f2f0ea";
const MUTED = "#aaaab4";

function trackLab(eventName: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(
    new CustomEvent("ned:lab", {
      detail: { event_name: eventName, experiment: "maquina_quebrada", ...detail },
    }),
  );
}

function numberFrom(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function textFrom(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      return;
    }
    lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    visibleLines[maxLines - 1] = `${visibleLines[maxLines - 1].replace(/[.,;:]?$/, "")}…`;
  }

  visibleLines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Não foi possível gerar a imagem."));
    }, "image/png");
  });
}

async function buildResultCard(result: GameResult) {
  await document.fonts?.ready;

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponível neste navegador.");

  context.fillStyle = INK;
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  context.save();
  context.globalAlpha = 0.12;
  context.strokeStyle = "#ffffff";
  context.lineWidth = 1;
  for (let x = 0; x <= CARD_WIDTH; x += 90) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CARD_HEIGHT);
    context.stroke();
  }
  for (let y = 0; y <= CARD_HEIGHT; y += 90) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CARD_WIDTH, y);
    context.stroke();
  }
  context.restore();

  const gradient = context.createRadialGradient(875, 270, 0, 875, 270, 480);
  gradient.addColorStop(0, "rgba(112,64,255,0.38)");
  gradient.addColorStop(1, "rgba(112,64,255,0)");
  context.fillStyle = gradient;
  context.fillRect(450, 0, 630, 760);

  context.strokeStyle = "rgba(170,146,255,0.42)";
  context.lineWidth = 2;
  [170, 250, 330].forEach((radius) => {
    context.beginPath();
    context.arc(875, 290, radius, 0, Math.PI * 2);
    context.stroke();
  });
  context.beginPath();
  context.moveTo(520, 290);
  context.lineTo(1080, 290);
  context.moveTo(875, 0);
  context.lineTo(875, 650);
  context.stroke();

  context.fillStyle = PAPER;
  context.font = '400 104px "Bebas Neue", Impact, sans-serif';
  context.fillText("NED", 78, 130);
  context.fillStyle = PURPLE_LIGHT;
  context.font = '700 24px "Space Grotesk", Arial, sans-serif';
  context.fillText("LAB / EXPERIMENTO 001", 82, 178);

  context.fillStyle = PURPLE_LIGHT;
  context.font = '700 25px "Space Grotesk", Arial, sans-serif';
  context.fillText("MINHA MÁQUINA DE VENDAS", 82, 355);

  context.fillStyle = PAPER;
  context.font = '400 212px "Bebas Neue", Impact, sans-serif';
  context.fillText(`${result.total}%`, 72, 590);

  context.fillStyle = PAPER;
  context.font = '400 94px "Bebas Neue", Impact, sans-serif';
  wrapText(context, result.profile, 82, 710, 790, 88, 2);

  context.fillStyle = MUTED;
  context.font = '500 31px "Space Grotesk", Arial, sans-serif';
  wrapText(
    context,
    `Meu maior gargalo na simulação foi ${result.bottleneck}.`,
    84,
    890,
    840,
    48,
    2,
  );

  const metrics = [
    ["OFERTA", result.offer],
    ["ATENDIMENTO", result.service],
    ["OPERAÇÃO", result.operation],
    ["AUTOMAÇÃO", result.automation],
  ] as const;

  metrics.forEach(([label, value], index) => {
    const y = 1050 + index * 150;
    context.fillStyle = PAPER;
    context.font = '700 25px "Space Grotesk", Arial, sans-serif';
    context.fillText(label, 84, y);
    context.textAlign = "right";
    context.fillStyle = PURPLE_LIGHT;
    context.fillText(`${value}%`, 996, y);
    context.textAlign = "left";

    context.fillStyle = "rgba(255,255,255,0.12)";
    roundedRect(context, 84, y + 30, 912, 12, 6);
    context.fill();
    context.fillStyle = PURPLE;
    roundedRect(context, 84, y + 30, Math.max(12, (912 * value) / 100), 12, 6);
    context.fill();
  });

  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.beginPath();
  context.moveTo(84, 1690);
  context.lineTo(996, 1690);
  context.stroke();

  context.fillStyle = PAPER;
  context.font = '400 64px "Bebas Neue", Impact, sans-serif';
  context.fillText("VOCÊ CONSEGUE FAZER MELHOR?", 84, 1792);
  context.fillStyle = MUTED;
  context.font = '500 25px "Space Grotesk", Arial, sans-serif';
  const host = window.location.host.replace(/^www\./, "");
  context.fillText(`${host}/lab/maquina-quebrada`, 84, 1845);

  context.fillStyle = PURPLE;
  context.fillRect(0, CARD_HEIGHT - 20, CARD_WIDTH, 20);

  return canvasToBlob(canvas);
}

export default function ResultShareLayer() {
  const [result, setResult] = useState<GameResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "downloaded" | "error">("idle");

  useEffect(() => {
    const handleLabEvent = (event: Event) => {
      const detail = (event as CustomEvent<LabEventDetail>).detail ?? {};
      if (detail.event_name !== "game_completed") return;

      setResult({
        total: numberFrom(detail.score),
        profile: textFrom(detail.profile, "Resultado NED LAB"),
        bottleneck: textFrom(detail.bottleneck, "Processos"),
        offer: numberFrom(detail.offer_score),
        service: numberFrom(detail.service_score),
        operation: numberFrom(detail.operation_score),
        automation: numberFrom(detail.automation_score),
      });
      setStatus("idle");
      trackLab("share_card_available", { score: numberFrom(detail.score) });
    };

    window.addEventListener("ned:lab", handleLabEvent);
    return () => window.removeEventListener("ned:lab", handleLabEvent);
  }, []);

  const metrics = useMemo(
    () =>
      result
        ? [
            ["Oferta", result.offer],
            ["Atendimento", result.service],
            ["Operação", result.operation],
            ["Automação", result.automation],
          ]
        : [],
    [result],
  );

  const openCard = () => {
    if (!result) return;
    setIsOpen(true);
    setStatus("idle");
    trackLab("share_card_opened", { score: result.total, profile: result.profile });
  };

  const generateFile = useCallback(async () => {
    if (!result) throw new Error("Resultado indisponível.");
    const blob = await buildResultCard(result);
    return new File([blob], `ned-lab-maquina-quebrada-${result.total}.png`, {
      type: "image/png",
    });
  }, [result]);

  const downloadCard = async () => {
    if (!result || isBusy) return;
    setIsBusy(true);
    setStatus("idle");
    try {
      const file = await generateFile();
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("downloaded");
      trackLab("result_card_downloaded", { score: result.total, profile: result.profile });
    } catch (error) {
      console.error(error);
      setStatus("error");
      trackLab("result_card_error", { action: "download" });
    } finally {
      setIsBusy(false);
    }
  };

  const shareCard = async () => {
    if (!result || isBusy) return;
    setIsBusy(true);
    setStatus("idle");

    try {
      const file = await generateFile();
      const shareText = `Minha Máquina de Vendas ficou em ${result.total}%. Perfil: ${result.profile}. Você consegue fazer melhor?`;
      const shareData: ShareData = {
        title: "Meu resultado — A Máquina Quebrada",
        text: shareText,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ ...shareData, files: [file] });
        trackLab("result_shared", { method: "native_image", score: result.total });
        return;
      }

      if (navigator.share) {
        await navigator.share(shareData);
        trackLab("result_shared", { method: "native_link", score: result.total });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setStatus("copied");
      trackLab("result_shared", { method: "clipboard", score: result.total });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        trackLab("result_share_cancelled", { score: result.total });
      } else {
        console.error(error);
        setStatus("error");
        trackLab("result_card_error", { action: "share" });
      }
    } finally {
      setIsBusy(false);
    }
  };

  const copyLink = async () => {
    if (!result || isBusy) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
      trackLab("result_link_copied", { score: result.total });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (!result) return null;

  return (
    <>
      <button className={styles.floatingButton} type="button" onClick={openCard}>
        <Share2 size={18} />
        <span>
          Compartilhar resultado
          <small>Card pronto para Stories</small>
        </span>
      </button>

      {isOpen && (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsOpen(false)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-result-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              type="button"
              aria-label="Fechar compartilhamento"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>

            <div className={styles.copy}>
              <span>NED LAB / RESULTADO COMPARTILHÁVEL</span>
              <h2 id="share-result-title">Leve seu diagnóstico para os Stories.</h2>
              <p>
                O card é gerado no seu navegador, sem enviar seus dados ou sua imagem para um servidor.
              </p>

              <div className={styles.actions}>
                <button type="button" onClick={shareCard} disabled={isBusy}>
                  <Share2 size={17} /> {isBusy ? "Gerando card…" : "Compartilhar"}
                </button>
                <button type="button" onClick={downloadCard} disabled={isBusy}>
                  <Download size={17} /> Baixar PNG
                </button>
                <button type="button" onClick={copyLink} disabled={isBusy}>
                  <Copy size={17} /> Copiar link
                </button>
              </div>

              <p className={styles.status} aria-live="polite">
                {status === "copied" && (
                  <>
                    <Check size={15} /> Link copiado.
                  </>
                )}
                {status === "downloaded" && (
                  <>
                    <Check size={15} /> Card baixado em 1080 × 1920 px.
                  </>
                )}
                {status === "error" && "Não foi possível concluir. Tente novamente neste navegador."}
              </p>
            </div>

            <div className={styles.preview} aria-label="Prévia do card de resultado">
              <div className={styles.previewGrid} aria-hidden="true" />
              <div className={styles.previewTarget} aria-hidden="true" />
              <header>
                <strong>NED</strong>
                <span>LAB / 001</span>
              </header>
              <main>
                <small>MINHA MÁQUINA DE VENDAS</small>
                <b>{result.total}%</b>
                <h3>{result.profile}</h3>
                <p>
                  Maior gargalo: <strong>{result.bottleneck}</strong>
                </p>
                <div className={styles.previewMetrics}>
                  {metrics.map(([label, value]) => (
                    <div key={String(label)}>
                      <span>
                        {label} <strong>{value}%</strong>
                      </span>
                      <i>
                        <b style={{ width: `${value}%` }} />
                      </i>
                    </div>
                  ))}
                </div>
              </main>
              <footer>
                <strong>VOCÊ CONSEGUE FAZER MELHOR?</strong>
                <span>/lab/maquina-quebrada</span>
              </footer>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
