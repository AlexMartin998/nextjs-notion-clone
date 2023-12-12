import { create } from 'zustand';

type State = {
  isSubscriptionModalOpen: boolean;
};

type Action = {
  setSubscriptionModalOpen: (value: boolean) => void;
};

export const useUiStore = create<State & Action>()((set, get) => ({
  isSubscriptionModalOpen: false,

  setSubscriptionModalOpen: (value: boolean) => {
    set({ isSubscriptionModalOpen: value });
  },
}));
