import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NodeMailer from "next-auth/providers/nodemailer";
import { db } from "@/server/db";
import { env } from "@/env";
import type { Role as UserRole, User as PrismaUser } from "@prisma/client";
import { sendEmail } from "../email";
import { getSigninEmailTemplate, getSignupEmailTemplate } from "@/lib/utils";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      adminActivated: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    NodeMailer({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        if (!identifier) return;
        const existing = await db.user.findFirst({
          where: {
            email: identifier,
          },
        });
        if (existing) {
          await sendEmail({
            to: identifier,
            subject: "Sign In",
            html: getSigninEmailTemplate(url),
          });
        } else {
          const signupLink = `${env.APP_URL}/auth/signup`;
          const html = getSignupEmailTemplate(signupLink);
          await sendEmail({
            to: identifier,
            subject: "Complete Your Signup",
            html,
          });
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    verifyRequest: "/auth/verify-request",
    signOut: "/auth/signout",
  },
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: (user as PrismaUser).role,
          emailVerified: (user as PrismaUser).adminActivated,
        },
      };
    },
  },
} satisfies NextAuthConfig;
