"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw } from "lucide-react";

// Mock function for resending verification - replace with your tRPC procedure
const mockResendVerification = async (email: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true, message: "Verification email sent successfully!" };
};

interface VerifyEmailResendFormProps {
  showErrorMessage?: boolean;
}

export function VerifyEmailResendForm({
  showErrorMessage,
}: VerifyEmailResendFormProps) {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsResending(true);
    setResendMessage("");

    try {
      const result = await mockResendVerification(email);
      setResendMessage(
        result.success
          ? "Verification email sent! Please check your inbox."
          : "Failed to send verification email.",
      );
    } catch (error) {
      console.error(error);
      setResendMessage("An error occurred while sending the email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="mb-4 text-sm text-amber-700">
          {showErrorMessage
            ? "Need a new verification link? Enter your email below:"
            : "Enter your email to resend the verification link:"}
        </p>
      </div>

      <form onSubmit={handleResendVerification} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-amber-800">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <Button
          type="submit"
          disabled={isResending || !email}
          className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 font-semibold text-white shadow-lg transition-all duration-200 hover:from-amber-700 hover:to-orange-700 hover:shadow-xl"
        >
          {isResending ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Resend Verification Email</span>
            </div>
          )}
        </Button>
      </form>

      {resendMessage && (
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-3">
          <p className="text-center text-sm text-blue-800">{resendMessage}</p>
        </div>
      )}
    </div>
  );
}
