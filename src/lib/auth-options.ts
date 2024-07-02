import { Wall } from "@/db/models/wall.model";
import connectMongo from "@/db/utils/connect-mongo.db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AuthOptions } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./db";

export type WallObject = {
  user: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
} & Settings;

export type AdapterUserMutated = AdapterUser & {
  settings: Settings;
  wallId: string;
};

export type Settings = {
  privacy: {
    shareWithAll: boolean;
    sharedWith: string[];
  };
  preferences: {
    defaultRTL: boolean;
    defaultPublic: boolean;
  };
};

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
    async signIn(params) {
      return true; // Do different verification for other providers that don't have `email_verified`
    },

    async session(params) {
      const userId = params.user.id as string;
      await connectMongo();
      let wall = await Wall.findOne({ user: userId });
      if (!wall) {
        wall = (await Wall.create({ user: userId })) as Awaited<WallObject>;
      }

      const settings: Settings = {
        privacy: wall.privacy,
        preferences: wall.preferences,
      };

      const userParams = params.user as AdapterUserMutated;
      userParams.settings = settings;
      userParams.wallId = wall._id.toString() || "";
      (params.session.user as any) = params.user as AdapterUserMutated;

      return params.session;
    },
  },
};
