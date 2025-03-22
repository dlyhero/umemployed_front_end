"use client";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

export default function Menu() {
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
        <FaBars />
      </button>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {isClient && (
        <div className="relative hidden md:block">
          <button onClick={() => setIsDesktopMenuOpen(prev => !prev)} className="p-2 active:border-primary rounded-lg">
            <FaBars />
          </button>

          {isDesktopMenuOpen && (
            <DesktopMenu isOpen={isDesktopMenuOpen} setIsDesktopMenuOpen={setIsDesktopMenuOpen} />
          )}
        </div>
      )}
    </div>
  );
}