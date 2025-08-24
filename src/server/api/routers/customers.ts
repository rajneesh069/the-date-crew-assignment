// server/routers/customer.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

const ReligionSchema = z.union([
  z.literal("Hindu"),
  z.literal("Muslim"),
  z.literal("Sikh"),
  z.literal("Christian"),
  z.literal("Buddhist"),
  z.literal("Jain"),
  z.literal("Parsi (Zoroastrian)"),
  z.literal("No Religion / Atheist"),
  z.literal("Spiritual (but not religious)"),
]);

export type ReligionSchemaType = z.infer<typeof ReligionSchema>;

const ImportanceSchema = z.union([
  z.literal("HIGH"),
  z.literal("MEDIUM"),
  z.literal("LOW"),
]);

export const serverCustomerProfileSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.union([z.literal("Male"), z.literal("Female")]),
  // backend expects DD-MM-YYYY strings from client
  dateOfBirth: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Invalid date format, expected YYYY-MM-DD",
    ),
  country: z.string().min(1),
  city: z.string().min(1),
  height: z.number().int().positive(),
  email: z.string().email(),
  phone: z.string().min(10).max(10),
  college: z.string().min(1),
  degree: z.string().min(1),
  income: z.number().int().nonnegative(),
  employmentType: z.union([z.literal("Government"), z.literal("Private")]),
  company: z.string().nullable().optional(),
  designation: z.string().min(1),
  maritalStatus: z.union([z.literal("NeverMarried"), z.literal("Divorced")]),
  languages: z.array(z.string().min(1)).min(1),
  hobbies: z.array(z.string().min(1)).min(1),
  siblings: z.number().int().nonnegative(),
  caste: z.string().min(1),
  religion: ReligionSchema,
  wantKids: z.union([z.literal("Yes"), z.literal("No"), z.literal("Maybe")]),
  openToRelocate: z.union([
    z.literal("Yes"),
    z.literal("No"),
    z.literal("Maybe"),
  ]),
  openToPets: z.union([z.literal("Yes"), z.literal("No"), z.literal("Maybe")]),
  accountStatus: z.union([
    z.literal("unmatched"),
    z.literal("matched"),
    z.literal("paused"),
  ]),
  avatar: z.string().url().optional().nullable(),
  joinDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  bio: z.string().min(10),
  familySize: z.number().int().positive(),
  importanceOfCasteOfThePartner: ImportanceSchema,
  importanceOfReligionOfThePartner: ImportanceSchema,
});

export type ServerCustomerProfile = z.infer<typeof serverCustomerProfileSchema>;

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
