import { create } from "zustand";
import { getToken, removeToken, setToken } from "@/core/cookie/auth";

interface UserState {
  tempUserId: number | null;
  userId: null | string;
  isLoggedIn: boolean;
  setTempUserId: (id: number) => void;
  setUserId: (id: string) => void;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

interface EmailState {
  email: string | null;
  setEmail: (email: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  tempUserId: null,
  userId: null,
  isLoggedIn: false,
  setTempUserId: (id: number) => set({ tempUserId: id }),
  setUserId: (id: string) => set({ userId: id }),
  login: async (token: string) => {
    await setToken(token);
    set({ isLoggedIn: true });
  },
  logout: async () => {
    await removeToken();
    set({ isLoggedIn: false });
  },
  checkAuthStatus: async () => {
    const token = await getToken();
    set({ isLoggedIn: !!token });
  },
}));

const useEmailStore = create<EmailState>((set) => ({
  email: null,
  setEmail: (email: string) => set({ email: email }),
}));

export { useUserStore, useEmailStore };
