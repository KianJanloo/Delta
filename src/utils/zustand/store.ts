import { create } from "zustand";
import { getToken, removeToken, setToken } from "@/core/cookie/auth";
import Cookies from "js-cookie";


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

const getEmail = Cookies.get("email");

const useEmailStore = create<EmailState>((set) => ({
  email: getEmail ? JSON.parse(getEmail) : null,
  setEmail: (email: string) => set({ email: email }),
}));

useEmailStore.subscribe((state) => {
  const email = state.email;
  if (email) {
    Cookies.set("email", JSON.stringify(email), { expires: 1 });
  } else {
    Cookies.remove("email");
  }
});

interface CodeState {
  code: string | null;
  setCode: (code: string) => void;
}

const getCode = Cookies.get("code");

const useCodeStore = create<CodeState>((set) => ({
  code: getCode ? JSON.parse(getCode) : null,
  setCode: (code: string) => set({ code: code }),
}));

useCodeStore.subscribe((state) => {
  const code = state.code;
  if (code) {
    Cookies.set("code", JSON.stringify(code), { expires: 1 });
  } else {
    Cookies.remove("code");
  }
});

export { useUserStore, useEmailStore, useCodeStore };
