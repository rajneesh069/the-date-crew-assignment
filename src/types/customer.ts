import { z } from "zod";

export const ReligionSchema = z.union([
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

export const ImportanceSchema = z.union([
  z.literal("HIGH"),
  z.literal("MEDIUM"),
  z.literal("LOW"),
]);

export const serverCustomerProfileSchema = z.object({
  id: z.string(),
  firstName: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  lastName: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  gender: z.union([z.literal("Male"), z.literal("Female")]),
  dateOfBirth: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Invalid date format, expected YYYY-MM-DD",
    )
    .transform((s) => s.trim()),
  country: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  city: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  height: z.number().nonnegative(),
  email: z
    .string()
    .email()
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  phone: z
    .string()
    .min(10)
    .max(10)
    .transform((s) => s.trim()),
  college: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  degree: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  income: z.number().int().nonnegative(),
  employmentType: z.union([z.literal("Government"), z.literal("Private")]),
  company: z
    .string()
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim())
    .nullable()
    .optional(),
  designation: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  maritalStatus: z.union([z.literal("NeverMarried"), z.literal("Divorced")]),
  languages: z
    .array(
      z
        .string()
        .min(1)
        .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
    )
    .min(1),
  hobbies: z
    .array(
      z
        .string()
        .min(1)
        .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
    )
    .min(1),
  siblings: z.number().int().nonnegative(),
  caste: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
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
  bio: z
    .string()
    .min(200)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  familySize: z.number().int().positive(),
  importanceOfCasteOfThePartner: ImportanceSchema,
  importanceOfReligionOfThePartner: ImportanceSchema,
});

export type ServerCustomerProfile = z.infer<typeof serverCustomerProfileSchema>;

export const customerSchema = z.object({
  firstName: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  lastName: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  email: z
    .string()
    .email()
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  phone: z
    .string()
    .min(10)
    .max(10)
    .transform((s) => s.trim()),
  dateOfBirth: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  gender: z.enum(["Male", "Female"]),
  country: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  city: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  height: z
    .string()
    .min(3)
    .transform((s) => s.trim()),
  college: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  degree: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  income: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  company: z
    .string()
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  designation: z
    .string()
    .min(2)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  maritalStatus: z.enum(["NeverMarried", "Divorced"]),
  languages: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  siblings: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  caste: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  religion: z.enum([
    "No Religion / Atheist",
    "Hindu",
    "Muslim",
    "Sikh",
    "Christian",
    "Buddhist",
    "Jain",
    "Parsi (Zoroastrian)",
    "Spiritual (but not religious)",
  ]),
  wantKids: z.enum(["Yes", "No", "Maybe"]),
  openToRelocate: z.enum(["Yes", "No", "Maybe"]),
  openToPets: z.enum(["Yes", "No", "Maybe"]),
  bio: z
    .string()
    .min(200)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  familySize: z.string().min(1),
  hobbies: z
    .string()
    .min(1)
    .transform((s) => s.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "").trim()),
  employmentType: z.enum(["Government", "Private"]),
  importanceOfCasteOfThePartner: z.enum(["HIGH", "MEDIUM", "LOW"]),
  importanceOfReligionOfThePartner: z.enum(["HIGH", "MEDIUM", "LOW"]),
});
