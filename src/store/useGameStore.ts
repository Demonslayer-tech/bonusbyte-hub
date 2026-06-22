import { create } from 'zustand';

// Explicitly declare window types for the Telegram WebApp SDK inside this file
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

type ActivePage = 'tap' | 'earn' | 'airdrop' | 'user';

interface Referral {
  id: string;
  username: string;
  bonusEarned: number;
  date: string;
}

interface GameState {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  balance: number;
  energy: number;
  maxEnergy: number;
  tapMultiplier: number;
  multiversionLevel: number;
  energyLevel: number;
  lastDailyClaim: number | null;
  referralCode: string;
  referralCount: number;
  referralList: Referral[];
  userId: string;
  username: string;
  handleTap: () => void;
  regenerateEnergy: () => void;
  buyMultiplierUpgrade: () => void;
  buyEnergyUpgrade: () => void;
  claimDailyReward: () => boolean;
  syncWithCloud: () => Promise<void>;
  fetchFromCloud: (userId: string) => Promise<void>;
}

const API_BASE_URL = "https://bonusbyte-4hj6x7hfr-lucid-s-projects6.vercel.app";
let syncTimeout: number | null = null;

const tg = typeof window !== 'undefined' && window.Telegram?.WebApp;
const rawUser = tg?.initDataUnsafe?.user;

export const useGameStore = create<GameState>((set, get) => ({
  activePage: 'tap',
  balance: 1000, 
  energy: 1000,
  maxEnergy: 1000,
  tapMultiplier: 1,
  multiversionLevel: 1,
  energyLevel: 1,
  lastDailyClaim: null,
  referralCode: "BYTE_99X1Z",
  referralCount: 2,
  referralList: [
    { id: '1', username: 'ton_alpha', bonusEarned: 5000, date: '2026-06-14' },
    { id: '2', username: 'crypto_champ', bonusEarned: 5000, date: '2026-06-16' },
  ],
  userId: rawUser?.id ? `tg_${rawUser.id}` : "user_default_test",
  username: rawUser?.username || "Guest Player",

  setActivePage: (page) => set({ activePage: page }),
  
  handleTap: () => {
    set((state) => {
      if (state.energy >= state.tapMultiplier) {
        return { 
          balance: state.balance + state.tapMultiplier, 
          energy: state.energy - state.tapMultiplier 
        };
      }
      return {};
    });
    get().syncWithCloud();
  },
  
  regenerateEnergy: () => set((state) => ({
    energy: Math.min(state.maxEnergy, state.energy + (3 + state.energyLevel)),
  })),

  buyMultiplierUpgrade: () => {
    set((state) => {
      const cost = state.multiversionLevel * 500;
      if (state.balance >= cost) {
        return {
          balance: state.balance - cost,
          multiversionLevel: state.multiversionLevel + 1,
          tapMultiplier: state.tapMultiplier + 1
        };
      }
      return {};
    });
    get().syncWithCloud();
  },

  buyEnergyUpgrade: () => {
    set((state) => {
      const cost = state.energyLevel * 400;
      if (state.balance >= cost) {
        return {
          balance: state.balance - cost,
          energyLevel: state.energyLevel + 1,
          maxEnergy: state.maxEnergy + 500,
          energy: state.energy + 500
        };
      }
      return {};
    });
    get().syncWithCloud();
  },

  claimDailyReward: () => {
    const now = Date.now();
    const lastClaim = get().lastDailyClaim;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!lastClaim || now - lastClaim >= twentyFourHours) {
      set((state) => ({
        balance: state.balance + 5000,
        lastDailyClaim: now
      }));
      get().syncWithCloud();
      return true;
    }
    return false;
  },

  syncWithCloud: async () => {
    if (syncTimeout) window.clearTimeout(syncTimeout);

    syncTimeout = window.setTimeout(async () => {
      const { userId, balance, energy } = get();
      try {
        await fetch(`${API_BASE_URL}/api/user/${userId}/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance, energy })
        });
      } catch (err) {
        console.error("Cloud synchronization failed:", err);
      }
    }, 1500);
  },

  fetchFromCloud: async (targetId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        set({
          userId: targetId,
          balance: data.balance,
          energy: data.energy,
          maxEnergy: data.maxEnergy || 1000,
          tapMultiplier: data.tapMultiplier || 1
        });
      } else if (res.status === 404) {
        await fetch(`${API_BASE_URL}/api/user/${targetId}/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: 1000, energy: 1000 })
        });
      }
    } catch (err) {
      console.error("Cloud connection failed:", err);
    }
  }
}));