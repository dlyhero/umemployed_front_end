"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <>
          <p className="text-sm">{session.user.email}</p>
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