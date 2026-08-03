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
import challengeStyles from "./game-challenges.module.css";

type Stage = "intro" | "scene" | "challenge" | "result";
type ProblemId = "site" | "service" | "operation";
type ChallengeId = ProblemId;
type SiteAnswerId = "generic" | "institutional" | "specific";
type ServiceAnswerId = "detailed" | "hello" | "emoji";
type OperationOrderId = "late" | "blocked" | "healthy";

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

type Choice<T extends string> = {
  id: T;
  title: string;
  text: string;
  note: string;
  score: number;
  feedback: string;
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

const challengeOrder: ChallengeId[] = ["site", "service", "operation"];

const siteChoices: Choice<SiteAnswerId>[] = [
  {
    id: "generic",
    title: "Clique aqui",
    text: "Um botão genérico, sem explicar o destino ou o benefício.",
    note: "Baixa clareza",
    score: 38,
    feedback: "O visitante precisa adivinhar o que acontece depois do clique. Isso aumenta a hesitação.",
  },
  {
    id: "institutional",
    title: "Conheça nossa loja",
    text: "Explica o destino, mas ainda não mostra qual produto ou ganho merece atenção.",
    note: "Clareza parcial",
    score: 68,
    feedback: "A ação está mais clara, porém continua distante da intenção de compra daquele momento.",
  },
  {
    id: "specific",
    title: "Ver kits mais vendidos",
    text: "Leva o cliente para uma seleção concreta, com menor esforço de decisão.",
    note: "Próximo passo claro",
    score: 95,
    feedback: "O botão combina ação, destino e interesse comercial. A jornada fica mais fácil de entender.",
  },
];

const serviceChoices: Array<
  Choice<ServiceAnswerId> & { sender: string; message: string }
> = [
  {
    id: "detailed",
    sender: "Marina",
    message: "Tenho uma loja de cosméticos, preciso melhorar meu site e quero lançar em 20 dias.",
    title: "Marina",
    text: "Mensagem detalhada",
    note: "Contexto + prazo + necessidade",
    score: 94,
    feedback: "A mensagem já revela negócio, necessidade e urgência. É a oportunidade com maior contexto comercial.",
  },
  {
    id: "hello",
    sender: "Contato novo",
    message: "Oi, queria saber mais.",
    title: "Contato novo",
    text: "Mensagem vaga",
    note: "Interesse sem contexto",
    score: 62,
    feedback: "Existe interesse, mas a conversa ainda precisa de triagem antes de consumir atendimento especializado.",
  },
  {
    id: "emoji",
    sender: "Instagram",
    message: "🔥🔥",
    title: "Instagram",
    text: "Reação sem contexto",
    note: "Engajamento, não intenção clara",
    score: 35,
    feedback: "A reação pode virar conversa, mas não deve passar na frente de uma oportunidade já contextualizada.",
  },
];

const operationOrders: Array<{
  id: OperationOrderId;
  title: string;
  detail: string;
  risk: string;
}> = [
  {
    id: "late",
    title: "Pedido #1842",
    detail: "Prazo venceu ontem. Cliente já perguntou pelo envio.",
    risk: "ATRASADO",
  },
  {
    id: "blocked",
    title: "Pedido #1857",
    detail: "Despacho vence hoje, mas um item está sem estoque.",
    risk: "BLOQUEADO",
  },
  {
    id: "healthy",
    title: "Pedido #1864",
    detail: "Pagamento aprovado agora. Prazo de despacho em dois dias.",
    risk: "NO PRAZO",
  },
];

const correctOperationOrder: OperationOrderId[] = ["late", "blocked", "healthy"];

function trackLab(eventName: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(
    new CustomEvent("ned:lab", {
      detail: { event_name: eventName, experiment: "maquina_quebrada", ...detail },
    }),
  );
}

function operationScore(order: OperationOrderId[]) {
  if (order.length !== correctOperationOrder.length) return 0;
  const correctPositions = order.reduce(
    (total, item, index) => total + (item === correctOperationOrder[index] ? 1 : 0),
    0,
  );

  if (correctPositions === 3) return 96;
  if (correctPositions === 1) return 66;
  return 42;
}

function scoreTone(score: number) {
  if (score >= 85) return challengeStyles.impactGood;
  if (score >= 60) return challengeStyles.impactMedium;
  return challengeStyles.impactRisk;
}

export default function BrokenMachineGame() {
  const [stage, setStage] = useState<Stage>("intro");
  const [discovered, setDiscovered] = useState<ProblemId[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [siteAnswer, setSiteAnswer] = useState<SiteAnswerId | null>(null);
  const [serviceAnswer, setServiceAnswer] = useState<ServiceAnswerId | null>(null);
  const [operationOrder, setOperationOrder] = useState<OperationOrderId[]>([]);

  const activeChallenge = challengeOrder[challengeIndex];
  const selectedSite = siteChoices.find((choice) => choice.id === siteAnswer) ?? null;
  const selectedService =
    serviceChoices.find((choice) => choice.id === serviceAnswer) ?? null;
  const operationResultScore = operationScore(operationOrder);

  const result = useMemo(() => {
    const scores = {
      offer: selectedSite?.score ?? 0,
      service: selectedService?.score ?? 0,
      operation: operationResultScore,
    };
    const automation = Math.round((scores.service * 0.4 + scores.operation * 0.6) * 0.92);
    const total = Math.round(
      (scores.offer + scores.service + scores.operation + automation) / 4,
    );
    const metricEntries = [
      ["Oferta", scores.offer],
      ["Atendimento", scores.service],
      ["Operação", scores.operation],
      ["Automação", automation],
    ] as const;
    const bottleneck = [...metricEntries].sort((a, b) => a[1] - b[1])[0];

    let profile = {
      name: "O Acelerador",
      text: "Você busca movimento rápido, mas ainda pode estar priorizando ação antes de clareza e processo.",
    };

    if (total >= 85) {
      profile = {
        name: "O Estrategista",
        text: "Você conecta oferta, contexto e prioridade. O próximo passo é transformar essas decisões em um sistema repetível.",
      };
    } else if (bottleneck[0] === "Operação" || bottleneck[0] === "Automação") {
      profile = {
        name: "O Bombeiro",
        text: "Você enxerga oportunidades, mas a operação ainda pode obrigar sua equipe a resolver tudo no modo urgência.",
      };
    } else if (bottleneck[0] === "Oferta") {
      profile = {
        name: "O Operador",
        text: "Você organiza bem o que acontece por trás, mas pode estar dificultando a entrada do cliente na jornada.",
      };
    }

    return { scores: { ...scores, automation }, total, profile, bottleneck };
  }, [operationResultScore, selectedService, selectedSite]);

  const currentAnswerScore =
    activeChallenge === "site"
      ? selectedSite?.score ?? 0
      : activeChallenge === "service"
        ? selectedService?.score ?? 0
        : operationResultScore;

  const canContinue =
    activeChallenge === "site"
      ? Boolean(siteAnswer)
      : activeChallenge === "service"
        ? Boolean(serviceAnswer)
        : operationOrder.length === operationOrders.length;

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

  const beginChallenges = () => {
    setActiveProblem(null);
    setChallengeIndex(0);
    setStage("challenge");
    trackLab("challenge_sequence_started");
  };

  const completeCurrentChallenge = () => {
    if (!canContinue) return;

    trackLab("challenge_completed", {
      challenge: activeChallenge,
      score: currentAnswerScore,
      answer:
        activeChallenge === "site"
          ? siteAnswer
          : activeChallenge === "service"
            ? serviceAnswer
            : operationOrder.join(","),
    });

    if (challengeIndex < challengeOrder.length - 1) {
      setChallengeIndex((current) => current + 1);
      return;
    }

    setStage("result");
    trackLab("game_completed", {
      score: result.total,
      offer_score: result.scores.offer,
      service_score: result.scores.service,
      operation_score: result.scores.operation,
      automation_score: result.scores.automation,
      profile: result.profile.name,
      bottleneck: result.bottleneck[0],
    });
  };

  const goBackChallenge = () => {
    if (challengeIndex === 0) {
      setStage("scene");
      return;
    }
    setChallengeIndex((current) => current - 1);
  };

  const chooseOperationPriority = (id: OperationOrderId) => {
    setOperationOrder((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const restart = () => {
    setDiscovered([]);
    setActiveProblem(null);
    setChallengeIndex(0);
    setSiteAnswer(null);
    setServiceAnswer(null);
    setOperationOrder([]);
    setStage("scene");
    trackLab("game_restarted");
  };

  const whatsappMessage = [
    "Olá, Ned! Joguei A Máquina Quebrada no NED LAB.",
    `Meu resultado foi ${result.total}% e meu perfil foi ${result.profile.name}.`,
    `Meu maior gargalo na simulação foi ${result.bottleneck[0]}.`,
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
                Esta empresa parece estar funcionando. Encontre três gargalos e tome decisões
                sobre oferta, atendimento e operação.
              </p>
              <div className={styles.introMeta}>
                <span>01 empresa</span>
                <span>03 gargalos</span>
                <span>03 decisões</span>
                <span>~03 minutos</span>
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
                  Observe o ambiente. Depois de encontrar os três pontos, você precisará tomar
                  uma decisão em cada área.
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
                  onClick={beginChallenges}
                >
                  Tomar as decisões <ArrowRight size={18} />
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
            key={`challenge-${activeChallenge}`}
            className={styles.challengeSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className={challengeStyles.challengeProgress}>
              {challengeOrder.map((challenge, index) => (
                <div
                  key={challenge}
                  className={index <= challengeIndex ? challengeStyles.stepActive : ""}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>
                    {challenge === "site"
                      ? "Oferta"
                      : challenge === "service"
                        ? "Atendimento"
                        : "Operação"}
                  </strong>
                  <i />
                </div>
              ))}
            </div>

            {activeChallenge === "site" && (
              <div className={challengeStyles.challengeBody}>
                <div className={styles.challengeHeader}>
                  <span className={styles.kicker}>DECISÃO 01 / SITE E OFERTA</span>
                  <h1>Qual botão facilita a próxima ação?</h1>
                  <p>
                    A loja está anunciando kits de cosméticos. Escolha o CTA que reduz dúvida e
                    aproxima o visitante da compra.
                  </p>
                </div>

                <div className={challengeStyles.siteWorkspace}>
                  <div className={challengeStyles.sitePreview}>
                    <div className={challengeStyles.browserBar}>
                      <span /> <span /> <span />
                      <strong>lojabeleza.com</strong>
                    </div>
                    <div className={challengeStyles.previewContent}>
                      <small>NOVA COLEÇÃO</small>
                      <h2>Cuidados que cabem na sua rotina.</h2>
                      <p>Kits selecionados para começar sem complicação.</p>
                      <div className={challengeStyles.previewButton}>
                        {selectedSite?.title ?? "ESCOLHA UM BOTÃO"}
                      </div>
                    </div>
                  </div>

                  <div className={challengeStyles.choiceGrid}>
                    {siteChoices.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        className={siteAnswer === choice.id ? challengeStyles.choiceSelected : ""}
                        onClick={() => {
                          setSiteAnswer(choice.id);
                          trackLab("challenge_answer_selected", {
                            challenge: "site",
                            answer: choice.id,
                          });
                        }}
                      >
                        <span>{choice.note}</span>
                        <strong>{choice.title}</strong>
                        <p>{choice.text}</p>
                        <i>{siteAnswer === choice.id ? <Check size={16} /> : ""}</i>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSite && (
                  <div className={`${challengeStyles.impactPanel} ${scoreTone(selectedSite.score)}`}>
                    <div>
                      <span>IMPACTO DA ESCOLHA</span>
                      <strong>{selectedSite.score}%</strong>
                    </div>
                    <p>{selectedSite.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {activeChallenge === "service" && (
              <div className={challengeStyles.challengeBody}>
                <div className={styles.challengeHeader}>
                  <span className={styles.kicker}>DECISÃO 02 / ATENDIMENTO</span>
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
                    {serviceChoices.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={serviceAnswer === item.id}
                        className={serviceAnswer === item.id ? styles.messageSelected : ""}
                        onClick={() => {
                          setServiceAnswer(item.id);
                          trackLab("challenge_answer_selected", {
                            challenge: "service",
                            answer: item.id,
                          });
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
                        <span className={styles.radioMark}>
                          {serviceAnswer === item.id ? <Check size={16} /> : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedService && (
                  <div className={`${challengeStyles.impactPanel} ${scoreTone(selectedService.score)}`}>
                    <div>
                      <span>IMPACTO DA ESCOLHA</span>
                      <strong>{selectedService.score}%</strong>
                    </div>
                    <p>{selectedService.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {activeChallenge === "operation" && (
              <div className={challengeStyles.challengeBody}>
                <div className={styles.challengeHeader}>
                  <span className={styles.kicker}>DECISÃO 03 / OPERAÇÃO</span>
                  <h1>Organize a fila de prioridade.</h1>
                  <p>
                    Toque nos pedidos na ordem em que a equipe deve agir. Você pode tocar novamente
                    para retirar um item da sequência.
                  </p>
                </div>

                <div className={challengeStyles.operationWorkspace}>
                  <div className={challengeStyles.orderPool}>
                    {operationOrders.map((order) => {
                      const priority = operationOrder.indexOf(order.id);
                      return (
                        <button
                          key={order.id}
                          type="button"
                          className={priority >= 0 ? challengeStyles.orderSelected : ""}
                          onClick={() => chooseOperationPriority(order.id)}
                        >
                          <span className={challengeStyles.priorityBadge}>
                            {priority >= 0 ? priority + 1 : "—"}
                          </span>
                          <div>
                            <small>{order.risk}</small>
                            <strong>{order.title}</strong>
                            <p>{order.detail}</p>
                          </div>
                          <i>{priority >= 0 ? <Check size={17} /> : <ArrowRight size={17} />}</i>
                        </button>
                      );
                    })}
                  </div>

                  <aside className={challengeStyles.priorityQueue}>
                    <span>FILA DEFINIDA</span>
                    <h2>{operationOrder.length} / 3</h2>
                    <div>
                      {[0, 1, 2].map((position) => {
                        const orderId = operationOrder[position];
                        const order = operationOrders.find((item) => item.id === orderId);
                        return (
                          <div key={position}>
                            <span>{position + 1}</span>
                            <strong>{order?.title ?? "Aguardando escolha"}</strong>
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" onClick={() => setOperationOrder([])} disabled={!operationOrder.length}>
                      Limpar sequência
                    </button>
                  </aside>
                </div>

                {operationOrder.length === operationOrders.length && (
                  <div className={`${challengeStyles.impactPanel} ${scoreTone(operationResultScore)}`}>
                    <div>
                      <span>IMPACTO DA SEQUÊNCIA</span>
                      <strong>{operationResultScore}%</strong>
                    </div>
                    <p>
                      {operationResultScore >= 85
                        ? "Você tratou primeiro o cliente já afetado, depois o bloqueio com prazo imediato e deixou o pedido saudável por último."
                        : operationResultScore >= 60
                          ? "Sua fila identifica parte do risco, mas ainda pode deixar um cliente afetado ou um bloqueio crítico esperando."
                          : "A ordem prioriza movimento em vez de risco. Prazos vencidos e bloqueios precisam aparecer antes dos pedidos saudáveis."}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className={`${styles.challengeActions} ${challengeStyles.challengeActions}`}>
              <button className={styles.textButton} type="button" onClick={goBackChallenge}>
                <ArrowLeft size={17} /> {challengeIndex === 0 ? "Voltar à empresa" : "Decisão anterior"}
              </button>
              <button
                className={styles.primaryButton}
                type="button"
                disabled={!canContinue}
                onClick={completeCurrentChallenge}
              >
                {challengeIndex === challengeOrder.length - 1 ? "Ver diagnóstico" : "Próxima decisão"}
                <ArrowRight size={18} />
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
                <span className={styles.kicker}>RESULTADO DAS 03 DECISÕES</span>
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
                <p>
                  Seu maior gargalo nesta partida foi <strong>{result.bottleneck[0]}</strong>, com
                  {` ${result.bottleneck[1]}%`}. O diagnóstico agora considera todas as escolhas feitas.
                </p>
              </article>

              <article className={styles.metricsCard}>
                <span>DIAGNÓSTICO DA PARTIDA</span>
                {[
                  ["Clareza da oferta", result.scores.offer],
                  ["Atendimento", result.scores.service],
                  ["Operação", result.scores.operation],
                  ["Prontidão para automação", result.scores.automation],
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

            <div className={challengeStyles.decisionRecap}>
              <span>COMO VOCÊ DECIDIU</span>
              <div>
                <article>
                  <small>OFERTA</small>
                  <strong>{selectedSite?.title}</strong>
                  <p>{selectedSite?.feedback}</p>
                </article>
                <article>
                  <small>ATENDIMENTO</small>
                  <strong>{selectedService?.sender}</strong>
                  <p>{selectedService?.feedback}</p>
                </article>
                <article>
                  <small>OPERAÇÃO</small>
                  <strong>{operationOrders.find((item) => item.id === operationOrder[0])?.title}</strong>
                  <p>Foi o primeiro item da fila definida por você.</p>
                </article>
              </div>
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
