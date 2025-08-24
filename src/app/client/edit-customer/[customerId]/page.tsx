import { EditCustomer } from "@/components/client/edit-customer";
import type { ReligionSchemaType } from "@/server/api/routers/customers";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const session = await auth();
  if (session?.user) {
    void api.customer.getCustomer.prefetch({
      customerId: decodeURIComponent(customerId),
    });
  }

  const customer = await api.customer.getCustomer({
    customerId: decodeURIComponent(customerId),
  });
  return (
    <HydrateClient>
      <EditCustomer
        initialCustomer={{
          ...customer,
          dateOfBirth: customer?.dateOfBirth.toISOString().slice(0, 10),
          religion: customer?.religion as ReligionSchemaType,
          joinDate: customer?.joinDate.toISOString().slice(0, 10),
        }}
      />
    </HydrateClient>
  );
}
