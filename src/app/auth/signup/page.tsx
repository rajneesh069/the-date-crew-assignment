"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signUpSchema } from "@/types/user";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function EmailSignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const signUpMutation = api.auth.signUp.useMutation({
    onError: () => {
      toast.error("Failed to signup");
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      await signUpMutation.mutateAsync(data);
      await signIn("nodemailer", {
        email: data.email,
        redirectTo: "/client",
      });
      toast("Magic Link sent to email!");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Sign Up Card */}
        <Card className="border-amber-200 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-amber-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-amber-700">
              Sign up to get access to your matchmaker dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 font-semibold text-white shadow-lg transition-all duration-200 hover:from-amber-700 hover:to-orange-700 hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sm text-amber-600 hover:text-amber-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to sign in options</span>
              </Link>
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

// export default function Signup() {
//   return <div>Hello</div>;
// }
