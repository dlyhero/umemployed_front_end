"use client"
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import Menu from "./Menu";
import SearchBar from "../SearchBar";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="p-1.5 py-3 flex items-center justify-between container max-w-7xl w-full mx-auto">
        <div className="flex items-center">
          <Logo />
          <NavLinks />
        </div>

        <div className="flex flex-1 max-w-xl">
         {pathName === '/' && <SearchBar />}
        </div>

        <div className="flex gap-4 items-center">
          <AuthButtons />
          <Menu />
        </div>
      </div>
    </header>
  );
}
