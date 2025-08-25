import { Dashboard } from "@/components/client/home";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function ClientHomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  if (session.user) {
    await api.customer.getAllCustomers.prefetch({ page: 1 });
  }

  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
}
