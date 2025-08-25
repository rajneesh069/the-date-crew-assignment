import { redirect } from "next/navigation";
import { SignOutForm } from "@/components/auth/signout";
import { auth } from "@/server/auth";

export default async function SignOut() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <SignOutForm />
    </div>
  );
}
