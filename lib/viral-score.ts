import type { SocialFormat } from "@/lib/social-types";
import type { ViralChecklist } from "@/lib/viral-types";

const HASHTAG_PATTERN = /#[\p{L}\p{N}_]+/gu;
const CTA_PATTERN = /(comente|salve|compartilhe|envie|clique|acesse|chame|responda|marque|siga|descubra)/i;
const HOOK_PATTERN = /(você|ninguém|pare de|antes de|o erro|segredo|como|por que|não faça|isso muda|3 |5 |7 )/i;

export function scoreViralContent(input: {
  format: SocialFormat;
  caption: string;
  hashtags?: string[];
  cta?: string;
}): { score: number; checklist: ViralChecklist; improvements: string[] } {
  const caption = input.caption.trim();
  const words = caption.split(/\s+/).filter(Boolean);
  const firstLine = caption.split("\n").find((line) => line.trim())?.trim() ?? "";
  const hashtags = input.hashtags?.length
    ? input.hashtags
    : caption.match(HASHTAG_PATTERN) ?? [];
  const explicitCta = input.cta?.trim() ?? "";

  const hook = Math.min(
    20,
    (firstLine.length >= 12 && firstLine.length <= 95 ? 10 : 4) +
      (HOOK_PATTERN.test(firstLine) ? 7 : 2) +
      (/[?!:]/.test(firstLine) ? 3 : 1),
  );

  const clarity = Math.min(
    15,
    (words.length >= 18 ? 5 : 2) +
      (caption.includes("\n") ? 4 : 2) +
      (caption.length <= 1800 ? 4 : 1) +
      (firstLine.length <= 110 ? 2 : 0),
  );

  const retentionSignals = (caption.match(/\n/g)?.length ?? 0) +
    (caption.match(/[•—\-]\s/g)?.length ?? 0) +
    (caption.match(/\b(1|2|3|primeiro|depois|por fim)\b/gi)?.length ?? 0);
  const retention = Math.min(15, 5 + Math.min(8, retentionSignals * 2) + (words.length <= 260 ? 2 : 0));

  const valueSignals = caption.match(/\b(aprenda|entenda|passo|dica|exemplo|resultado|evite|melhore|transforme|estratégia)\b/gi)?.length ?? 0;
  const value = Math.min(15, 5 + Math.min(8, valueSignals * 2) + (caption.length >= 180 ? 2 : 0));

  const interaction = Math.min(
    10,
    (/[?]/.test(caption) ? 4 : 1) +
      (/(comente|compartilhe|marque|responda)/i.test(caption) ? 4 : 1) +
      (/(você|seu|sua)/i.test(caption) ? 2 : 1),
  );

  const cta = Math.min(10, CTA_PATTERN.test(`${caption} ${explicitCta}`) ? 10 : explicitCta ? 7 : 2);

  const formatTargets: Record<SocialFormat, [number, number]> = {
    feed: [70, 1900],
    carousel: [120, 2200],
    reel: [45, 1300],
    story: [8, 420],
  };
  const [minimum, maximum] = formatTargets[input.format];
  const formatFit = caption.length >= minimum && caption.length <= maximum ? 5 : 2;

  const averageWordLength = words.length
    ? words.reduce((sum, word) => sum + word.replace(/[^\p{L}\p{N}]/gu, "").length, 0) / words.length
    : 0;
  const readability = Math.min(
    5,
    (averageWordLength > 0 && averageWordLength <= 7 ? 3 : 1) +
      (firstLine.length <= 95 ? 2 : 1),
  );

  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));
  const hashtagScore = uniqueHashtags.size >= 3 && uniqueHashtags.size <= 12 ? 5 : uniqueHashtags.size ? 3 : 0;

  const checklist: ViralChecklist = {
    hook,
    clarity,
    retention,
    value,
    interaction,
    cta,
    formatFit,
    readability,
    hashtags: hashtagScore,
  };

  const score = Math.max(0, Math.min(100, Object.values(checklist).reduce((sum, value) => sum + value, 0)));
  const improvements: string[] = [];
  if (hook < 15) improvements.push("Fortaleça a primeira linha com curiosidade, contraste ou promessa específica.");
  if (clarity < 11) improvements.push("Quebre o texto em blocos menores e deixe a ideia principal mais direta.");
  if (retention < 11) improvements.push("Use progressão, lista ou microviradas para sustentar a leitura.");
  if (value < 11) improvements.push("Inclua uma orientação prática, exemplo ou transformação concreta.");
  if (interaction < 7) improvements.push("Adicione uma pergunta ou motivo real para comentar e compartilhar.");
  if (cta < 8) improvements.push("Finalize com uma única ação clara para o público executar.");
  if (formatFit < 5) improvements.push(`Ajuste o tamanho e o ritmo da legenda para o formato ${input.format}.`);
  if (hashtagScore < 5) improvements.push("Use entre 3 e 12 hashtags específicas, evitando termos genéricos demais.");

  return { score, checklist, improvements: improvements.slice(0, 5) };
}
