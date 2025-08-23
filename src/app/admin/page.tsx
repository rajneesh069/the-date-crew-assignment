import { Home } from "@/components/admin/home";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return <div>Only Admins are allowed.</div>;
  }

  if (session.user) {
    void api.user.getAllUsers();
  }

  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}
