import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// 1. Extend next-auth types to include custom fields in Session and JWT
declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      name: string;
      email: string;
      roleId?: string | null;
      departmentId?: string | null;
      isOnboarded: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    roleId?: string | null;
    departmentId?: string | null;
    isOnboarded: boolean;
    avatarUrl?: string | null;
    initials?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    name: string;
    email: string;
    roleId?: string | null;
    departmentId?: string | null;
    isOnboarded: boolean;
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  // 2. Credentials provider for email/password login
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate email and password presence
        if (!credentials?.email || !credentials?.password) return null;

        // Find user from DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email  as string }
        });

        // Return null if user not found or has no password
        if (!user || !user.password) return null;

        // Validate password
        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) return null;

        // Return user object with custom fields
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId ?? null,
          departmentId: user.departmentId ?? null,
          isOnboarded: user.isOnboarded
        } satisfies User;
      }
    })
  ],

  callbacks: {
    // 3. JWT callback — called on sign-in and every request
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // On sign-in, set initial values from the user
        token.user_id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.roleId = user.roleId ?? null;
        token.departmentId = user.departmentId ?? null;
        token.isOnboarded = user.isOnboarded;
      } else if (token?.user_id) {
        // On subsequent requests, fetch latest data from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.user_id },
          select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
            departmentId: true,
            isOnboarded: true
          }
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.roleId = dbUser.roleId ?? null;
          token.departmentId = dbUser.departmentId ?? null;
          token.isOnboarded = dbUser.isOnboarded;
        }
      }

      return token;
    },

    // 4. Session callback — attaches token values to session
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        user_id: token.user_id,
        name: token.name,
        email: token.email,
        roleId: token.roleId ?? null,
        departmentId: token.departmentId ?? null,
        isOnboarded: token.isOnboarded
      };
      return session;
    }
  },

  // 5. Use JWT-based sessions
  session: {
    strategy: "jwt"
  },

  // 6. Custom login page
  pages: {
    signIn: "/auth/login"
  }
};

// 7. Export NextAuth handlers and helpers
export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth(authOptions as NextAuthConfig);
