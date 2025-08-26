import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { sendEmail } from "@/server/email";
import { env } from "@/env";

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
          gte: new Date(dob.getFullYear() - 5, dob.getMonth(), dob.getDate()), // oldest acceptable
          lte: new Date(dob.getFullYear() + 2, dob.getMonth(), dob.getDate()), // youngest acceptable
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

  generateCompatibilityInsights: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        partnerId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Get customer data
      const customer = await ctx.db.customer.findFirst({
        where: {
          id: input.customerId,
          userId,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      // Get partner data
      const partner = await ctx.db.customer.findFirst({
        where: {
          id: input.partnerId,
        },
      });

      if (!partner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      try {
        const { text } = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: `Analyze the compatibility between these two profiles for marriage/dating and provide insights in exactly 200 words. Focus on positives and potential challenges.

Customer Profile:
- Name: ${customer.firstName} ${customer.lastName}
- Age: ${new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear()}
- Gender: ${customer.gender}
- Height: ${customer.height}cm
- Education: ${customer.degree} from ${customer.college}
- Profession: ${customer.designation} at ${customer.company}
- Income: ₹${customer.income}
- Location: ${customer.city}, ${customer.country}
- Religion: ${customer.religion}, Caste: ${customer.caste}
- Languages: ${customer.languages.join(", ")}
- Marital Status: ${customer.maritalStatus}
- Siblings: ${customer.siblings}
- Want Kids: ${customer.wantKids}
- Open to Relocate: ${customer.openToRelocate}
- Open to Pets: ${customer.openToPets}
- Importance of Partner's Caste: ${customer.importanceOfCasteOfThePartner}
- Importance of Partner's Religion: ${customer.importanceOfReligionOfThePartner}

Partner Profile:
- Name: ${partner.firstName} ${partner.lastName}
- Age: ${new Date().getFullYear() - new Date(partner.dateOfBirth).getFullYear()}
- Gender: ${partner.gender}
- Height: ${partner.height}cm
- Education: ${partner.degree} from ${partner.college}
- Profession: ${partner.designation} at ${partner.company}
- Income: ₹${partner.income}
- Location: ${partner.city}, ${partner.country}
- Religion: ${partner.religion}, Caste: ${partner.caste}
- Languages: ${partner.languages.join(", ")}
- Marital Status: ${partner.maritalStatus}
- Siblings: ${partner.siblings}
- Want Kids: ${partner.wantKids}
- Open to Relocate: ${partner.openToRelocate}
- Open to Pets: ${partner.openToPets}
- Importance of Partner's Caste: ${partner.importanceOfCasteOfThePartner}
- Importance of Partner's Religion: ${partner.importanceOfReligionOfThePartner}

Provide a balanced analysis covering compatibility strengths and potential areas of concern. Be specific and constructive.`,
        });

        return {
          insights: text,
        };
      } catch (error) {
        console.error("Error generating compatibility insights:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate compatibility insights",
        });
      }
    }),

  sendMatches: protectedProcedure
    .input(
      z.object({
        customerId: z.string(),
        partnerId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // Get customer data
      const customer = await ctx.db.customer.findFirst({
        where: {
          id: input.customerId,
          userId,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      // Get partner data
      const partner = await ctx.db.customer.findFirst({
        where: {
          id: input.partnerId,
        },
      });

      if (!partner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partner not found",
        });
      }

      try {
        // Generate personalized email for customer
        const { text: customerEmailContent } = await generateText({
          model: google("gemini-2.5-flash"),
          prompt: `Generate a warm, personalized email to ${customer.firstName} about a potential match. The email should:
- Be professional yet friendly
- Mention key compatibility points
- Include a call-to-action to view the profile
- Be around 150-200 words
- Include the profile link: ${env.APP_URL}/profile/${partner.id}

Customer: ${customer.firstName} ${customer.lastName}, ${customer.designation} at ${customer.company}
Match: ${partner.firstName} ${partner.lastName}, ${partner.designation} at ${partner.company}

Key compatibility points:
- Both from ${customer.city === partner.city ? "same city" : "nearby locations"}
- Similar educational background
- Compatible age range
- Shared values regarding ${customer.religion === partner.religion ? "religion" : "diverse backgrounds"}`,
        });

        // Generate personalized email for partner
        const { text: partnerEmailContent } = await generateText({
          model: google("gemini-1.5-flash"),
          prompt: `Generate a warm, personalized email to ${partner.firstName} about a potential match. The email should:
- Be professional yet friendly
- Mention key compatibility points
- Include a call-to-action to view the profile
- Be around 150-200 words
- Include the profile link: ${env.APP_URL}/profile/${customer.id}

Customer: ${partner.firstName} ${partner.lastName}, ${partner.designation} at ${partner.company}
Match: ${customer.firstName} ${customer.lastName}, ${customer.designation} at ${customer.company}

Key compatibility points:
- Both from ${partner.city === customer.city ? "same city" : "nearby locations"}
- Similar educational background
- Compatible age range
- Shared values regarding ${partner.religion === customer.religion ? "religion" : "diverse backgrounds"}`,
        });

        // Send emails
        const [customerEmailResult, partnerEmailResult] = await Promise.all([
          sendEmail({
            to: customer.email,
            subject: `✨ New Match Found: ${partner.firstName} ${partner.lastName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fefce8; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #d97706; margin: 0;">💕 The Date Crew</h1>
                  <p style="color: #92400e; margin: 5px 0;">Your Perfect Match Awaits</p>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #d97706; margin-top: 0;">Hello ${customer.firstName}! 👋</h2>
                  
                  <div style="line-height: 1.6; color: #374151; margin: 20px 0;">
                    ${customerEmailContent.replace(/\n/g, "<br>")}
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${env.APP_URL}/profile/${partner.id}" 
                       style="background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      View ${partner.firstName}'s Profile
                    </a>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                    <p>Best wishes for your journey ahead!</p>
                    <p><strong>The Date Crew Team</strong></p>
                  </div>
                </div>
              </div>
            `,
          }),
          sendEmail({
            to: partner.email,
            subject: `✨ New Match Found: ${customer.firstName} ${customer.lastName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fefce8; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #d97706; margin: 0;">💕 The Date Crew</h1>
                  <p style="color: #92400e; margin: 5px 0;">Your Perfect Match Awaits</p>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #d97706; margin-top: 0;">Hello ${partner.firstName}! 👋</h2>
                  
                  <div style="line-height: 1.6; color: #374151; margin: 20px 0;">
                    ${partnerEmailContent.replace(/\n/g, "<br>")}
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${env.APP_URL}/profile/${customer.id}" 
                       style="background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                      View ${customer.firstName}'s Profile
                    </a>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                    <p>Best wishes for your journey ahead!</p>
                    <p><strong>The Date Crew Team</strong></p>
                  </div>
                </div>
              </div>
            `,
          }),
        ]);

        if (!customerEmailResult.success || !partnerEmailResult.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send one or more emails",
          });
        }

        return {
          success: true,
          message: "Match emails sent successfully to both parties",
        };
      } catch (error) {
        console.error("Error sending match emails:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send match emails",
        });
      }
    }),
});
