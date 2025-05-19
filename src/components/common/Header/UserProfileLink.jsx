"use client";
import Link from "next/link";
import ProfileImage from "./ProfileImage";

export default function UserProfileLink({ 
  session, 
  user, 
  imageLoading, 
  setImageLoading, 
  href, 
  isActive 
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 group ${
        isActive ? 'rounded-none' : ''
      }`}
    >
      <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
        <ProfileImage 
          session={session} 
          user={user} 
          imageLoading={imageLoading} 
          setImageLoading={setImageLoading} 
        />
      </div>
      <span className={`hidden sm:block text-sm font-bold truncate max-w-[120px] group-hover:text-brand transition-colors ${
        isActive ? 'text-brand' : 'text-gray-700'
      }`}>
        {user.user?.username}
      </span>
    </Link>
  );
}