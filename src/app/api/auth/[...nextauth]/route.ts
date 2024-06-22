import clientPromise from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        return profile.email_verified;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async session({ session, user }: any) {
      session.user = user;
      return session;
    },
  },
} as any;

// Using type "any" because of adapter's type definition mismatch
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
