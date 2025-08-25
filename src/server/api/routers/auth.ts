import { createTRPCRouter, publicProcedure } from "../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { signUpSchema } from "@/types/user";
import { signIn } from "@/server/auth";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existing) {
        throw new TRPCError({
          message: "User already exists",
          code: "CONFLICT",
        });
      }

      const newUser = await ctx.db.user.create({
        data: input,
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      return newUser;
    }),
});
