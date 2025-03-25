import { useEffect } from 'react';
import Link from 'next/link';
import { FaBuilding, FaBriefcase, FaPlusCircle, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function MobileMenu({ isOpen, onClose }) {
    useEffect(() => {
        if(isOpen){
            document.body.style.overflow = 'hidden'
        }
        const handleResize = () => {
            if (window.innerWidth > 768) {
                onClose(); 
                document.body.style.overflow = 'auto'
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Immediately check the screen size

        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = 'auto'

        };
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed h-screen top-0 left-0 right-0 flex flex-col bg-white max-w-[500px] py-4 px-4 shadow-lg z-50 md:hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                       <Logo />
                        <button className="text-3xl" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 mb-8">
                        <Link href="/resume/upload/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                            <FaBuilding /> Companies
                        </Link>
                        <Link href="/jobs/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                            <FaBriefcase /> Browse Jobs
                        </Link>
                        <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                            <FaPlusCircle /> Post a Job
                        </Link>
                        <Link href="/accounts/user/feature-not-implemented/" className="menu-item flex items-center gap-2 font-semibold text-gray-600 p-2 border-b">
                            <FaEnvelope /> Contact Us
                        </Link>
                    </div>

                    {/* Authentication Buttons */}
                    <div className="flex flex-col gap-4 absolute bottom-10 right-4 left-4">
                        <Link href="/accounts/user/register-applicant/" className="w-full bg-transparent text-brand border px-6 py-3 rounded-full text-center font-semibold flex justify-center items-center gap-2">
                            <FaUserPlus /> Create Account
                        </Link>
                        <Link href="/api/users/login/" className="w-full bg-brand text-white px-6 py-3 rounded-full text-center font-semibold flex justify-center items-center gap-2">
                            <FaSignInAlt /> Login
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}