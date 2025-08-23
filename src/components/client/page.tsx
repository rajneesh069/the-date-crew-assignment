import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    console.log(session?.user);
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        Hello, TRPC
        <Link href={"/api/auth/signout"}>Sign Out</Link>
      </main>
    </HydrateClient>
  );
}
