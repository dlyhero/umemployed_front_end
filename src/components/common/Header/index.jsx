"use client";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { Menu } from "./Menu";
import { Search } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import AuthButtons from "./AuthButtons";
import useScrollTop from "@/src/hooks/useScrollTop";
import { cn } from "@/lib/utils";



// 8. Header.js
export function Header() {

  const scrolled =  useScrollTop();
  const pathname = usePathname();
 
  const feedBackPages = ["/verify_email", "/reset_password",];

  return (
    <header className={cn("border-gray-200 bg-white sticky top-0 z-40", scrolled && "border-b shadow-sm")}>
      <div className="container max-w-6xl mx-auto px-2 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          {!feedBackPages.includes(pathname) && <NavLinks /> }
        </div>

       {
        !feedBackPages.includes(pathname) && (
         <>
          <div className="flex-1 flex justify-center mx-4">
            {(pathname !== '/signup' &&  pathname !== '/login') && (
              <SearchBar  />
            )}
          </div>
        

        {(pathname !== '/signup' && pathname !== '/login') && (
          <div className="flex items-center gap-4">
            <AuthButtons className="hidden md:flex" />
            <Menu />
          </div>
        )}
         </>
      )}
      </div>
    </header>
  );
}