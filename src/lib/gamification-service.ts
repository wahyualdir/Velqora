"use client";

import { getActiveUserIdentifier } from "./bookmark-service";

export interface UserRewardState {
  exp: number;
  streakDays: number;
  lastLoginDate: string;
  unlockedRewards: string[];
}

export function getGamificationStorageKey(): string {
  const user = getActiveUserIdentifier();
  return `velqora_gamification_user_${user}`;
}

export function getGamificationState(): UserRewardState {
  if (typeof window === "undefined") {
    return {
      exp: 0,
      streakDays: 0,
      lastLoginDate: new Date().toISOString().split("T")[0],
      unlockedRewards: [],
    };
  }

  const key = getGamificationStorageKey();
  const stored = localStorage.getItem(key);
  if (!stored) {
    const initialState: UserRewardState = {
      exp: 0,
      streakDays: 0,
      lastLoginDate: new Date().toISOString().split("T")[0],
      unlockedRewards: [],
    };
    localStorage.setItem(key, JSON.stringify(initialState));
    return initialState;
  }

  try {
    return JSON.parse(stored) as UserRewardState;
  } catch (err) {
    return {
      exp: 0,
      streakDays: 0,
      lastLoginDate: new Date().toISOString().split("T")[0],
      unlockedRewards: [],
    };
  }
}

export function saveGamificationState(state: UserRewardState): void {
  if (typeof window === "undefined") return;
  const key = getGamificationStorageKey();
  localStorage.setItem(key, JSON.stringify(state));
}

export function addEXP(amount: number): { newEXP: number; levelUp: boolean; newLevelTitle: string } {
  const state = getGamificationState();
  const oldLevel = getLevelInfo(state.exp);
  
  state.exp += amount;
  saveGamificationState(state);
  
  const newLevel = getLevelInfo(state.exp);
  const levelUp = newLevel.level > oldLevel.level;

  return {
    newEXP: state.exp,
    levelUp,
    newLevelTitle: newLevel.title,
  };
}

export interface LevelInfo {
  level: number;
  title: string;
  minEXP: number;
  maxEXP: number;
}

export function getLevelInfo(exp: number): LevelInfo {
  if (exp < 200) {
    return { level: 1, title: "Level 1 Pemula", minEXP: 0, maxEXP: 200 };
  } else if (exp < 500) {
    return { level: 2, title: "Level 2 Pelajar Aktif", minEXP: 200, maxEXP: 500 };
  } else if (exp < 1000) {
    return { level: 3, title: "Level 3 AI Explorer", minEXP: 500, maxEXP: 1000 };
  } else if (exp < 2000) {
    return { level: 4, title: "Level 4 Master Pemrograman", minEXP: 1000, maxEXP: 2000 };
  } else {
    return { level: 5, title: "Level 5 Legend Velqora", minEXP: 2000, maxEXP: 5000 };
  }
}

export interface RewardItem {
  id: string;
  title: string;
  costEXP: number;
  description: string;
  category: "feature" | "badge" | "certificate";
}

export const REWARD_STORE_ITEMS: RewardItem[] = [
  {
    id: "r1",
    title: "Akses AI Premium 1 Hari",
    costEXP: 300,
    description: "Buka fitur Gemini 1.5 dan Claude AI multimodal tanpa batas selama 24 jam",
    category: "feature",
  },
  {
    id: "r2",
    title: "Lencana Eksklusif Quiz Master",
    costEXP: 250,
    description: "Sematan lencana emas Quiz Master pada profil belajar Anda",
    category: "badge",
  },
  {
    id: "r3",
    title: "Sertifikat Kelulusan Belajar PDF",
    costEXP: 500,
    description: "Cetak sertifikat digital resmi dengan QR code verifikasi",
    category: "certificate",
  },
  {
    id: "r4",
    title: "Tema Warna Kustom Emerald",
    costEXP: 200,
    description: "Ubah aksen tampilan dashboard menjadi warna Cyber Emerald",
    category: "feature",
  },
];
