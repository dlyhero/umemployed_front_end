'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, Bell, MessageSquare, FileLock2Icon, File } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Spinner from "../Spinner";
import useUser from "@/src/hooks/useUser";

export default function AuthButtons() {
  const pathname = usePathname();
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

  // Check active links
  const isResumeActive = pathname.startsWith("/applicant/upload-resume");
  const isNotificationsActive = pathname.startsWith("/notifications");
  const isMessagesActive = pathname.startsWith("/messages");
  const isProfileActive = pathname === getNavigationPath();

  if (showSkeleton) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="hidden sm:block">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-20 h-9 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-10">
      {status === "authenticated" ? (
        <>
          {session.user.role === 'job_seeker' && (
            <Link 
              href="/applicant/upload-resume" 
              className={`flex flex-col items-center gap-0 p-0 rounded-lg hover:bg-gray-50 text-sm text-gray-700 group ${
                isResumeActive ? 'border-b-2 border-brand rounded-none' : ''
              }`}
            >
              <File className={`w-4 h-4 group-hover:text-brand transition-colors hidden lg:block ${
                isResumeActive ? 'text-brand' : ''
              }`} />
              <span className={`font-medium  group-hover:text-brand transition-colors ${
                isResumeActive ? 'text-brand' : ''
              }`}>Resume</span>
            </Link>
          )}
          
          <Link 
            href="/notifications" 
            className={`hidden lg:flex flex-col items-center gap-0 p-0 rounded-lg hover:bg-gray-50 text-sm group  ${
              isNotificationsActive ? 'border-b-2 border-brand rounded-none' : ''
            }`}
          >
            <Bell className={`w-4 h-4 group-hover:text-brand transition-colors ${
              isNotificationsActive ? 'text-brand' : 'text-gray-700'
            }`} />
            <span className={`font-medium hidden lg:block group-hover:text-brand transition-colors ${
              isNotificationsActive ? 'text-brand' : ''
            }`}>Notifications</span>
          </Link>
          
          <Link 
            href="/messages" 
            className={`hidden lg:flex flex-col items-center gap-0 p-0 rounded-lg hover:bg-gray-50 text-sm group ${
              isMessagesActive ? 'border-b-2 border-brand rounded-none' : ''
            }`}
          >
            <MessageSquare className={`w-4 h-4 group-hover:text-brand transition-colors ${
              isMessagesActive ? 'text-brand' : 'text-gray-700'
            }`} />
            <span className={`font-medium hidden lg:block group-hover:text-brand transition-colors ${
              isMessagesActive ? 'text-brand' : ''
            }`}>Messages</span>
          </Link>
          
          <Link
            href={getNavigationPath()}
            className={`flex items-center gap-2 group ${
              isProfileActive ? 'border-b-2 border-brand rounded-none' : ''
            }`}
          >
            <div className="relative w-10 h-10 rounded-full border border-gray-200 group">
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
                    className={`object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:text-brand transition-colors`}
                    onLoadingComplete={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </>
              ) : (
                <User className={`w-5 h-5 absolute inset-0 m-auto ${
                  isProfileActive ? 'text-brand' : 'text-gray-500'
                }`} />
              )}
            </div>
            <span className={`hidden sm:block text-sm font-bold truncate max-w-[120px] group-hover:text-brand transition-colors ${
              isProfileActive ? 'text-brand' : 'text-gray-700'
            }`}>
              {user.user?.username}
            </span>
          </Link>

          <Button
            variant={"outline"}
            className={'text-brand border border-brand min-w-[85px] bg-white hover:bg-none hover:text-brand hidden lg:block"'}
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