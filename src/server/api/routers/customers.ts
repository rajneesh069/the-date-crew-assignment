import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { serverCustomerProfileSchema } from "@/types/customer";

export const customerRouter = createTRPCRouter({
  createCustomer: protectedProcedure
    .input(serverCustomerProfileSchema.omit({ id: true, joinDate: true }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // basic uniqueness check (fallback to Prisma P2002 still required in bigger apps)
      const existing = await ctx.db.customer.findFirst({
        where: { OR: [{ email: input.email }, { phone: input.phone }] },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with same email/phone exists",
        });
      }

      const customer = await ctx.db.customer.create({
        data: {
          ...input,
          userId,
          dateOfBirth: new Date(input.dateOfBirth),
        },
      });

      return customer;
    }),

  getAllCustomers: protectedProcedure
    .input(z.object({ page: z.number().int().min(1).default(1) }))
    .query(async ({ ctx, input }) => {
      console.log("ctx.db inside getAllCustomers:", ctx.db);
      const userId = ctx.session.user.id;
      const pageSize = 10;
      const currentPage = input.page;

      console.log("userId in getAllCustomers:", userId);

      const where: Prisma.CustomerWhereInput = { userId };

      const [customers, totalCount] = await Promise.all([
        ctx.db.customer.findMany({
          where: {
            userId,
          },
          take: pageSize,
          skip: (currentPage - 1) * pageSize,
          orderBy: { joinDate: "desc" },
        }),
        ctx.db.customer.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      return {
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        totalPages,
        pageSize,
        currentPage,
        customers,
        totalCount,
      };
    }),

  search: protectedProcedure
    .input(
      z.object({
        search: z.string().min(1),
        currentPage: z.number().int().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const pageSize = 10;
      const currentPage = input.currentPage;

      const where: Prisma.CustomerWhereInput = {
        userId,
        OR: [
          { firstName: { contains: input.search, mode: "insensitive" } },
          { lastName: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
          { phone: { contains: input.search, mode: "insensitive" } },
          { city: { contains: input.search, mode: "insensitive" } },
        ],
      };

      const [result, totalCount] = await Promise.all([
        ctx.db.customer.findMany({
          where,
          take: pageSize,
          skip: (currentPage - 1) * pageSize,
          orderBy: { joinDate: "desc" },
        }),
        ctx.db.customer.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      return {
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        result,
        currentPage,
        totalCount,
        totalPages,
      };
    }),

  getCustomer: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.db.customer.findFirst({
        where: { userId, id: input.customerId },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      return user;
    }),

  getPublicProfile: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.customer.findFirst({
        where: { id: input.customerId },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      return { ...user, phone: null, income: null, email: null };
    }),

  // update accepts an object with customerId and partial data
  updateCustomer: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        data: serverCustomerProfileSchema.omit({ id: true, joinDate: true }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { customerId, data } = input;

      const existing = await ctx.db.customer.findFirst({
        where: { id: customerId, userId },
      });
      if (!existing)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });

      // uniqueness checks for email/phone if provided
      const other = await ctx.db.customer.findFirst({
        where: {
          OR: [{ email: data.email }, { phone: data.phone }],
          NOT: { id: customerId },
        },
      });
      if (other)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email/Phone used by another customer",
        });

      const updated = await ctx.db.customer.update({
        where: { id: customerId },
        data: {
          ...data,
          dateOfBirth: new Date(data.dateOfBirth), // <-- Convert
        },
      });
      return updated;
    }),

  deleteCustomer: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await ctx.db.customer.findFirst({
        where: { id: input.customerId, userId },
      });
      if (!existing)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });

      const deleted = await ctx.db.customer.delete({
        where: { id: input.customerId },
      });
      return deleted;
    }),
});
