
"use client";
import Link from "next/link";

export default function NavigationLink({ 
  href, 
  isActive, 
  icon: Icon, 
  text,
  className = ""
}) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-0 p-0 rounded-lg hover:bg-gray-50 text-sm group ${className} ${
        isActive ? 'rounded-none' : ''
      }`}
    >
      {Icon ? (
        <Icon className={`w-4 h-4 group-hover:text-brand transition-colors ${
          isActive ? 'text-brand' : 'text-gray-600'
        }`} />
      ) : (
        <span className={`group-hover:text-brand transition-colors font-semibold ${
          isActive ? 'text-brand' : ''
        }`}>{text}</span>
      )}
    </Link>
  );
}
