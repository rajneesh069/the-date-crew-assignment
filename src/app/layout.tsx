import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "The Date Crew",
  description:
    "The Date Crew is a tech-powered relationship platform that helps professionals find the right life partner — combining AI-driven tools with the care and coaching of personal relationship advisors who guide you through curated partner search and the entire journey to marriage.",
  icons: [
    {
      rel: "icon",
      url: "https://cdn.prod.website-files.com/673e1a80860f50c64038afa6/67640532dc1124255ee02a2c_Group%2036.png",
    },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
