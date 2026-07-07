import { create } from "zustand";
import client from "../api/client";

export interface UserInfo {
  userName?: string;
  username?: string;
  name?: string;
  role?: string;
  userRole?: string;
  authority?: string;
  authorities?: string[];
  storeType?: string;
  admin?: boolean;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  fetchUser: () => Promise<UserInfo | null>;
  clearUser: () => void;
}

const ADMIN_VALUES = new Set([
  "ADMIN",
  "ROLE_ADMIN",
  "MANAGER",
  "ROLE_MANAGER",
]);

function hasAdminValue(value?: string) {
  return value ? ADMIN_VALUES.has(value.toUpperCase()) : false;
}

export function isAdminUser(user: UserInfo | null) {
  if (!user) return false;
  if (user.admin === true) return true;

  return (
    hasAdminValue(user.role) ||
    hasAdminValue(user.userRole) ||
    hasAdminValue(user.authority) ||
    hasAdminValue(user.storeType) ||
    user.authorities?.some(hasAdminValue) === true
  );
}

export function getUserDisplayName(user: UserInfo | null) {
  return user?.userName ?? user?.name ?? user?.username ?? "사용자";
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    if (get().user) return get().user;
    if (get().loading) return null;

    set({ loading: true });

    try {
      const response = await client.get<UserInfo>("/api/auth/userinfo");
      set({ user: response.data });
      return response.data;
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => {
    set({ user: null, loading: false });
  },
}));
