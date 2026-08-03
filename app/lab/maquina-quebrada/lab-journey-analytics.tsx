"use client";

import { useEffect, useRef } from "react";

type LabEventDetail = Record<string, unknown> & {
  event_name?: string;
  challenge?: string;
  problem?: string;
};

function trackLab(eventName: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(
    new CustomEvent("ned:lab", {
      detail: { event_name: eventName, experiment: "maquina_quebrada", ...detail },
    }),
  );
}

export default function LabJourneyAnalytics() {
  const startedAt = useRef<number | null>(null);
  const started = useRef(false);
  const completed = useRef(false);
  const currentStage = useRef("intro");
  const currentChallenge = useRef<string | null>(null);
  const discoveredProblems = useRef(new Set<string>());

  useEffect(() => {
    const viewTimer = window.setTimeout(() => {
      trackLab("experiment_viewed", {
        page_path: window.location.pathname,
        referrer: document.referrer || "direct",
      });
    }, 0);

    const handleLabEvent = (event: Event) => {
      const detail = (event as CustomEvent<LabEventDetail>).detail ?? {};
      const eventName = detail.event_name;

      switch (eventName) {
        case "game_started":
          startedAt.current = Date.now();
          started.current = true;
          completed.current = false;
          currentStage.current = "scene";
          currentChallenge.current = null;
          discoveredProblems.current.clear();
          break;
        case "problem_found": {
          const problem = typeof detail.problem === "string" ? detail.problem : "unknown";
          if (discoveredProblems.current.has(problem)) break;
          discoveredProblems.current.add(problem);
          trackLab("problem_discovered_unique", {
            problem,
            discovered_count: discoveredProblems.current.size,
          });
          if (discoveredProblems.current.size === 3) {
            trackLab("all_problems_found", {
              elapsed_seconds: startedAt.current
                ? Math.round((Date.now() - startedAt.current) / 1000)
                : 0,
            });
          }
          break;
        }
        case "challenge_sequence_started":
          currentStage.current = "challenge";
          currentChallenge.current = "site";
          trackLab("challenge_viewed", { challenge: "site", position: 1 });
          break;
        case "challenge_completed": {
          const challenge = typeof detail.challenge === "string" ? detail.challenge : "unknown";
          const nextChallenge =
            challenge === "site" ? ["service", 2] : challenge === "service" ? ["operation", 3] : null;
          if (nextChallenge) {
            currentChallenge.current = String(nextChallenge[0]);
            window.setTimeout(() => {
              trackLab("challenge_viewed", {
                challenge: nextChallenge[0],
                position: nextChallenge[1],
              });
            }, 0);
          }
          break;
        }
        case "game_completed": {
          completed.current = true;
          currentStage.current = "result";
          currentChallenge.current = null;
          const elapsedSeconds = startedAt.current
            ? Math.round((Date.now() - startedAt.current) / 1000)
            : 0;
          trackLab("result_viewed", {
            score: detail.score,
            profile: detail.profile,
            bottleneck: detail.bottleneck,
            elapsed_seconds: elapsedSeconds,
          });
          trackLab("completion_timing", {
            elapsed_seconds: elapsedSeconds,
            problems_found: discoveredProblems.current.size,
          });
          break;
        }
        case "game_restarted":
          startedAt.current = Date.now();
          started.current = true;
          completed.current = false;
          currentStage.current = "scene";
          currentChallenge.current = null;
          discoveredProblems.current.clear();
          break;
        default:
          break;
      }
    };

    const handlePageHide = () => {
      if (!started.current || completed.current) return;
      trackLab("game_abandoned", {
        stage: currentStage.current,
        challenge: currentChallenge.current ?? "none",
        problems_found: discoveredProblems.current.size,
        elapsed_seconds: startedAt.current
          ? Math.round((Date.now() - startedAt.current) / 1000)
          : 0,
      });
    };

    window.addEventListener("ned:lab", handleLabEvent);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.clearTimeout(viewTimer);
      window.removeEventListener("ned:lab", handleLabEvent);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
