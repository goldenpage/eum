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

let userRequest: Promise<UserInfo> | null = null;
let userRequestId = 0;

function normalizeRole(value?: string) {
  return value?.trim().toUpperCase();
}

function hasAdminValue(value?: string) {
  const normalized = normalizeRole(value);
  return normalized ? ADMIN_VALUES.has(normalized) : false;
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
  return user?.userName ?? user?.name ?? user?.username ?? "관리자";
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    const cachedUser = get().user;

    if (cachedUser) {
      return cachedUser;
    }

    if (userRequest) {
      return userRequest;
    }

    const requestId = ++userRequestId;

    set({ loading: true });

    const currentRequest = client
      .get<UserInfo>("/api/auth/userinfo")
      .then((response) => {
        const user = response.data;

        if (requestId === userRequestId) {
          set({ user });
        }

        return user;
      })
      .catch((error: unknown) => {
        if (requestId === userRequestId) {
          set({ user: null });
        }

        throw error;
      })
      .finally(() => {
        if (requestId === userRequestId) {
          userRequest = null;
          set({ loading: false });
        }
      });

    userRequest = currentRequest;

    return currentRequest;
  },

  clearUser: () => {
    userRequestId += 1;
    userRequest = null;

    set({
      user: null,
      loading: false,
    });
  },
}));
