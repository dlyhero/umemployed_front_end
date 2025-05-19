"use client";
import { useSession } from 'next-auth/react';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from 'lucide-react';
import SidebarLogoutButton from './SidebarLogoutButton';
import Spinner from '../Spinner';

export default function SidebarAuthButtons() {
  const { data: session, status } = useSession();
  const { showAuthButtons, isLoggingOut } = useAuthContext();

  if (status === "loading" || isLoggingOut) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {!session?.user && showAuthButtons ? (
        <>
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => signIn()}
          >
            <UserPlus className="h-4 w-4" /> 
            Create Account
          </Button>
          <Button 
            className="w-full gap-2 bg-brand text-white"
            onClick={() => signIn()}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </>
      ) : (
        session?.user && <SidebarLogoutButton />
      )}
    </div>
  );
}