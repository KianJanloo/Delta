/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from 'next-auth/jwt';
import { jwtDecode } from 'jwt-decode';

async function fetchBackendToken(githubToken: string): Promise<string | null> {
    try {
        const res = await fetch('https://delta-project.liara.run/api/auth/github-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${githubToken}`,
            },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Login failed');

        return data.accessToken;
    } catch (error) {
        console.error('Error fetching backend token:', error);
        return null;
    }
}

async function fetchBackendTokenGoogle(googleToken: string): Promise<string | null> {
    try {
        const res = await fetch('https://delta-project.liara.run/api/auth/google-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${googleToken}`,
            },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Login failed');

        return data.accessToken;
    } catch (error) {
        console.error('Error fetching backend token:', error);
        return null;
    }
}


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
            },
            async authorize(credentials) {
                try {
                    if (credentials?.accessToken && credentials.refreshToken) {

                        const decoded = jwtDecode(credentials.accessToken);

                        return {
                            id: credentials.accessToken,
                            userInfo: decoded,
                            accessToken: credentials.accessToken,
                            refreshToken: credentials.refreshToken,
                            password: credentials.password,
                        };
                    }
                    return null
                } catch (error) {
                    console.error("Login failed:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }: { token: JWT, account: any, user: any }) {
            if (account?.provider === 'github') {
                const githubAccessToken = account.access_token;
                const backendToken = await fetchBackendToken(githubAccessToken);

                if (backendToken) {
                    token.accessToken = backendToken;
                }
            }

            if (account?.provider === "google") {
                const googleAccessToken = account.access_token;
                const backendToken = await fetchBackendTokenGoogle(googleAccessToken);

                if (backendToken) {
                    token.accessToken = backendToken;
                }
            }

            if (user?.accessToken) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.userInfo = user.userInfo;
                token.password = user.password;
            }

            return token;
        },
        async session({ session, token }: any) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.userInfo = token.userInfo;
            session.password = token.password;
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
