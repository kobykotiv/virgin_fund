import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUsersCollection } from "@/lib/mongodb"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials")
        }

        const usersCollection = await getUsersCollection()
        const user = await usersCollection.findOne({ email: credentials.email })

        if (!user) {
          throw new Error("User not found")
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user as any
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
