import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type InvestmentStore = {
  initialAmount: number;
  isOnboarded: boolean;
  setInitialAmount: (amount: number) => void;
  completeOnboarding: (amount: number) => void;
};

export const useInvestmentStore = create<InvestmentStore>()(
  persist(
    (set) => ({
      initialAmount: 10_000_000,
      isOnboarded: false,
      setInitialAmount: (amount) => set({ initialAmount: amount }),
      completeOnboarding: (amount) =>
        set({ initialAmount: amount, isOnboarded: true }),
    }),
    { name: 'investment-setting' },
  ),
);
