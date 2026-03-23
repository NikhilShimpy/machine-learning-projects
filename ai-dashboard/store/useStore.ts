import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AudioPredictionResponse,
  NumericPredictionResponse,
  TextPredictionResponse,
  VideoPredictionResponse,
  HealthPredictionResponse,
  HistoryItem,
  Toast,
} from "@/types";

interface AppState {
  // Global UI State
  isLoading: boolean;
  globalError: string | null;
  sidebarCollapsed: boolean;

  // Toast Notifications
  toasts: Toast[];

  // Audio State
  audioResult: AudioPredictionResponse | null;
  audioLoading: boolean;

  // Numeric State
  numericResult: NumericPredictionResponse | null;
  numericLoading: boolean;

  // Text State
  textResult: TextPredictionResponse | null;
  textLoading: boolean;

  // Video State
  videoResult: VideoPredictionResponse | null;
  videoLoading: boolean;

  // Health State
  healthResult: HealthPredictionResponse | null;
  healthLoading: boolean;

  // History
  history: HistoryItem[];

  // Actions
  setLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  toggleSidebar: () => void;

  // Toast Actions
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // Audio Actions
  setAudioResult: (result: AudioPredictionResponse | null) => void;
  setAudioLoading: (loading: boolean) => void;

  // Numeric Actions
  setNumericResult: (result: NumericPredictionResponse | null) => void;
  setNumericLoading: (loading: boolean) => void;

  // Text Actions
  setTextResult: (result: TextPredictionResponse | null) => void;
  setTextLoading: (loading: boolean) => void;

  // Video Actions
  setVideoResult: (result: VideoPredictionResponse | null) => void;
  setVideoLoading: (loading: boolean) => void;

  // Health Actions
  setHealthResult: (result: HealthPredictionResponse | null) => void;
  setHealthLoading: (loading: boolean) => void;

  // History Actions
  addHistoryItem: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;

  // Reset
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      isLoading: false,
      globalError: null,
      sidebarCollapsed: false,
      toasts: [],
      audioResult: null,
      audioLoading: false,
      numericResult: null,
      numericLoading: false,
      textResult: null,
      textLoading: false,
      videoResult: null,
      videoLoading: false,
      healthResult: null,
      healthLoading: false,
      history: [],

      // Global Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setGlobalError: (error) => set({ globalError: error }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Toast Actions
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: `toast-${Date.now()}-${Math.random()}` },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Audio Actions
      setAudioResult: (result) => set({ audioResult: result }),
      setAudioLoading: (loading) => set({ audioLoading: loading }),

      // Numeric Actions
      setNumericResult: (result) => set({ numericResult: result }),
      setNumericLoading: (loading) => set({ numericLoading: loading }),

      // Text Actions
      setTextResult: (result) => set({ textResult: result }),
      setTextLoading: (loading) => set({ textLoading: loading }),

      // Video Actions
      setVideoResult: (result) => set({ videoResult: result }),
      setVideoLoading: (loading) => set({ videoLoading: loading }),

      // Health Actions
      setHealthResult: (result) => set({ healthResult: result }),
      setHealthLoading: (loading) => set({ healthLoading: loading }),

      // History Actions
      addHistoryItem: (item) =>
        set((state) => ({
          history: [
            {
              ...item,
              id: `history-${Date.now()}-${Math.random()}`,
              timestamp: new Date(),
            },
            ...state.history,
          ].slice(0, 50), // Keep only last 50 items
        })),
      clearHistory: () => set({ history: [] }),

      // Reset All
      resetAll: () =>
        set({
          isLoading: false,
          globalError: null,
          toasts: [],
          audioResult: null,
          audioLoading: false,
          numericResult: null,
          numericLoading: false,
          textResult: null,
          textLoading: false,
          videoResult: null,
          videoLoading: false,
          healthResult: null,
          healthLoading: false,
        }),
    }),
    {
      name: "neural-nexus-storage",
      partialize: (state) => ({
        history: state.history,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
