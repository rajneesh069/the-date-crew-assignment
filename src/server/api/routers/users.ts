import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export type ServerUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "ADMIN" | "MATCHMAKER";
  adminActivated: boolean;
};

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z
    .string()
    .url()
    .or(z.literal("")) // allow empty string
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  role: z.enum(["ADMIN", "MATCHMAKER"]).default("MATCHMAKER"),
  adminActivated: z.boolean().default(false),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z
    .string()
    .url()
    .or(z.literal("")) // allow empty string
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  role: z.enum(["ADMIN", "MATCHMAKER"]),
  adminActivated: z.boolean(),
});

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure
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

  createUser: protectedProcedure
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

  deleteUser: protectedProcedure
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

  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
      });
    }),

  updateUser: protectedProcedure
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
