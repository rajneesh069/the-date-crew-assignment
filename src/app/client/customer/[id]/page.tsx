import { CustomerProfile } from "@/components/client/customer";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void api.customer.getCustomer.prefetch({
    customerId: decodeURIComponent(id),
  });

  return (
    <HydrateClient>
      <CustomerProfile />
    </HydrateClient>
  );
}
