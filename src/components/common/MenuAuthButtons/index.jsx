"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import { Mail, UserPlus, LogIn, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex flex-col gap-4">
      {!(session?.user) && (
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => signIn()}
        >
          <UserPlus className="h-4 w-4" /> 
          Create Account
        </Button>
      )}
      
      {session?.user ? (
        <Button 
          className="w-full gap-2 text-white bg-brand"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 " />
          Logout
        </Button>
      ) : (
        <Button 
          className="w-full gap-2 bg-brand text-white"
          onClick={() => signIn()}
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      )}
    </div>
  );
}