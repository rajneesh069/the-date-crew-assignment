import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProtectedClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");
  if (!session.user.adminActivated) redirect("/");
  return <div>{children}</div>;
}
