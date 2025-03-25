"use client";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import Menu from "./Menu";
import SearchBar from "../SearchBar";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname(); // Get the current pathname

  return (
    <header className={`border-gray-200 bg-white`}
    >
      <div className="p-1.5 py-3 flex items-center justify-between container max-w-6xl w-full mx-auto">
        <div className="flex items-center">
          <Logo />
           <NavLinks />
        </div>

        <div className="flex flex-1 max-w-xl">
          {/* Show SearchBar only on the home page */}
          {pathName === "/"  && <SearchBar />}
        </div>

        <div className={`flex gap-4 items-center ${pathName === '/' ? '' : 'hidden'}`}>
          <AuthButtons />
          <Menu />
        </div>
      </div>
    </header>
  );
}