"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  redirectUrl,
  redirectTimeout = 3000,
}) {
  useEffect(() => {
    if (open && redirectUrl) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        if (typeof window !== 'undefined') {
          window.location.href = redirectUrl;
        }
      }, redirectTimeout);
      return () => clearTimeout(timer);
    }
  }, [open, redirectUrl, redirectTimeout, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-brand">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <div className="animate-ping h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}