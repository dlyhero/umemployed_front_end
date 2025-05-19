"use client";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
export default function SidebarLogoutButton() {
  const router = useRouter();
  const { setShowAuthButtons, setIsLoggingOut } = useAuthContext();

  const handleSignOut = async () => {
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
      className="w-full gap-2 text-white bg-brand"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}