import { z } from "zod";

export type ServerUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "ADMIN" | "MATCHMAKER";
  adminActivated: boolean;
};

export const createUserSchema = z.object({
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

export const updateUserSchema = z.object({
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
