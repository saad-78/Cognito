import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }), 
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        // If not, create them
        if (!existingUser) {
          await db.insert(users).values({
            id: user.id || crypto.randomUUID(),
            email: user.email,
            name: user.name || "Anonymous",
            image: user.image,
          });
          console.log("User created in DB:", user.email);
        } else {
            console.log("User exists:", user.email);
        }
      } catch (e) {
        console.error("Error creating user in DB:", e);
        return false; // Fail login if DB fails
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Ensure session has the same ID
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
})
