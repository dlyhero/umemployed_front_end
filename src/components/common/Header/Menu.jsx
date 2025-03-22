"use client";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

export default function Menu() {
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handlesClosingMenu = () => {
    setIsMobileMenuOpen(false); 
  };

  // Set the client flag to true once the component is mounted on the client side
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
      {isMobileMenuOpen && (
        <MobileMenu isClosed={handlesClosingMenu} setIsClosed={handlesClosingMenu} />
      )}

      {/* Desktop Menu (only rendered on the client side) */}
      {isClient && (
        <div className="relative hidden md:block">
          <button onClick={() => setIsDesktopMenuOpen(prev => !prev)} className="p-2 active:border-[#1e90ff] rounded-lg">
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
