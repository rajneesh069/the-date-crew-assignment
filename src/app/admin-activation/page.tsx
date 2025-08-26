import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminActivationPage() {
  const session = await auth();
  if (session?.user && session?.user.adminActivated) {
    redirect("/client");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="mx-auto w-full max-w-md border-amber-200 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Pending Activation
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your account is currently awaiting admin approval
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Activation Required</span>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">
              Thank you for registering! Your account has been created
              successfully, but it requires admin activation before you can
              access all features.
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="text-left">
                  <p className="mb-1 text-sm font-medium text-amber-800">
                    What happens next?
                  </p>
                  <p className="text-xs text-amber-700">
                    Our admin team will review your account and activate it
                    within 24-48 hours. You&apos;ll receive an email
                    notification once your account is active.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-amber-600 text-white hover:bg-amber-700"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need immediate assistance? Contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
