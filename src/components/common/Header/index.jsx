"use client";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { Menu } from "./Menu";
import { Search } from "lucide-react";
import SearchBar from "../SearchBar";
import AuthButtons from "./AuthButtons";



// 8. Header.js
export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks />
        </div>

        <div className="flex-1 max-w-xl mx-4">
          {pathname === "/" && (
            // <div className="relative">
            //   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            //   <input
            //     type="text"
            //     placeholder="Search jobs, companies..."
            //     className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
            //   />
            // </div>
            <SearchBar />
          )}
        </div>

        <div className="flex items-center gap-4">
          <AuthButtons className="hidden md:flex" />
          <Menu />
        </div>
      </div>
    </header>
  );
}