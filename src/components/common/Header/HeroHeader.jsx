import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Logo } from './Logo';
import ProfileImage from './ProfileImage';
import useUser from '@/src/hooks/useUser';
import UserProfileLink from './UserProfileLink';
import { usePathname } from 'next/navigation';
import NavigationLink from './NavigationLinks';
import { signOut } from 'next-auth/react';
import SearchBar from '../SearchBar/SearchBar';

const HeroHeader = () => {
    const { data: session, status } = useSession();
    const user = useUser();
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const getNavigationPath = () => {
        if (!session?.user) return "/";
        
        if (session.user.role === "job_seeker") {
            return user?.user?.has_resume
                ? "/applicant/dashboard"
                : "/applicant/upload-resume";
        } else if (session.user.role === "recruiter") {
            return session.user.has_company
                ? `/companies/${session.user.company_id}/dashboard`
                : "/companies/create";
        }
        return "/";
    };

    const isResumeActive = pathname.startsWith("/applicant/upload-resume");
    const isNotificationsActive = pathname.startsWith("/notifications");
    const isProfileActive = pathname === getNavigationPath();

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    // Animation variants
    const menuVariants = {
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    const overlayVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.2
            }
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.2
            }
        }
    };

    const menuItemVariants = {
        closed: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.2
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const staggerContainer = {
        open: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        closed: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    return (
        <header className="bg-brand sticky top-0 z-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Left Header */}
                    <div className="flex items-center space-x-4">
                    
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Logo />
                        </div>

                        <div className='md:hidden'>
                            <SearchBar />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex lg:space-x-8 items-center">
                            <Link href="/" className="px-3 py-2 text-[16px] font-semibold text-white hover:text-gray-200 transition-colors">
                                Home
                            </Link>

                            <NavigationLink
                                href="/applicant/upload-resume"
                                isActive={isResumeActive}
                                text="Resume"
                            />
                            
                            <Link href="/jobs" className="px-3 py-2 text-[16px] font-semibold text-white hover:text-gray-200 transition-colors">
                                Jobs
                            </Link>

                            <Link href="/companies/listing" className="px-3 py-2 text-[16px] font-semibold text-white hover:text-gray-200 transition-colors">
                                Companies
                            </Link>
                        </nav>
                    </div>

                    {/* Right Header */}
                    <div className="flex items-center space-x-4">
                         <NavigationLink 
                                href="/notifications" 
                                isActive={isNotificationsActive}
                                icon={Bell}
                                className="hidden lg:flex text-white"
                              />
                        {/* Authentication Section */}
                        {status === "loading" ? (
                            <div className="hidden lg:block">
                                <div className="animate-pulse bg-white/20 rounded-md h-10 w-20"></div>
                            </div>
                        ) : session?.user ? (
                            <div className="flex items-center space-x-4">
                                {/* User Profile Link - Desktop */}
                                <div className="">
                                    <UserProfileLink
                                        session={session}
                                        user={user}
                                        href={getNavigationPath()}
                                        isActive={isProfileActive}
                                    />
                                </div>
                                
                                {/* Sign Out Button - Desktop */}
                                <div className="">
                                    <motion.button
                                        onClick={handleSignOut}
                                        className="inline-flex items-center px-4 py-2 border border-white text-[17px] font-medium rounded-md text-white hover:bg-white hover:text-brand transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign Out
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={'/login'}
                                        className="inline-flex items-center px-4 py-2 border border-white text-[17px] font-medium rounded-md text-white hover:bg-white hover:text-brand transition-colors"
                                    >
                                        Log in
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden">
                            <motion.button
                                onClick={handleMobileMenuToggle}
                                className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-50"
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                            >
                                <motion.div
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    variants={{
                                        closed: { rotate: 0 },
                                        open: { rotate: 180 }
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </motion.div>
                            </motion.button>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            {/* Backdrop */}
                            <motion.div 
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                                variants={overlayVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                onClick={handleMobileMenuToggle}
                            />
                            
                            {/* Menu Panel */}
                            <motion.div 
                                className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-brand to-brand/90 shadow-2xl"
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                            >
                                {/* Close Button */}
                               

                                {/* Menu Content */}
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="px-6 f">
                                        {/* Logo in mobile menu */}
                                        <motion.div 
                                            className="mb-8 flex justify-center"
                                            variants={menuItemVariants}
                                            initial="closed"
                                            animate="open"
                                        >
                                            <Logo />
                                        </motion.div>

                                        {/* Navigation Links */}
                                        <motion.nav 
                                            className="space-y-6"
                                            variants={staggerContainer}
                                            initial="closed"
                                            animate="open"
                                        >
                                            <motion.div variants={menuItemVariants}>
                                                <Link 
                                                    href="/" 
                                                    className="block px-4 py-3 text-lg font-semibold text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
                                                    onClick={handleMobileMenuToggle}
                                                >
                                                    Home
                                                </Link>
                                            </motion.div>


                                            <motion.div variants={menuItemVariants}>
                                                <Link 
                                                    href="/jobs" 
                                                    className="block px-4 py-3 text-lg font-semibold text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
                                                    onClick={handleMobileMenuToggle}
                                                >
                                                    Jobs
                                                </Link>
                                            </motion.div>

                                            <motion.div variants={menuItemVariants}>
                                                <Link 
                                                    href="/companies/listing" 
                                                    className="block px-4 py-3 text-lg font-semibold text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
                                                    onClick={handleMobileMenuToggle}
                                                >
                                                    Companies
                                                </Link>
                                            </motion.div>

                                            {/* User Profile Link - Mobile */}
                                            {session?.user && (
                                                <motion.div variants={menuItemVariants}>
                                                    <UserProfileLink
                                                        session={session}
                                                        user={user}
                                                        href={getNavigationPath()}
                                                        isActive={isProfileActive}
                                                        className="block px-4 py-3 text-lg font-semibold text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-all duration-200"
                                                        onClick={handleMobileMenuToggle}
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.nav>
                                    </div>
                                </div>

                                {/* Bottom Section - Authentication */}
                                <motion.div 
                                    className="flex-shrink-0 border-t border-white/20 p-6"
                                    variants={menuItemVariants}
                                    initial="closed"
                                    animate="open"
                                >
                                    {session?.user ? (
                                        <motion.button
                                            onClick={handleSignOut}
                                            className="w-full flex justify-center items-center px-4 py-3 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-brand transition-all duration-200"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Sign Out
                                        </motion.button>
                                    ) : (
                                        <motion.div whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={'/login'}
                                                className="w-full flex justify-center items-center px-4 py-3 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-brand transition-all duration-200"
                                                onClick={handleMobileMenuToggle}
                                            >
                                                Log in
                                            </Link>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default HeroHeader;