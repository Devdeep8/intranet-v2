import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import type {  Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string
      name: string
      email: string
      departmentId: string
      roleId?: string | null
    }
  }

  interface User {
    id: string
    name: string
    email: string
    departmentId: string 
    roleId?: string | null
    avatarUrl? : string | null
    initials? : string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string
    name: string
    email: string
    departmentId: string
    roleId?: string | null
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isValid = await compare(credentials.password as string, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          departmentId: user.departmentId,
          roleId: user.roleId
        } satisfies User
      }
    })
  ],
  callbacks: {
    async jwt({ token, user } : {token : JWT , user ?: User }) {
      if (user) {
        token.user_id = user.id?? null
        token.name = user.name
        token.email = user.email
        token.departmentId = user.departmentId ?? null
        token.roleId = user.roleId ?? null
      }
      return token
    },
    async session({ session, token } : {session :Session  , token : JWT }) {
      session.user = {
        user_id: token.user_id,
        name: token.name,
        email: token.email,
        departmentId: token.departmentId ,
        roleId: token.roleId ?? null
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login"
  }
}

// Export handlers and helpers
export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth(authOptions as NextAuthConfig)
