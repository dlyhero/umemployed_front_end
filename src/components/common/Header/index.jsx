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
import { useSession } from "next-auth/react";
import { useIsMessagesPage } from "@/src/utils/path";



// 8. Header.js
export function Header() {
  const isMessagesPage = useIsMessagesPage()
  const scrolled =  useScrollTop();
  const pathname = usePathname();
  const {data: session} = useSession();
 
  const feedBackPages = ["/verify_email", "/reset_password",];

  return (
    <header
     className={
      cn(
      "border-gray-200 bg-white z-40  top-0",
      scrolled && "border-b shadow-sm",
      pathname === '/messages' ? "sticky lg:relative" : "sticky"
    )}>
      <div className="lg:container md:max-w-8xl mx-auto px-2 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          {!feedBackPages.includes(pathname) && <NavLinks /> }
        </div>

       {
        !feedBackPages.includes(pathname) && (
         <>
          <div className="flex-1 max-w-5xl flex justify-center mx-4 ">
            {session && (
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