import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function DesktopMenu({ isOpen, setIsDesktopMenuOpen }) {
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const menuRef = useRef(null);

    // Listen for screen size 
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsLargeScreen(true);
            } else {
                setIsLargeScreen(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsDesktopMenuOpen(false);
            }
        }

        if (isOpen && isLargeScreen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isLargeScreen]);

    if (!isLargeScreen) return null; // Do not render menu if screen size is below 768px

    return (
        <div 
            ref={menuRef} 
            className={`absolute top-14 right-0 bg-white p-6 w-[300px] border rounded shadow-2xl z-20 ${isOpen ? '' : 'hidden'}`}
        >
            {/* Menu Links */}
            <div className="flex flex-col gap-4 mb-8">
                <Link href="#" className="flex items-center gap-2 font-semibold md:hidden hover:text-[#1e90ff]">
                    <i className="fas fa-building"></i> Resume
                </Link>
                <Link href="#" className="flex items-center gap-2 font-semibold md:hidden hover:text-[#1e90ff]">
                    <i className="fas fa-briefcase"></i> Browse Jobs
                </Link>
                <Link href="#" className="flex items-center gap-2 font-semibold hover:text-[#1e90ff]">
                    <i className="fas fa-plus-circle"></i> Post a Job
                </Link>
                <Link href="#" className="flex items-center gap-2 font-semibold hover:text-[#1e90ff]">
                    <i className="fas fa-envelope"></i> Contact Us
                </Link>
            </div>

            {/* Authentication Buttons */}
            <div className="flex flex-col gap-4">
                <Link href="#" className="w-full border px-6 py-3 rounded-full text-[#1e90ff] text-center font-semibold">
                    <i className="fas fa-user-plus"></i> Create Account
                </Link>
                <Link href="#" className="w-full bg-[#1e90ff] text-white px-6 py-3 rounded-full text-center font-semibold">
                    <i className="fas fa-sign-in-alt"></i> Login
                </Link>
            </div>
        </div>
    );
}
