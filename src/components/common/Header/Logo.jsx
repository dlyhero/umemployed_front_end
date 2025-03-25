"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathName = usePathname(); // Get the current pathname

  return (
    <div className="logo-wrap flex items-center mr-4">
      <Link href="/" className="text-2xl font-sans">
        <span className="bg-brand p-1 text-white rounded-lg">uE</span>
      </Link>
    </div>
  );
}