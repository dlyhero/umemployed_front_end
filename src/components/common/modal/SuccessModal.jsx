"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

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
          window.location.replace(redirectUrl);
        }
      }, redirectTimeout);
      return () => clearTimeout(timer);
    }
  }, [open, redirectUrl, redirectTimeout, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center py-2">
          <div className="text-xs text-gray-500">
            Redirecting in {redirectTimeout/1000} seconds...
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}