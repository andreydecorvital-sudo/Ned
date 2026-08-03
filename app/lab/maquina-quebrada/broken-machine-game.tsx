"use client";

import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CircleAlert,
  Laptop,
  MessageCircle,
  RotateCcw,
  Smartphone,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../lab.module.css";

type Stage = "intro" | "scene" | "challenge" | "result";
type ProblemId = "site" | "service" | "operation";
type AnswerId = "detailed" | "hello" | "emoji";

type Problem = {
  id: ProblemId;
  label: string;
  title: string;
  symptom: string;
  consequence: string;
  solution: string;
  icon: typeof Laptop;
  hotspotClass: string;
};

const problems: Problem[] = [
  {
    id: "site",
    label: "Computador",
    title: "O site trabalha contra a venda",
    symptom: "A oferta está escondida, o botão é genérico e o cliente não entende qual é o próximo passo.",
    consequence: "A empresa paga para receber visitas e perde pessoas antes da conversa começar.",
    solution: "Clareza de oferta, página focada em conversão e um CTA que explique a ação.",
    icon: Laptop,
    hotspotClass: styles.hotspotLaptop,
  },
  {
    id: "service",
    label: "Celular",
    title: "As melhores mensagens ficam esperando",
    symptom: "Mensagens detalhadas e contatos vagos chegam na mesma fila, sem prioridade ou contexto.",
    consequence: "Leads prontos para comprar recebem a mesma atenção de quem apenas escreveu “oi”.",
    solution: "Triagem simples, contexto do formulário e passagem rápida para atendimento humano.",
    icon: Smartphone,
    hotspotClass: styles.hotspotPhone,
  },
  {
    id: "operation",
    label: "Pedidos",
    title: "A operação depende de memória",
    symptom: "Pedidos, prazos e tarefas ficam espalhados entre planilhas, mensagens e anotações.",
    consequence: "Quanto mais a empresa vende, maior fica a chance de atraso, retrabalho e cancelamento.",
    solution: "Processo visível, responsáveis definidos e automação apenas onde ela reduz fricção.",
    icon: Boxes,
    hotspotClass: styles.hotspotBoxes,
  },
];

const answers = [
  {
    id: "detailed" as const,
    sender: "Marina",
    message: "Tenho uma loja de cosméticos, preciso melhorar meu site e quero lançar em 20 dias.",
    note: "Mensagem detalhada",
  },
  {
    id: "hello" as const,
    sender: "Contato novo",
    message: "Oi, queria saber mais.",
    note: "Mensagem vaga",
  },
  {
    id: "emoji" as const,
    sender: "Instagram",
    message: "🔥🔥",
    note: "Reação sem contexto",
  },
];

const answerScores: Record<AnswerId, number> = {
  detailed: 92,
  hello: 61,
  emoji: 38,
};

function trackLab(eventName: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(
    new CustomEvent("ned:lab", {
      detail: { event_name: eventName, experiment: "maquina_quebrada", ...detail },
    }),
  );
}

export default function BrokenMachineGame() {
  const [stage, setStage] = useState<Stage>("intro");
  const [discovered, setDiscovered] = useState<ProblemId[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState<AnswerId | null>(null);

  const result = useMemo(() => {
    const serviceScore = answer ? answerScores[answer] : 0;
    const scores = {
      offer: 74,
      service: serviceScore,
      operation: 57,
      automation: 41,
    };
    const total = Math.round(
      (scores.offer + scores.service + scores.operation + scores.automation) / 4,
    );

    const profile =
      serviceScore >= 85
        ? {
            name: "O Estrategista",
            text: "Você prioriza contexto e valor antes do barulho. O próximo passo é transformar essa boa decisão em processo repetível.",
          }
        : serviceScore >= 55
          ? {
              name: "O Bombeiro",
              text: "Você reage rápido, mas ainda corre o risco de tratar urgência aparente como oportunidade real.",
            }
          : {
              name: "O Acelerador",
              text: "Você gosta de movimento, mas pode estar gastando energia antes de entender onde existe intenção de compra.",
            };

    return { scores, total, profile };
  }, [answer]);

  const openProblem = (problem: Problem) => {
    setActiveProblem(problem);
    setDiscovered((current) =>
      current.includes(problem.id) ? current : [...current, problem.id],
    );
    trackLab("problem_found", { problem: problem.id });
  };

  const startGame = () => {
    setStage("scene");
    trackLab("game_started");
  };

  const beginChallenge = () => {
    setActiveProblem(null);
    setStage("challenge");
    trackLab("challenge_started");
  };

  const finishChallenge = () => {
    if (!answer) return;
    setStage("result");
    trackLab("game_completed", {
      answer,
      score: answerScores[answer],
    });
  };

  const restart = () => {
    setDiscovered([]);
    setActiveProblem(null);
    setAnswer(null);
    setStage("scene");
    trackLab("game_restarted");
  };

  const whatsappMessage = [
    "Olá, Ned! Joguei A Máquina Quebrada no NED LAB.",
    `Meu resultado foi ${result.total}% e meu perfil foi ${result.profile.name}.`,
    "Quero analisar os gargalos reais da minha empresa.",
  ].join("\n");

  return (
    <main className={styles.gamePage}>
      <header className={styles.labHeader}>
        <Link className={styles.labBrand} href="/" aria-label="Voltar para a Ned Marketing">
          <span>NED</span>
          <small>LAB / 001</small>
        </Link>
        <Link className={styles.headerBack} href="/lab">
          <ArrowLeft size={16} /> Experimentos
        </Link>
      </header>

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.section
            key="intro"
            className={styles.gameIntro}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className={styles.introGrid} aria-hidden="true" />
            <div className={styles.introCopy}>
              <span className={styles.kicker}>EXPERIMENTO INTERATIVO / 001</span>
              <h1>
                A máquina <span>quebrada</span>
              </h1>
              <p>
                Esta empresa parece estar funcionando. Encontre três gargalos antes que eles
                continuem afastando clientes.
              </p>
              <div className={styles.introMeta}>
                <span>01 empresa</span>
                <span>03 gargalos</span>
                <span>~02 minutos</span>
              </div>
              <button className={styles.primaryButton} type="button" onClick={startGame}>
                Investigar a empresa <Target size={18} />
              </button>
              <p className={styles.noSignup}>Sem cadastro. Resultado baseado apenas nesta simulação.</p>
            </div>

            <div className={styles.machinePreview} aria-hidden="true">
              <div className={styles.previewRing} />
              <div className={styles.previewRingInner} />
              <div className={styles.previewCrossHorizontal} />
              <div className={styles.previewCrossVertical} />
              <span className={styles.previewLabelTop}>FOCO</span>
              <span className={styles.previewLabelRight}>DADOS</span>
              <span className={styles.previewLabelBottom}>RESULTADOS</span>
              <span className={styles.previewLabelLeft}>PROCESSOS</span>
              <CircleAlert className={styles.previewAlert} size={34} />
            </div>
          </motion.section>
        )}

        {stage === "scene" && (
          <motion.section
            key="scene"
            className={styles.sceneSection}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
          >
            <div className={styles.sceneTopbar}>
              <div>
                <span className={styles.kicker}>LOJA VIRTUAL / OPERAÇÃO 08:47</span>
                <h1>Encontre os gargalos</h1>
              </div>
              <div className={styles.progressBlock}>
                <span>DIAGNÓSTICO</span>
                <strong>{String(discovered.length).padStart(2, "0")} / 03</strong>
                <div className={styles.progressTrack}>
                  <motion.span
                    animate={{ width: `${(discovered.length / problems.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.sceneLayout}>
              <div className={styles.businessScene}>
                <div className={styles.sceneGrid} aria-hidden="true" />
                <div className={styles.sceneStatus}>
                  <span className={styles.liveDot} /> SISTEMA EM OPERAÇÃO
                </div>

                <div className={styles.desk} aria-hidden="true" />
                <div className={styles.screenObject} aria-hidden="true">
                  <span className={styles.screenHeader} />
                  <span className={styles.screenLineLong} />
                  <span className={styles.screenLineShort} />
                  <span className={styles.screenBadButton}>CLIQUE AQUI</span>
                </div>
                <div className={styles.phoneObject} aria-hidden="true">
                  <span>7</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.boxObject} aria-hidden="true">
                  <span>ATRASADO</span>
                </div>
                <div className={styles.customerObject} aria-hidden="true">
                  <span>?</span>
                </div>

                {problems.map((problem) => {
                  const Icon = problem.icon;
                  const found = discovered.includes(problem.id);
                  return (
                    <button
                      key={problem.id}
                      type="button"
                      className={`${styles.hotspot} ${problem.hotspotClass} ${
                        found ? styles.hotspotFound : ""
                      }`}
                      aria-label={`Investigar ${problem.label}`}
                      onClick={() => openProblem(problem)}
                    >
                      <span className={styles.hotspotPulse} />
                      <Icon size={18} />
                      <small>{found ? "ENCONTRADO" : "INVESTIGAR"}</small>
                    </button>
                  );
                })}

                <div className={styles.sceneHint}>
                  <Target size={15} /> Toque nos pontos instáveis da operação.
                </div>
              </div>

              <aside className={styles.investigationPanel}>
                <span className={styles.panelIndex}>PAINEL DE INVESTIGAÇÃO</span>
                <h2>
                  Nem todo problema <span>faz barulho.</span>
                </h2>
                <p>
                  Observe o ambiente. Os três pontos marcados representam falhas comuns que
                  parecem pequenas, mas interrompem a jornada de compra.
                </p>

                <div className={styles.problemChecklist}>
                  {problems.map((problem, index) => {
                    const found = discovered.includes(problem.id);
                    return (
                      <button
                        key={problem.id}
                        type="button"
                        onClick={() => openProblem(problem)}
                        className={found ? styles.checkFound : ""}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{found ? problem.title : "Gargalo não identificado"}</strong>
                        {found ? <Check size={17} /> : <span className={styles.lockedMark}>—</span>}
                      </button>
                    );
                  })}
                </div>

                <button
                  className={styles.primaryButton}
                  type="button"
                  disabled={discovered.length !== problems.length}
                  onClick={beginChallenge}
                >
                  Resolver gargalo crítico <ArrowRight size={18} />
                </button>
              </aside>
            </div>

            <AnimatePresence>
              {activeProblem && (
                <motion.div
                  className={styles.problemOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveProblem(null)}
                >
                  <motion.article
                    className={styles.problemCard}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      className={styles.closeButton}
                      type="button"
                      aria-label="Fechar diagnóstico"
                      onClick={() => setActiveProblem(null)}
                    >
                      <X size={20} />
                    </button>
                    <div className={styles.problemCardIcon}>
                      {(() => {
                        const ActiveProblemIcon = activeProblem.icon;
                        return <ActiveProblemIcon size={26} />;
                      })()}
                    </div>
                    <span>GARGALO IDENTIFICADO / {activeProblem.label.toUpperCase()}</span>
                    <h2>{activeProblem.title}</h2>
                    <div className={styles.problemCardSections}>
                      <div>
                        <small>SINTOMA</small>
                        <p>{activeProblem.symptom}</p>
                      </div>
                      <div>
                        <small>CONSEQUÊNCIA</small>
                        <p>{activeProblem.consequence}</p>
                      </div>
                      <div>
                        <small>CAMINHO</small>
                        <p>{activeProblem.solution}</p>
                      </div>
                    </div>
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => setActiveProblem(null)}
                    >
                      Continuar investigação <ArrowRight size={17} />
                    </button>
                  </motion.article>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {stage === "challenge" && (
          <motion.section
            key="challenge"
            className={styles.challengeSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className={styles.challengeHeader}>
              <span className={styles.kicker}>DESAFIO CRÍTICO / ATENDIMENTO</span>
              <h1>Quem deve receber atenção primeiro?</h1>
              <p>
                A equipe só consegue iniciar uma conversa agora. Escolha a mensagem com maior
                contexto e intenção comercial.
              </p>
            </div>

            <div className={styles.inboxFrame}>
              <div className={styles.inboxTopbar}>
                <div>
                  <MessageCircle size={17} /> CAIXA DE ENTRADA
                </div>
                <span>03 NÃO LIDAS</span>
              </div>

              <div className={styles.messageList} role="radiogroup" aria-label="Escolha uma mensagem">
                {answers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={answer === item.id}
                    className={answer === item.id ? styles.messageSelected : ""}
                    onClick={() => {
                      setAnswer(item.id);
                      trackLab("challenge_answer_selected", { answer: item.id });
                    }}
                  >
                    <div className={styles.avatar}>{item.sender.slice(0, 1)}</div>
                    <div className={styles.messageCopy}>
                      <div>
                        <strong>{item.sender}</strong>
                        <span>agora</span>
                      </div>
                      <p>{item.message}</p>
                      <small>{item.note}</small>
                    </div>
                    <span className={styles.radioMark}>{answer === item.id ? <Check size={16} /> : ""}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.challengeActions}>
              <button className={styles.textButton} type="button" onClick={() => setStage("scene")}>
                <ArrowLeft size={17} /> Voltar à empresa
              </button>
              <button
                className={styles.primaryButton}
                type="button"
                disabled={!answer}
                onClick={finishChallenge}
              >
                Ver diagnóstico <ArrowRight size={18} />
              </button>
            </div>
          </motion.section>
        )}

        {stage === "result" && (
          <motion.section
            key="result"
            className={styles.resultSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.resultHero}>
              <div>
                <span className={styles.kicker}>RESULTADO DA SIMULAÇÃO</span>
                <h1>
                  Saúde da máquina: <span>{result.total}%</span>
                </h1>
                <p>{result.profile.text}</p>
              </div>
              <div className={styles.resultScore}>
                <span>{result.total}</span>
                <small>/ 100</small>
              </div>
            </div>

            <div className={styles.resultGrid}>
              <article className={styles.profileCard}>
                <Sparkles size={24} />
                <span>SEU PERFIL</span>
                <h2>{result.profile.name}</h2>
                <p>Seu maior ponto de atenção nesta simulação é transformar decisões boas em um sistema consistente.</p>
              </article>

              <article className={styles.metricsCard}>
                <span>DIAGNÓSTICO DA PARTIDA</span>
                {[
                  ["Clareza da oferta", result.scores.offer],
                  ["Atendimento", result.scores.service],
                  ["Operação", result.scores.operation],
                  ["Automação", result.scores.automation],
                ].map(([label, value]) => (
                  <div className={styles.metric} key={String(label)}>
                    <div>
                      <span>{label}</span>
                      <strong>{value}%</strong>
                    </div>
                    <div className={styles.metricTrack}>
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                      />
                    </div>
                  </div>
                ))}
              </article>
            </div>

            <div className={styles.resultCta}>
              <div>
                <span>ISSO FOI UMA SIMULAÇÃO.</span>
                <h2>Agora podemos investigar a máquina real da sua empresa.</h2>
                <p>
                  O resultado não é uma auditoria. Ele representa apenas as decisões tomadas
                  durante esta experiência.
                </p>
              </div>
              <div className={styles.resultActions}>
                <a
                  className={styles.primaryButton}
                  href={`https://wa.me/5511917814612?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  data-track="ned_lab_result"
                >
                  Analisar minha empresa <MessageCircle size={18} />
                </a>
                <button className={styles.secondaryButton} type="button" onClick={restart}>
                  Jogar novamente <RotateCcw size={17} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
