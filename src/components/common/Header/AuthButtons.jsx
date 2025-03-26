"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn } from "lucide-react";
import Image from "next/image";

export default function AuthButtons() {
  const { data: session, status, update } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        update().then(updatedSession => {
          if (updatedSession?.user?.email) {
            setUserEmail(updatedSession.user.email);
          }
        });
      }
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session, update]);

  return (
    <div className={`flex items-center gap-4 ${session ? 'min-w-[180px]' : 'w-fit'}`}>
      {status === "authenticated" ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={session.user?.image || "/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
            <span 
              className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[120px]"
              title={userEmail}
            >
              {isLoading ? (
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
              ) : (
                userEmail.split('@')[0] // Show only the name part of email
              )}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="border-brand text-brand hover:bg-brand/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => signIn(undefined, { callbackUrl: '/' })}
          className="border-brand text-brand hover:bg-brand/10"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      )}
    </div>
  );
}