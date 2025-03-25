"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const { data: session, status, update } = useSession();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Update email from session and handle refresh
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        // If email is missing, try to update the session
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

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-[100px] h-6 bg-gray-200 animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
      {status === "authenticated" && userEmail ? (
        <>
          <div className="flex gap-2 items-center">
            <img 
              src="https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://www.gravatar.com/avatar/?d=mp";
              }}
            />
            <span 
              className="w-[90px] overflow-hidden whitespace-nowrap text-ellipsis hidden sm:block text-sm transition-opacity duration-300 ease-in-out"
              title={userEmail}
            >
              {userEmail}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 lg:px-5 py-2 lg:py-3 text-brand font-semibold border border-brand rounded-full hover:bg-brand/10 transition-colors duration-300 ease-in-out"
            disabled={isLoading}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn(undefined, { callbackUrl: '/' })}
          className="px-4 lg:px-5 py-2 lg:py-3 text-brand font-semibold border border-brand rounded-full hover:bg-brand/10 transition-colors duration-300 ease-in-out"
          disabled={isLoading}
        >
          Sign In
        </button>
      )}
    </div>
  );
}