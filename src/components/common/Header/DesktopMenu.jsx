import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import MenuAuthButtons from '../MenuAuthButtons/index'
import MenuLinks from './MenuLinks';


export default function DesktopMenu({ isOpen, setIsDesktopMenuOpen }) {
    const menuRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsDesktopMenuOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsDesktopMenuOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-14 right-0 bg-white p-6 w-[300px] border rounded shadow-2xl z-20"
                >
                    {/* Menu Links */}
                   <MenuLinks />

                    {/* Authentication Buttons */}
                   <MenuAuthButtons />
                </motion.div>
            )}
        </AnimatePresence>
    );
}