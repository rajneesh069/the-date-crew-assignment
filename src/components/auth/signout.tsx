"use client";

import { signOut } from "next-auth/react";
import { LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function SignOutForm() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
      <CardHeader className="space-y-4 pb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Heart className="h-8 w-8 fill-current text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
            Sign Out
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Are you sure you want to sign out of your matchmaker account?
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-800">
            You&apos;ll need to sign in again to access your dashboard and
            manage clients.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSignOut}
            className="w-full transform rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-red-600 hover:to-red-700 hover:shadow-xl"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Yes, Sign Out
          </Button>

          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full rounded-lg border-2 border-amber-200 bg-transparent py-3 font-semibold text-amber-700 transition-all duration-200 hover:bg-amber-50"
          >
            Cancel
          </Button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500">
            Thank you for using The Date Crew matchmaker platform
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
