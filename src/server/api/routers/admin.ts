import { z } from "zod";

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createUserSchema, updateUserSchema } from "@/types/user";
import { seedCustomers } from "@/lib/dummy-profiles";

export const adminRouter = createTRPCRouter({
  getAllUsers: adminProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ input, ctx }) => {
      const page = input.page;
      const [users, totalCount] = await Promise.all([
        ctx.db.user.findMany({
          select: {
            id: true,
            adminActivated: true,
            name: true,
            role: true,
            image: true,
            email: true,
          },
          take: 10,
          skip: (page - 1) * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.db.user.count({}),
      ]);
      const totalPages = Math.ceil(totalCount / 10);
      return {
        users,
        totalCount,
        page,
        pageSize: 10,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      };
    }),

  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const newUser = await ctx.db.user.create({
        data: input,
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create the user",
        });
      }

      return newUser;
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deletedUser = await ctx.db.user.delete({
        where: {
          id: input.userId,
        },
      });

      if (!deletedUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete the user.",
        });
      }

      return deletedUser;
    }),

  getUserById: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
      });
    }),

  updateUser: adminProcedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.update({
        where: {
          id: input.id,
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

  toggleUserActivation: adminProcedure
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
  seedUsers: adminProcedure.mutation(async ({ ctx }) => {
    await seedCustomers(ctx.db);
    return { message: "seeded the db" };
  }),
});
