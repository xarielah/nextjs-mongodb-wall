import { Wall } from "@/db/models/wall.model";
import connectMongo from "@/db/utils/connect-mongo.db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./db";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,

  session: {
    strategy: "database",
  },

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
      await connectMongo();
      const userWall = await Wall.findOne({ user: user.id });
      if (!userWall) {
        const newWall = await Wall.create({ user: user.id });
        session.user.wallId = newWall._id.toString();
      } else {
        session.user.wallId = userWall?._id.toString() || "";
      }
      return session;
    },
  },
};
