import { create } from 'zustand';

type CounterState = {
  value: number;
  loading: boolean;
  error?: string;
  actions: {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    simulateAsyncIncrement: () => Promise<void>;
  };
};

const useCounterStoreBase = create<CounterState>((set, get) => ({
  value: 0,
  loading: false,
  error: undefined,
  actions: {
    increment: () => set((s) => ({ value: s.value + 1 })),
    decrement: () => set((s) => ({ value: s.value - 1 })),
    reset: () => set({ value: 0, error: undefined }),
    simulateAsyncIncrement: async () => {
      try {
        set({ loading: true, error: undefined });
        await new Promise((r) => setTimeout(r, 300));
        const current = get().value;
        set({ value: current + 1 });
      } catch (e) {
        set({ error: e instanceof Error ? e.message : 'Unknown error' });
      } finally {
        set({ loading: false });
      }
    },
  },
}));

export const useCounterValue = () => useCounterStoreBase((s) => s.value);
export const useCounterLoading = () => useCounterStoreBase((s) => s.loading);
export const useCounterError = () => useCounterStoreBase((s) => s.error);
export const useCounterActions = () => useCounterStoreBase((s) => s.actions);
