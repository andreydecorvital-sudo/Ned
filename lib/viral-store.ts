import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import type {
  GeneratedViralContent,
  ViralDashboardData,
  ViralIdea,
  ViralMission,
  ViralMissionCategory,
  ViralProfile,
  ViralStats,
} from "@/lib/viral-types";
import type { SocialFormat } from "@/lib/social-types";

const PROFILE_ID = "ned-main";

type ProfileRow = {
  instagram_handle: string;
  niche: string;
  audience: string;
  tone: string;
  objective: string;
  content_pillars: string[] | string | null;
  updated_at: string | Date | null;
};

type MissionRow = {
  id: string;
  code: string;
  title: string;
  description: string;
  points: number | string;
  category: ViralMissionCategory;
  completed: boolean | null;
  completed_at: string | Date | null;
};

type IdeaRow = {
  id: string;
  title: string;
  format: SocialFormat;
  topic: string;
  goal: string;
  caption: string;
  hashtags: string[] | string;
  hooks: string[] | string;
  cta: string;
  first_comment: string;
  score: number | string;
  checklist: ViralIdea["checklist"] | string;
  provider: ViralIdea["provider"];
  created_at: string | Date;
  updated_at: string | Date;
};

let schemaReady: Promise<void> | null = null;

function connectionString() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.NEON_DATABASE_URL ??
    ""
  ).trim();
}

export function isViralDatabaseConfigured() {
  return Boolean(connectionString());
}

function database() {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

function iso(value: string | Date | null) {
  return value ? new Date(value).toISOString() : null;
}

function parseJson<T>(value: T | string | null, fallback: T): T {
  if (value === null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const missionSeeds = [
  ["strategy-focus", "Defina o foco do dia", "Escolha um tema ligado ao objetivo principal da conta.", 10, "strategy", 1],
  ["strong-hook", "Crie um gancho forte", "Produza ou gere uma abertura que pare a rolagem sem usar promessa enganosa.", 20, "creation", 2],
  ["publish-ready", "Prepare uma publicação", "Leve uma ideia até o checklist e deixe o conteúdo pronto para o estúdio.", 30, "distribution", 3],
  ["real-conversation", "Estimule uma conversa", "Inclua uma pergunta ou CTA que convide o público a participar.", 15, "engagement", 4],
  ["learn-from-data", "Registre um aprendizado", "Revise um conteúdo anterior e anote o que deve ser repetido ou evitado.", 25, "analysis", 5],
] as const;

export async function ensureViralSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const sql = database();
    await sql`
      CREATE TABLE IF NOT EXISTS ned_viral_profiles (
        id text PRIMARY KEY,
        instagram_handle varchar(120) NOT NULL DEFAULT '',
        niche varchar(180) NOT NULL DEFAULT '',
        audience text NOT NULL DEFAULT '',
        tone varchar(180) NOT NULL DEFAULT 'claro, humano e estratégico',
        objective text NOT NULL DEFAULT 'crescimento e geração de oportunidades',
        content_pillars jsonb NOT NULL DEFAULT '[]'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS ned_viral_missions (
        id text PRIMARY KEY,
        code varchar(80) UNIQUE NOT NULL,
        title varchar(180) NOT NULL,
        description text NOT NULL,
        points integer NOT NULL,
        category varchar(40) NOT NULL,
        sort_order integer NOT NULL DEFAULT 0,
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS ned_viral_mission_progress (
        mission_id text NOT NULL REFERENCES ned_viral_missions(id) ON DELETE CASCADE,
        mission_date date NOT NULL,
        completed boolean NOT NULL DEFAULT false,
        completed_at timestamptz,
        PRIMARY KEY (mission_id, mission_date)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS ned_viral_ideas (
        id text PRIMARY KEY,
        title varchar(160) NOT NULL,
        format varchar(24) NOT NULL,
        topic text NOT NULL,
        goal text NOT NULL DEFAULT '',
        caption text NOT NULL,
        hashtags jsonb NOT NULL DEFAULT '[]'::jsonb,
        hooks jsonb NOT NULL DEFAULT '[]'::jsonb,
        cta text NOT NULL DEFAULT '',
        first_comment text NOT NULL DEFAULT '',
        score integer NOT NULL DEFAULT 0,
        checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
        provider varchar(24) NOT NULL DEFAULT 'manual',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS ned_viral_ideas_created_idx ON ned_viral_ideas (created_at DESC)`;

    await sql`
      INSERT INTO ned_viral_profiles (id)
      VALUES (${PROFILE_ID})
      ON CONFLICT (id) DO NOTHING
    `;

    for (const [code, title, description, points, category, sortOrder] of missionSeeds) {
      await sql`
        INSERT INTO ned_viral_missions (
          id, code, title, description, points, category, sort_order
        ) VALUES (
          ${randomUUID()}, ${code}, ${title}, ${description}, ${points}, ${category}, ${sortOrder}
        )
        ON CONFLICT (code) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          points = EXCLUDED.points,
          category = EXCLUDED.category,
          sort_order = EXCLUDED.sort_order,
          active = true
      `;
    }
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });

  return schemaReady;
}

function mapProfile(row: ProfileRow | undefined): ViralProfile {
  return {
    instagramHandle: row?.instagram_handle ?? "",
    niche: row?.niche ?? "",
    audience: row?.audience ?? "",
    tone: row?.tone ?? "claro, humano e estratégico",
    objective: row?.objective ?? "crescimento e geração de oportunidades",
    contentPillars: parseJson(row?.content_pillars ?? null, [] as string[]),
    updatedAt: iso(row?.updated_at ?? null),
  };
}

function mapMission(row: MissionRow): ViralMission {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    points: Number(row.points),
    category: row.category,
    completed: Boolean(row.completed),
    completedAt: iso(row.completed_at),
  };
}

function mapIdea(row: IdeaRow): ViralIdea {
  return {
    id: row.id,
    title: row.title,
    format: row.format,
    topic: row.topic,
    goal: row.goal,
    caption: row.caption,
    hashtags: parseJson(row.hashtags, [] as string[]),
    hooks: parseJson(row.hooks, [] as string[]),
    cta: row.cta,
    firstComment: row.first_comment,
    score: Number(row.score),
    checklist: parseJson(row.checklist, {
      hook: 0,
      clarity: 0,
      retention: 0,
      value: 0,
      interaction: 0,
      cta: 0,
      formatFit: 0,
      readability: 0,
      hashtags: 0,
    }),
    provider: row.provider,
    createdAt: iso(row.created_at) ?? new Date().toISOString(),
    updatedAt: iso(row.updated_at) ?? new Date().toISOString(),
  };
}

function calculateStreak(dates: string[]) {
  const completed = new Set(dates.map((date) => date.slice(0, 10)));
  let cursor = new Date();
  let streak = 0;
  while (streak < 365) {
    const key = cursor.toISOString().slice(0, 10);
    if (!completed.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function getViralDashboardData(): Promise<Omit<ViralDashboardData, "configuration">> {
  await ensureViralSchema();
  const sql = database();
  const [profileRows, missionRows, ideaRows, streakRows] = await Promise.all([
    sql`SELECT * FROM ned_viral_profiles WHERE id = ${PROFILE_ID} LIMIT 1`,
    sql`
      SELECT
        mission.*,
        COALESCE(progress.completed, false) AS completed,
        progress.completed_at
      FROM ned_viral_missions mission
      LEFT JOIN ned_viral_mission_progress progress
        ON progress.mission_id = mission.id
       AND progress.mission_date = CURRENT_DATE
      WHERE mission.active = true
      ORDER BY mission.sort_order, mission.created_at
    `,
    sql`SELECT * FROM ned_viral_ideas ORDER BY created_at DESC LIMIT 80`,
    sql`
      SELECT DISTINCT mission_date::text AS day
      FROM ned_viral_mission_progress
      WHERE completed = true
        AND mission_date >= CURRENT_DATE - INTERVAL '40 days'
      ORDER BY day DESC
    `,
  ]);

  const profile = mapProfile((profileRows as ProfileRow[])[0]);
  const missions = (missionRows as MissionRow[]).map(mapMission);
  const ideas = (ideaRows as IdeaRow[]).map(mapIdea);
  const completedMissions = missions.filter((mission) => mission.completed);
  const totalPoints = missions.reduce((sum, mission) => sum + mission.points, 0);
  const missionPoints = completedMissions.reduce((sum, mission) => sum + mission.points, 0);
  const missionCompletion = totalPoints ? Math.round((missionPoints / totalPoints) * 100) : 0;
  const averageIdeaScore = ideas.length
    ? Math.round(ideas.reduce((sum, idea) => sum + idea.score, 0) / ideas.length)
    : 0;
  const viralScore = ideas.length
    ? Math.round(averageIdeaScore * 0.7 + missionCompletion * 0.3)
    : missionCompletion;
  const stats: ViralStats = {
    viralScore,
    missionCompletion,
    missionPoints,
    completedMissions: completedMissions.length,
    totalMissions: missions.length,
    ideasCount: ideas.length,
    averageIdeaScore,
    streakDays: calculateStreak((streakRows as Array<{ day: string }>).map((row) => row.day)),
  };

  return { profile, missions, ideas, stats };
}

export async function saveViralProfile(input: ViralProfile) {
  await ensureViralSchema();
  const sql = database();
  const pillars = JSON.stringify(input.contentPillars.slice(0, 8));
  const rows = await sql`
    UPDATE ned_viral_profiles
    SET
      instagram_handle = ${input.instagramHandle.slice(0, 120)},
      niche = ${input.niche.slice(0, 180)},
      audience = ${input.audience.slice(0, 1200)},
      tone = ${input.tone.slice(0, 180)},
      objective = ${input.objective.slice(0, 1200)},
      content_pillars = ${pillars}::jsonb,
      updated_at = now()
    WHERE id = ${PROFILE_ID}
    RETURNING *
  `;
  return mapProfile((rows as ProfileRow[])[0]);
}

export async function toggleViralMission(id: string, completed: boolean) {
  await ensureViralSchema();
  const sql = database();
  await sql`
    INSERT INTO ned_viral_mission_progress (
      mission_id, mission_date, completed, completed_at
    ) VALUES (
      ${id}, CURRENT_DATE, ${completed}, ${completed ? new Date().toISOString() : null}
    )
    ON CONFLICT (mission_id, mission_date) DO UPDATE SET
      completed = EXCLUDED.completed,
      completed_at = EXCLUDED.completed_at
  `;
}

export async function saveViralIdea(input: {
  format: SocialFormat;
  topic: string;
  goal: string;
  generated: GeneratedViralContent;
}) {
  await ensureViralSchema();
  const sql = database();
  const id = randomUUID();
  const rows = await sql`
    INSERT INTO ned_viral_ideas (
      id, title, format, topic, goal, caption, hashtags, hooks, cta,
      first_comment, score, checklist, provider
    ) VALUES (
      ${id},
      ${input.generated.title.slice(0, 160)},
      ${input.format},
      ${input.topic.slice(0, 1200)},
      ${input.goal.slice(0, 1200)},
      ${input.generated.caption.slice(0, 2200)},
      ${JSON.stringify(input.generated.hashtags)}::jsonb,
      ${JSON.stringify(input.generated.hooks)}::jsonb,
      ${input.generated.cta.slice(0, 600)},
      ${input.generated.firstComment.slice(0, 1200)},
      ${Math.max(0, Math.min(100, input.generated.score))},
      ${JSON.stringify(input.generated.checklist)}::jsonb,
      ${input.generated.provider}
    )
    RETURNING *
  `;
  return mapIdea((rows as IdeaRow[])[0]);
}

export async function deleteViralIdea(id: string) {
  await ensureViralSchema();
  const sql = database();
  const rows = await sql`DELETE FROM ned_viral_ideas WHERE id = ${id} RETURNING id`;
  return Boolean((rows as Array<{ id: string }>)[0]);
}
