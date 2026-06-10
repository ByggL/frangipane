import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    GitHub({}),
    Credentials({}), // On laisse vide ici pour le middleware
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/pull") || nextUrl.pathname.startsWith("/collection");
      
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirige automatiquement vers /login
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || user.name || "";
        token.money = (user as any).money || 0;
      }
      // Permet de mettre à jour le token si on appelle update() du côté client
      if (trigger === "update" && session) {
        token.money = session.money;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        (session.user as any).money = token.money as number;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
