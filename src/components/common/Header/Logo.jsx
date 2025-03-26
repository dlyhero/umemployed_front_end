"use client";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center mr-6">
      <span className="bg-brand px-2 py-1 text-white text-xl font-bold rounded-lg">uE</span>
    </Link>
  );
}