/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "@/core/config/constants";

interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  userInfo?: any;
  password?: string;
  accessTokenExpires?: number;
  error?: string;
}

interface BackendAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

const fetchBackendToken = async (endpoint: string, providerToken: string): Promise<BackendAuthResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data?.accessToken) throw new Error(data?.message || "Login failed");

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    console.error("Error fetching backend token:", error);
    return null;
  }
};

const refreshAccessToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
  if (!token.refreshToken) {
    return {
      ...token,
      error: "NoRefreshToken",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.accessToken) {
      throw new Error(data?.message || "Failed to refresh token");
    }

    const decoded: any = jwtDecode(data.accessToken);
    const accessTokenExpires = decoded?.exp ? decoded.exp * 1000 : undefined;

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires,
      error: undefined,
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accessToken: { label: "AccessToken", type: "text" },
        refreshToken: { label: "RefreshToken", type: "text" },
        password: { label: "Password", type: "text" },
        accessTokenExpires: { label: "AccessTokenExpires", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.accessToken && credentials.refreshToken) {
            const decoded = jwtDecode(credentials.accessToken);
            const expiresFromCredential = credentials.accessTokenExpires ? Number(credentials.accessTokenExpires) : undefined;
            const calculatedExpires = decoded && (decoded as any).exp ? (decoded as any).exp * 1000 : undefined;
            const accessTokenExpires = Number.isFinite(expiresFromCredential) ? expiresFromCredential : calculatedExpires;

            return {
              id: credentials.accessToken,
              userInfo: decoded,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              password: credentials.password,
              accessTokenExpires,
            };
          }
          return null;
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: ExtendedToken;
      account: any;
      user: any;
    }) {
      if (account?.provider === "github" && account?.access_token) {
        const backendTokens = await fetchBackendToken("github-login", account.access_token);

        if (backendTokens?.accessToken) {
          const decoded: any = jwtDecode(backendTokens.accessToken);
          token.accessToken = backendTokens.accessToken;
          token.refreshToken = backendTokens.refreshToken ?? token.refreshToken;
          token.accessTokenExpires = decoded?.exp ? decoded.exp * 1000 : token.accessTokenExpires;
        }
      }

      if (account?.provider === "google" && account?.access_token) {
        const backendTokens = await fetchBackendToken("google-login", account.access_token);

        if (backendTokens?.accessToken) {
          const decoded: any = jwtDecode(backendTokens.accessToken);
          token.accessToken = backendTokens.accessToken;
          token.refreshToken = backendTokens.refreshToken ?? token.refreshToken;
          token.accessTokenExpires = decoded?.exp ? decoded.exp * 1000 : token.accessTokenExpires;
        }
      }

      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userInfo = user.userInfo;
        token.password = user.password;
        token.accessTokenExpires = user.accessTokenExpires ?? token.accessTokenExpires;
      }

      if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires - 5000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.userInfo = token.userInfo;
      session.password = token.password;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
