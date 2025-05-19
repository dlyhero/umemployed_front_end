// src/components/LogoutButton.js
"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const { setShowAuthButtons, setIsLoggingOut } = useAuthContext();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowAuthButtons(false);
    
    try {
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setShowAuthButtons(true);
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 3000);
    }
  };

  return (
    <Button
      variant="outline"
      className="text-brand border-brand hover:bg-brand/10"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}