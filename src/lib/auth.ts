import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({}), 
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        
        if (!result.success) return null;

        const { username, password } = result.data;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.username,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.username = (user as any).username || user.name || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
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
  debug: true,
  trustHost: true,
});
