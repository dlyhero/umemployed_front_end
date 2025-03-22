import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBuilding, FaBriefcase, FaPlusCircle, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

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
                    <div className="flex flex-col gap-4 mb-8">
                        <Link href="#" className="flex items-center gap-2 text-gray-600 font-semibold hover:text-brand">
                            <FaBuilding /> Resume
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-gray-600 font-semibold hover:text-brand">
                            <FaBriefcase /> Browse Jobs
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-gray-600 font-semibold hover:text-brand">
                            <FaPlusCircle /> Post a Job
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-gray-600 font-semibold hover:text-brand">
                            <FaEnvelope /> Contact Us
                        </Link>
                    </div>

                    {/* Authentication Buttons */}
                    <div className="flex flex-col gap-4">
                        <Link href="#" className="w-full border px-6 py-3 rounded-full text-brand text-center font-semibold flex items-center justify-center gap-2">
                            <FaUserPlus /> Create Account
                        </Link>
                        <Link href="#" className="w-full bg-brand text-white px-6 py-3 rounded-full text-center font-semibold flex items-center justify-center gap-2">
                            <FaSignInAlt /> Login
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}