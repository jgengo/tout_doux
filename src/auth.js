import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "no-reply@resend.jgengo.fr",
      name: "Email",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
