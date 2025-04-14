"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../Spinner";
import useUser from "@/src/hooks/useUser";

export default function AuthButtons() {
  const { data: session, status, update } = useSession();
  const user = useUser();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Derived states
  const username = useMemo(() => userEmail.split('@')[0] || "", [userEmail]);
  const showSkeleton = isLoading || status === "loading";

  useEffect(() => {
    const loadSession = async () => {
      try {
        if (status === "authenticated") {
          // Add null checks for session
          if (!session?.user?.email) {
            const updated = await update();
            if (updated?.user?.email) {
              setUserEmail(updated.user.email);
            }
          } else {
            setUserEmail(session.user.email);
          }

          
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [status, session, update]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } finally {
      setSigningOut(false);
    }
  };

  const getNavigationPath = () => {
    if (!session?.user) return "/";

    if (session.user.role === "job_seeker") {
      return session.user.has_resume
        ? "/applicant/dashboard"
        : "/applicant/upload-resume";
    } else if (session.user.role === "recruiter") {
      return session.user.has_company
        ? `/companies/${session.user.company_id}/dashboard`
        : "/company/create";
    }
    return "/";
  };

  // Hybrid loading render
  if (showSkeleton) {
    return (
      <div className="flex items-center gap-4">
        {/* Skeleton for avatar area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="hidden sm:block">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Spinner for button area */}
        <div className="w-20 h-9 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-center gap-4">
      {status === "authenticated" ? (
        <>
         {session.user.role === 'job_seeker' && <Link href="/applicant/upload-resume" className="text-gray-700 text-sm font-medium hidden md:block">Resume</Link> }

          <Link
            href={getNavigationPath()}
            className="flex items-center gap-2"
          >
            <div className="relative w-10 h-10 rounded-full border border-gray-200">
              {session.user?.image ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner size="sm" />
                    </div>
                  )}
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className={`object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoadingComplete={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <User className="w-5 h-5 text-gray-500 absolute inset-0 m-auto" />
              )}
            </div>
            <span className="hidden sm:block text-sm font-bold text-gray-700 truncate max-w-[120px]">
              {user.username || username}
            </span>
          </Link>


          <Button
            variant={"outline"}
            className={'text-brand border border-brand min-w-[85px] bg-white hover:bg-none hover:text-brand'}
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? (
              <Spinner size="sm" />
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          className={'text-brand border border-brand bg-white hover:bg-none hover:text-brand'}
          size="sm"
          onClick={() => signIn(undefined, { callbackUrl: '/' })}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      )}
    </div>
  );
}