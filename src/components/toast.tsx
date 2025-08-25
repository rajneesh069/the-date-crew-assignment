"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export function ShowToast({ message }: { message: string }) {
  useEffect(() => {
    toast(message, {
      duration: 3000,
    });
  }, [message]);
  return null;
}
