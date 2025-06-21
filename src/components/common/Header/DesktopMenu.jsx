"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuLinks } from './MenuLinks';
import MenuAuthButtons from '../SidebarAuthButtons/index';

export function DesktopMenu({ isOpen, setIsOpen, onLinkClick }) {
  const menuRef = useRef(null);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the desktop menu
    onLinkClick && onLinkClick(); // Call parent onLinkClick if provided
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-14 right-0 bg-white p-6 w-64 border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <MenuLinks onLinkClick={handleLinkClick} />
          <MenuAuthButtons />
        </motion.div>
      )}
    </AnimatePresence>
  );
}