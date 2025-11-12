import { getSession, signIn, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "@/core/config/constants";
import { showToast } from "../toast/toast";

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires?: number;
}

let refreshPromise: Promise<RefreshResult | null> | null = null;

const performSignOut = async () => {
  await signOut({ callbackUrl: "/login" });
  showToast("error", "شما وارد نشده‌اید!", "بستن");
};

const requestNewAccessToken = async (refreshToken: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.accessToken) {
    throw new Error(data?.message || "Failed to refresh token");
  }

  return data as { accessToken: string; refreshToken?: string };
};

const performRefresh = async (): Promise<RefreshResult | null> => {
  try {
    const session = (await getSession()) as any;
    const refreshToken = session?.refreshToken as string | undefined;
    const password = session?.password as string | undefined;

    if (!refreshToken) {
      await performSignOut();
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = await requestNewAccessToken(refreshToken);
    const decoded: any = jwtDecode(accessToken);
    const accessTokenExpires = decoded?.exp ? decoded.exp * 1000 : undefined;

    await signIn("credentials", {
      redirect: false,
      accessToken,
      refreshToken: newRefreshToken ?? refreshToken,
      password: password ?? "",
      accessTokenExpires: accessTokenExpires ? accessTokenExpires.toString() : "",
    });

    return {
      accessToken,
      refreshToken: newRefreshToken ?? refreshToken,
      accessTokenExpires,
    };
  } catch (error) {
    console.error("Failed to refresh session:", error);
    await performSignOut();
    return null;
  }
};

export const refreshSession = async (): Promise<RefreshResult | null> => {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};
