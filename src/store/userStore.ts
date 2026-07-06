// src/store/userStore.ts
import { create } from "zustand";
import client from "../api/client";

interface UserInfo {
  username?: string;
  name?: string;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    if (get().user || get().loading) return;

    set({ loading: true });

    try {
      const response = await client.get<UserInfo>("/api/auth/userinfo");
      set({ user: response.data });
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => {
    set({ user: null, loading: false });
  },
}));
