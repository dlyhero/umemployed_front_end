"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathName = usePathname(); // Get the current pathname

  return (
    <div className="logo-wrap flex items-center mr-4">
      <Link href="/" className="text-2xl font-sans">
        {pathName === "/login" ? (
          <span className="text-[#1e90ff] font-bold text-5xl">ue</span>
        ) : (
          <span className="bg-[#1e90ff] p-1 text-white rounded-lg">UE</span>
        )}
      </Link>
    </div>
  );
}