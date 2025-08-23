import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const updateUserSchema = z.object({
  name: z.string(),
  image: z.string().url(),
  adminActivated: z.boolean(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "MATCHMAKER"]),
});

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
    .input(z.number().default(1))
    .query(async ({ input, ctx }) => {
      const page = input;
      const [users, totalCount] = await Promise.all([
        ctx.db.user.findMany({
          select: {
            id: true,
            adminActivated: true,
            name: true,
            role: true,
            image: true,
            email: true,
            sessions: true,
          },
          take: 10,
          skip: (page - 1) * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.db.user.count({}),
      ]);

      return { users, totalCount, page, pageSize: 10 };
    }),

  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found, hence couldn't be updated.",
        });
      }

      return user;
    }),

  toggleUserActivation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        adminActivated: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          adminActivated: input.adminActivated,
        },
      });
    }),
});
