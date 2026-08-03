"use client";

import { ArrowRight, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import DiagnosticForm from "../components/diagnostic-form";
import styles from "../commercial.module.css";

type ScoreQuestion = {
  category: string;
  title: string;
  description: string;
  recommendation: string;
};

const questions: ScoreQuestion[] = [
  {
    category: "Oferta",
    title: "Um visitante entende rapidamente o que sua empresa vende e por que deveria escolher você?",
    description: "Considere site, bio, destaques, anúncios e mensagens comerciais.",
    recommendation: "Organize uma oferta principal com problema, solução, diferenciais e próximo passo claros.",
  },
  {
    category: "Presença digital",
    title: "Sua empresa possui uma página profissional, rápida e adaptada ao celular?",
    description: "Um perfil social sozinho nem sempre explica o serviço, responde dúvidas ou captura contexto.",
    recommendation: "Crie uma landing page comercial que concentre oferta, confiança, dúvidas e contato.",
  },
  {
    category: "Captação",
    title: "Quem demonstra interesse encontra um caminho simples para iniciar uma conversa?",
    description: "Avalie quantidade de cliques, links confusos e mensagens sem contexto.",
    recommendation: "Reduza etapas e use CTAs específicos com WhatsApp contextualizado ou formulário curto.",
  },
  {
    category: "Atendimento",
    title: "Novos contatos recebem resposta rápida e seguem um roteiro de qualificação?",
    description: "Responder não é apenas dizer olá: é entender necessidade, momento e próximo passo.",
    recommendation: "Defina tempo de resposta, perguntas essenciais e modelos de conversa por tipo de lead.",
  },
  {
    category: "Follow-up",
    title: "Sua equipe sabe quais oportunidades precisam de retorno e quando agir novamente?",
    description: "Considere propostas, reuniões, pessoas que sumiram e contatos que ainda não decidiram.",
    recommendation: "Use um pipeline com status, histórico, data de retorno e motivo de perda.",
  },
  {
    category: "Dados",
    title: "Você consegue identificar de onde vieram os contatos e quais canais geram oportunidades melhores?",
    description: "Curtidas e acessos isolados não mostram o que realmente virou conversa ou venda.",
    recommendation: "Configure UTMs, analytics e registro de origem dentro do CRM.",
  },
  {
    category: "Automação",
    title: "Tarefas repetitivas de atendimento e operação já foram mapeadas ou automatizadas?",
    description: "Pense em copiar dados, organizar pedidos, responder perguntas e atualizar planilhas.",
    recommendation: "Mapeie primeiro o processo e automatize apenas tarefas estáveis e mensuráveis.",
  },
  {
    category: "Evolução",
    title: "A estrutura comercial é revisada com base em dados e feedback dos clientes?",
    description: "Publicar uma página ou campanha é o início; a melhoria depende de acompanhamento.",
    recommendation: "Crie uma rotina mensal de revisão de conversão, gargalos, objeções e próximos testes.",
  },
];

const options = [
  { label: "Não existe ou não sabemos", value: 0 },
  { label: "Existe, mas funciona mal", value: 1 },
  { label: "Funciona parcialmente", value: 2 },
  { label: "Está bem estruturado", value: 3 },
];

function profile(score: number) {
  if (score >= 80) return "Estrutura pronta para otimizar";
  if (score >= 60) return "Boa base com gargalos visíveis";
  if (score >= 40) return "Operação com vazamentos comerciais";
  return "Máquina comercial quebrada";
}

export default function ScoreExperience() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const completed = answers.length === questions.length;

  const result = useMemo(() => {
    if (!completed) return null;
    const total = answers.reduce((sum, answer) => sum + answer, 0);
    const score = Math.round((total / (questions.length * 3)) * 100);
    const ranked = questions
      .map((question, index) => ({ ...question, value: answers[index] }))
      .sort((a, b) => a.value - b.value);
    return {
      score,
      profile: profile(score),
      bottleneck: ranked[0],
      recommendations: ranked.slice(0, 3),
    };
  }, [answers, completed]);

  const choose = (value: number) => {
    const next = [...answers, value];
    setAnswers(next);
    if (next.length < questions.length) setStep(next.length);
    window.dispatchEvent(
      new CustomEvent("ned:score", {
        detail: { event_name: "answer", question: questions[step].category, value },
      }),
    );
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  if (result) {
    return (
      <>
        <div className={styles.scoreShell}>
          <div className={styles.scoreResult}>
            <div className={styles.scoreNumber}>
              <div>
                <strong>{result.score}</strong>
                <span>NED SCORE / 100</span>
              </div>
            </div>
            <div className={styles.scoreDetails}>
              <span className={styles.eyebrow}>SEU RESULTADO</span>
              <h2>{result.profile}</h2>
              <p>
                Principal gargalo identificado: <strong>{result.bottleneck.category}</strong>. Esta pontuação é uma estimativa baseada nas respostas e não representa promessa de faturamento ou resultado comercial.
              </p>
              <div className={styles.recommendations}>
                {result.recommendations.map((item, index) => (
                  <div className={styles.recommendation} key={item.category}>
                    <strong>{String(index + 1).padStart(2, "0")} — {item.category}</strong><br />
                    {item.recommendation}
                  </div>
                ))}
              </div>
              <div className={styles.heroActions}>
                <a className={styles.primary} href="#conversar-score">
                  Transformar resultado em plano <ArrowRight size={15} />
                </a>
                <button className={styles.secondary} type="button" onClick={restart}>
                  <RotateCcw size={15} /> Refazer
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.formSection} id="conversar-score">
          <div className={styles.formIntro}>
            <span className={styles.eyebrow}>CONVERSA COM CONTEXTO</span>
            <h2>Leve seu Score para uma <span>análise real.</span></h2>
            <p>
              O resultado será enviado junto com o diagnóstico. A NED consegue entender a pontuação, o principal gargalo e o momento do projeto antes da conversa começar.
            </p>
          </div>
          <DiagnosticForm
            source="ned_score"
            presetService="NED Score e estratégia"
            context={{
              ned_score: result.score,
              score_profile: result.profile,
              main_bottleneck: result.bottleneck.category,
              lowest_categories: result.recommendations.map((item) => item.category).join(", "),
            }}
          />
        </section>
      </>
    );
  }

  const question = questions[step];
  return (
    <div className={styles.scoreShell}>
      <div>
        <span className={styles.eyebrow}>ETAPA {String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ width: `${(answers.length / questions.length) * 100}%` }} />
        </div>
      </div>
      <div className={styles.scoreQuestion}>
        <Target size={26} />
        <h2>{question.title}</h2>
        <p>{question.description}</p>
      </div>
      <div className={styles.answerGrid}>
        {options.map((option) => (
          <button className={styles.answerButton} type="button" key={option.value} onClick={() => choose(option.value)}>
            <strong>{option.label}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
