import Link from "next/link";

import { LatestPost } from "@/components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    console.log(session?.user);
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        {hello.greeting}
      </main>
    </HydrateClient>
  );
}
