import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const matchRouter = createTRPCRouter({
  findMatch: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        currentPage: z.number().int().nonnegative(),
        pageSize: z.number().int().nonnegative().default(10),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { customerId } = input;
      const userId = ctx.session.user.id;
      const customer = await ctx.db.customer.findFirst({
        where: {
          id: customerId,
          userId,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't find the customer",
        });
      }

      const where: Prisma.CustomerWhereInput = { userId };
      const dob = new Date(customer.dateOfBirth);
      where.userId = userId;
      if (customer.gender === "Male") {
        where.gender = { equals: "Female" };
        where.height = {
          lte: customer.height,
          gte: customer.height - 17, // the max height difference is 7 inches, 17.78 cms = 7 inches
        };
        where.maritalStatus =
          customer.maritalStatus === "NeverMarried"
            ? { equals: "NeverMarried" } // Only never married
            : { in: ["NeverMarried", "Divorced"] }; // Divorced customer is okay with both
        where.dateOfBirth = {
          gte: new Date(dob.getFullYear() - 5, dob.getMonth(), dob.getDate()), // 5 years younger
          lte: new Date(dob.getFullYear() + 2, dob.getMonth(), dob.getDate()), // 2 years older
        };
        where.income = {
          // between 0 to guy's wealth, both inclusive
          gte: 0,
          lte: customer.income,
        };
        where.country = {
          // country should be same
          equals: customer.country,
          mode: "insensitive",
        };
        if (customer.importanceOfCasteOfThePartner === "HIGH") {
          // caste matters
          where.caste = {
            equals: customer.caste,
            mode: "insensitive",
          };
          where.religion = {
            equals: customer.religion,
            mode: "insensitive",
          };
        } else if (customer.importanceOfCasteOfThePartner === "MEDIUM") {
          // religion matters
          where.religion = {
            equals: customer.religion,
            mode: "insensitive",
          };
        } else {
          if (
            customer.importanceOfReligionOfThePartner === "HIGH" ||
            customer.importanceOfReligionOfThePartner === "MEDIUM"
          ) {
            where.religion = {
              equals: customer.religion,
              mode: "insensitive",
            };
          }
        }
      } else {
        where.gender = { equals: "Male" };
        where.height = {
          gte: customer.height,
        };
        where.maritalStatus =
          customer.maritalStatus === "NeverMarried"
            ? { equals: "NeverMarried" } // Only never married
            : { in: ["NeverMarried", "Divorced"] }; // Divorced customer is okay with both
        where.dateOfBirth = {
          gte: new Date(dob.getFullYear(), dob.getMonth(), dob.getDate()), // atleast her age
          lte: new Date(dob.getFullYear() + 5, dob.getMonth(), dob.getDate()), // 5 years older
        };
        where.income = {
          gte: customer.income,
        };
        where.country = {
          // country should be same
          equals: customer.country,
          mode: "insensitive",
        };
        if (customer.importanceOfCasteOfThePartner === "HIGH") {
          // caste matters
          where.caste = {
            equals: customer.caste,
            mode: "insensitive",
          };
          where.religion = {
            equals: customer.religion,
            mode: "insensitive",
          };
        } else if (customer.importanceOfCasteOfThePartner === "MEDIUM") {
          // religion matters
          where.religion = {
            equals: customer.religion,
            mode: "insensitive",
          };
        } else {
          if (
            customer.importanceOfReligionOfThePartner === "HIGH" ||
            customer.importanceOfReligionOfThePartner === "MEDIUM"
          ) {
            where.religion = {
              equals: customer.religion,
              mode: "insensitive",
            };
          }
        }
      }
      const { pageSize, currentPage } = input;
      const [partners, totalCount] = await Promise.all([
        ctx.db.customer.findMany({
          where,
          take: pageSize,
          skip: (currentPage - 1) * pageSize,
        }),
        ctx.db.customer.count({ where }),
      ]);
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
      return {
        partners,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        currentPage,
        pageSize,
      };
    }),
});
