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
      className={`flex flex-col items-center gap- p-0 rounded-lg ${pathname==='/' ? 'hover-none' : 'hover:bg-gray-50'}  text-sm group ${className} ${
        isActive ? 'rounded-none' : ''
      }`}
    >
      {Icon ? (
        <div className="relative">
          <Icon className={`w-5 h-5 group-hover:text-brand transition-colors font-bold text-lg mx-5 ${
          pathname=='/' ? 'text-white group-hover:text-white' : (pathname !== '/' && isActive) ? 'text-brand' : 'text-gray'
        }`} />
        <div className="absolute -top-2 right-3 bg-red-400 py-0.5 px-1.5 text-[11px] rounded-full">
          0
        </div>
        </div>
      ) : (
        <span className={`group-hover:text-brand transition-colors text-[16px] font-semibold ${
          pathname=='/' ? 'text-white group-hover:text-white' : (pathname !== '/' && isActive) ? 'text-brand' : 'text-gray'
        }`}>{text}</span>
      )}
    </Link>
  );
}