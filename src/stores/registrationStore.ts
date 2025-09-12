import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { RegisterUserInput } from '@/lib/validators/auth';

type RegistrationStep = 'registration' | 'organizer-application' | 'completed';

interface RegistrationState {
  // State
  pendingRegistration: RegisterUserInput | null;
  isRegistrationInProgress: boolean;
  currentStep: RegistrationStep;

  // Actions
  actions: {
    setPendingRegistration: (data: RegisterUserInput) => void;
    clearPendingRegistration: () => void;
    setRegistrationInProgress: (inProgress: boolean) => void;
    setCurrentStep: (step: RegistrationStep) => void;
    resetRegistrationFlow: () => void;
  };

  // Helper methods
  hasPendingRegistration: () => boolean;
  isOrganizerRegistration: () => boolean;
}

const useRegistrationStore = create<RegistrationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        pendingRegistration: null,
        isRegistrationInProgress: false,
        currentStep: 'registration',

        // Actions
        actions: {
          setPendingRegistration: (data: RegisterUserInput) => {
            set({
              pendingRegistration: data,
              isRegistrationInProgress: true,
              currentStep: 'organizer-application',
            });
          },

          clearPendingRegistration: () => {
            set({
              pendingRegistration: null,
              isRegistrationInProgress: false,
              currentStep: 'registration',
            });
          },

          setRegistrationInProgress: (inProgress: boolean) => {
            set({ isRegistrationInProgress: inProgress });
          },

          setCurrentStep: (step: RegistrationStep) => {
            set({ currentStep: step });
          },

          resetRegistrationFlow: () => {
            set({
              pendingRegistration: null,
              isRegistrationInProgress: false,
              currentStep: 'registration',
            });
          },
        },

        // Helper methods
        hasPendingRegistration: () => {
          return get().pendingRegistration !== null;
        },

        isOrganizerRegistration: () => {
          const pending = get().pendingRegistration;
          return pending?.role === 'organizer';
        },
      }),
      {
        name: 'registration-store',
        // Only persist the pending registration data, not the UI state
        partialize: (state) => ({
          pendingRegistration: state.pendingRegistration,
        }),
      },
    ),
    {
      name: 'registration-store',
    },
  ),
);

// Export hooks
export const usePendingRegistration = () =>
  useRegistrationStore((state) => state.pendingRegistration);

export const useRegistrationInProgress = () =>
  useRegistrationStore((state) => state.isRegistrationInProgress);

export const useCurrentStep = () => useRegistrationStore((state) => state.currentStep);

export const useRegistrationActions = () => useRegistrationStore((state) => state.actions);

export const useHasPendingRegistration = () =>
  useRegistrationStore((state) => state.hasPendingRegistration());

export const useIsOrganizerRegistration = () =>
  useRegistrationStore((state) => state.isOrganizerRegistration());
