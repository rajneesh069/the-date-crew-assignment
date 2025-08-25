import { CustomerProfile } from "@/components/client/customer";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  void api.customer.getCustomer.prefetch({
    customerId: decodeURIComponent(id),
  });

  return (
    <HydrateClient>
      <CustomerProfile />
    </HydrateClient>
  );
}
