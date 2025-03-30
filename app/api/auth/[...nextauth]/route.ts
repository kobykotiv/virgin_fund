import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUsersCollection } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const usersCollection = await getUsersCollection()
        const user = await usersCollection.findOne({ email: credentials.email })
        
        if (!user) {
          return null
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.password
        )
        
        if (!isPasswordValid) {
          return null
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split('@')[0]
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', 
    signOut: '/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
