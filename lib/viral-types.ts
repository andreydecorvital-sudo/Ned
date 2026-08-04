import type { SocialFormat } from "@/lib/social-types";

export const viralMissionCategories = [
  "strategy",
  "creation",
  "engagement",
  "distribution",
  "analysis",
] as const;

export type ViralMissionCategory = (typeof viralMissionCategories)[number];

export type ViralProfile = {
  instagramHandle: string;
  niche: string;
  audience: string;
  tone: string;
  objective: string;
  contentPillars: string[];
  updatedAt: string | null;
};

export type ViralMission = {
  id: string;
  code: string;
  title: string;
  description: string;
  points: number;
  category: ViralMissionCategory;
  completed: boolean;
  completedAt: string | null;
};

export type ViralChecklist = {
  hook: number;
  clarity: number;
  retention: number;
  value: number;
  interaction: number;
  cta: number;
  formatFit: number;
  readability: number;
  hashtags: number;
};

export type ViralIdea = {
  id: string;
  title: string;
  format: SocialFormat;
  topic: string;
  goal: string;
  caption: string;
  hashtags: string[];
  hooks: string[];
  cta: string;
  firstComment: string;
  score: number;
  checklist: ViralChecklist;
  provider: "gemini" | "fallback" | "manual";
  usedInStudio: boolean;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ViralStats = {
  viralScore: number;
  missionCompletion: number;
  missionPoints: number;
  completedMissions: number;
  totalMissions: number;
  ideasCount: number;
  averageIdeaScore: number;
  readyIdeas: number;
  studioTransfers: number;
  executionRate: number;
  profileCompleteness: number;
  streakDays: number;
};

export type ViralDashboardData = {
  profile: ViralProfile;
  missions: ViralMission[];
  ideas: ViralIdea[];
  stats: ViralStats;
  configuration: {
    database: boolean;
    gemini: boolean;
    studio: boolean;
  };
};

export type GeneratedViralContent = {
  title: string;
  hooks: string[];
  caption: string;
  hashtags: string[];
  cta: string;
  firstComment: string;
  score: number;
  checklist: ViralChecklist;
  improvements: string[];
  provider: "gemini" | "fallback";
};

export type ViralStudioDraft = {
  ideaId: string | null;
  accountName: string;
  format: SocialFormat;
  title: string;
  caption: string;
  hashtags: string[];
  firstComment: string;
  score: number;
  createdAt: string;
};
