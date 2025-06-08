"use client";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import AuthButtonsSkeleton from "./AuthButtonSkeleton";
import { useAuthContext } from "@/src/context/AuthContext";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const { showAuthButtons, isLoggingOut } = useAuthContext();

  if (status === "loading" || isLoggingOut) {
    return <AuthButtonsSkeleton />;
  }

  if (!session && showAuthButtons) {
    return (
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex"
          onClick={() => signIn()}
        >
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Button>
        <Button
          className="gap-2 bg-brand text-white hover:bg-brand/90 hover:text-white"
          onClick={() => signIn()}
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </div>
    );
  }

  return null;
}