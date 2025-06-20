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
import AuthenticatedNav from "./AuthenticatedNav";



// 8. Header.js
export function Header() {
  const isMessagesPage = useIsMessagesPage()
  const scrolled =  useScrollTop();
  const pathname = usePathname();
  const {data: session} = useSession();
 
  const feedBackPages = ["/verify_email", "/reset_password", "/login", 
    "/signup"
  ];

  return (
    <header
     className={
      cn(
      "z-40  top-0 ",
      scrolled && "",
      pathname === '/messages' ? "sticky lg:relative" : "sticky",
      pathname === '/' ? "bg-transparent" : "bg-white"
    )}>
      <div className={`${pathname === '/' ? 'max-w-7xl' : 'max-w-[1600px]'} mx-auto px-2 py-6 flex items-center justify-between`}>
        <div className="flex items-center  gap-2">
            <Logo />
          {!feedBackPages.includes(pathname) && <NavLinks /> }
        </div>

       {
        !feedBackPages.includes(pathname) && (
         <>
          {
            pathname !== '/' && <div className="flex-1 max-w-5xl flex justify-center mx-4 ">
            <SearchBar  />
        </div>
          }
        

        {(pathname !== '/signup' && pathname !== '/login') && (
          <div className="flex items-center gap-4">
            {session ? <AuthenticatedNav /> : <AuthButtons />}
            <Menu />
          </div>
        )}
         </>
      )}
      </div>
    </header>
  );
}