import { Home } from "@/components/admin/home";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  if (session?.user?.role !== "ADMIN") {
    return <div>Only Admins are allowed.</div>;
  }

  if (session.user) {
    void api.admin.getAllUsers.prefetch({ page: 1 });
  }

  return (
    <HydrateClient>
      <Home />
    </HydrateClient>
  );
}
