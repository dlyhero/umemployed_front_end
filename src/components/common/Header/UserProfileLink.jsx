"use client";
import Link from "next/link";
import ProfileImage from "./ProfileImage";
import { usePathname } from "next/navigation";



export default function UserProfileLink({ 
  session, 
  user, 
  imageLoading, 
  setImageLoading, 
  href, 
  isActive 
})  
  
  
  {

    const pathname =usePathname();
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 group ${
        isActive ? 'rounded-none' : ''
      }`}
    >
      <div className="relative w-12 h-12 rounded-full border border-gray-200 overflow-hidden">
        <ProfileImage 
          session={session} 
          user={user} 
          imageLoading={imageLoading} 
          setImageLoading={setImageLoading} 
        />
      </div>
      <span className={`hidden sm:block text-lg font-bold truncate max-w-[120px] ${pathname === '/' ? 'text-white' : 'text-gray-800'} transition-colors`}>
        {user.user?.first_name}
      </span>
    </Link>
  );
}