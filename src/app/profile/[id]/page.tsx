import { CustomerPublicProfile } from "@/components/profile";
import { api, HydrateClient } from "@/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void api.customer.getPublicProfile.prefetch({
    customerId: decodeURIComponent(id),
  });

  return (
    <HydrateClient>
      <CustomerPublicProfile />
    </HydrateClient>
  );
}
