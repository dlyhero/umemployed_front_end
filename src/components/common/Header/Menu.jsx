"use client";
import { useState, useEffect } from "react";
import { Menu as MenuIcon } from "lucide-react"; // Renamed import
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { usePathname } from "next/navigation";

export function Menu() {
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const  pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <MenuIcon className="w-5 h-5" /> {/* Using renamed import */}
      </button>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {isClient && (<div className="hidden md:block relative">
        <button 
          onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
          className={`${pathname === '/' ? 'text-white': ''} p-2 rounded-lg hover:bg-gray-100`}
        >
          <MenuIcon className="w-5 h-5" /> {/* Using renamed import */}
        </button>
        {isDesktopMenuOpen && <DesktopMenu isOpen={isDesktopMenuOpen} setIsOpen={setIsDesktopMenuOpen} />}
      </div>)}
    </div>
  );
}