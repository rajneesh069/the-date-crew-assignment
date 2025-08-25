import { SignInButton } from "@/components/auth/signin-button";
import { ShowToast } from "@/components/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";
import { Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ adminActivated: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/client");
  }
  const { adminActivated } = await searchParams;
  const year = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-amber-100 to-orange-100 p-6 shadow-lg">
              <Heart className="h-12 w-12 text-amber-600" fill="currentColor" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-4xl font-bold text-transparent">
              The Date Crew
            </h1>
            <p className="font-medium text-amber-700">
              Professional Matchmaking Dashboard
            </p>
          </div>
        </div>
        <div>
          {!adminActivated && (
            <ShowToast message={"Please ask for admin activation."} />
          )}
        </div>
        {/* Sign In Card */}
        <Card className="border-amber-200 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-amber-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-amber-700">
              Sign in to access your matchmaker dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-amber-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-amber-600">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="flex h-12 w-full items-center justify-center rounded-md border border-amber-300 bg-white text-amber-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
              >
                Sign in with email →
              </Link>

              <Link
                href="/auth/signup"
                className="flex h-12 w-full items-center justify-center rounded-md bg-amber-100 text-amber-800 transition-colors hover:bg-amber-200"
              >
                Want to signup with email?
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-amber-600">
                Only authorized matchmakers can access this dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-amber-600">
          © {year} The Date Crew. Connecting hearts, Creating futures.
        </p>
      </div>
    </div>
  );
}
