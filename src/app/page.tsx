import { SignInButton } from "@/components/auth/signin-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  if (session?.user) {
    redirect("/client");
  }

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
