"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <>
          <div className="flex gap-2 items-center">
            <img src="https://umemployeds1.blob.core.windows.net/umemployedcont1/resume/images/default.jpg" alt="Profile Image" className="w-10 h-10 rounded-full object-cover" />
            <span className="w-[90px] overflow-hidden whitespace-nowrap text-ellipsis hidden sm:block text-sm">{session.user.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 lg:px-5 py-2 lg:py-3 text-brand font-semibold border border-brand rounded-full"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()} // Specify your provider ID if needed
          className="px-4 lg:px-5 py-2 lg:py-3 text-brand font-semibold border border-brand rounded-full"
        >
          Sign In
        </button>
      )}
    </div>
  );
}