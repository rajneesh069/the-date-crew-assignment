import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-amber-200/50 bg-white/80 shadow-2xl backdrop-blur-sm">
          <CardContent className="space-y-6 p-8 text-center">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
                Check your email
              </h1>
              <p className="text-sm leading-relaxed text-amber-700/80">
                A link has been sent to your email address.
              </p>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-amber-200/30 bg-amber-50/50 p-4">
              <p className="text-sm text-amber-800/90">
                Click the link in your email to login to your account. The link
                will expire in 24 hours for security.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>

              <p className="text-xs text-amber-600/70">
                Didn&apos;t receive an email? Check your spam folder or try
                signing in again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
