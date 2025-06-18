"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationLink({ 
  href, 
  isActive, 
  icon: Icon, 
  text,
  className = ""
}) {
  const pathname = usePathname();
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-0 p-0 rounded-lg ${pathname==='/' ? 'hover-none' : 'hover:bg-gray-50'}  text-sm group ${className} ${
        isActive ? 'rounded-none' : ''
      }`}
    >
      {Icon ? (
        <Icon className={`w-4 h-4 group-hover:text-brand transition-colors font-bold text-lg ${
          isActive ? 'text-brand' : 'text-gray-600'
        }`} />
      ) : (
        <span className={`group-hover:text-brand transition-colors text-[16px] font-semibold ${
          pathname=='/' ? 'text-white group-hover:text-white' : (pathname !== '/' && isActive) ? 'text-brand' : 'text-gray'
        }`}>{text}</span>
      )}
    </Link>
  );
}