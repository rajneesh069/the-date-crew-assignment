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

export const customerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(10),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["Male", "Female"]),
  country: z.string().min(2),
  city: z.string().min(2),
  height: z.string().min(1),
  college: z.string().min(2),
  degree: z.string().min(2),
  income: z.string().min(1),
  company: z.string(),
  designation: z.string().min(2),
  maritalStatus: z.enum(["NeverMarried", "Divorced"]),
  languages: z.string().min(1),
  siblings: z.string().min(1),
  caste: z.string().min(1),
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
  bio: z.string().min(10),
  familySize: z.string().min(1),
  employmentType: z.enum(["Government", "Private"]),
  hobbies: z.string().min(1),
  importanceOfCasteOfThePartner: z.enum(["HIGH", "MEDIUM", "LOW"]),
  importanceOfReligionOfThePartner: z.enum(["HIGH", "MEDIUM", "LOW"]),
});
