import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  if (session?.user?.role !== "ADMIN") {
    return <div>Only Admins are allowed.</div>;
  }
  return <div>{children}</div>;
}
