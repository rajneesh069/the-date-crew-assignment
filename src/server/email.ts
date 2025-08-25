"use server";

import nodemailer from "nodemailer";
import { env } from "@/env";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: Number(env.EMAIL_SERVER_PORT),
  secure: Number(env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text ?? html.replace(/<[^>]*>?/gm, ""), // Basic text fallback
    });
    console.log(`Email sent to ${to} for subject: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return { success: false, error: (error as Error).message };
  }
};
