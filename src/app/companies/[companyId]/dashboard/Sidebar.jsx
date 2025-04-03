"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Briefcase, FileText, BarChart, Settings, Menu, X } from 'lucide-react';

const Sidebar = ({ companyId }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Changed to false by default
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile view and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(false); // Always closed on mobile unless toggled
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: `/recruiter/company/${companyId}/dashboard` },
    { icon: Users, label: 'Candidates', path: `/recruiter/company/${companyId}/candidates` },
    { icon: Briefcase, label: 'Jobs', path: `/recruiter/company/${companyId}/jobs` },
    { icon: FileText, label: 'Applications', path: `/recruiter/company/${companyId}/applications` },
    { icon: BarChart, label: 'Analytics', path: `/recruiter/company/${companyId}/analytics` },
    { icon: Settings, label: 'Settings', path: `/recruiter/company/${companyId}/settings` },
  ];

  const sidebarVariants = {
    expanded: { 
      width: isMobile ? "100%" : "16rem",
      x: 0 
    },
    collapsed: { 
      width: isMobile ? "0" : "4rem",
      x: isMobile ? "-100%" : 0 
    },
  };

  const handleMouseEnter = () => !isMobile && !isOpen && setHovered(true);
  const handleMouseLeave = () => !isMobile && setHovered(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        className="md:hidden fixed top-20 left-4 z-30 p-2 rounded-full bg-brand-500 text-white hover:bg-brand-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </motion.button>

      <motion.aside
        className={`fixed md:sticky h-[calc(100vh-72px-96px)] bg-white border-r border-gray-200 z-20 top-[72px] transition-all ${
          isMobile ? 'shadow-xl' : ''
        }`}
        initial={isOpen ? "expanded" : "collapsed"}
        animate={isOpen || (!isMobile && hovered) ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 text-brand-500"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>

          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.path} passHref>
                      <motion.div
                        className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
                          isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon size={20} className={isActive ? "text-brand-500" : ""} />
                        <AnimatePresence>
                          {(isOpen || (!isMobile && hovered)) && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 font-medium"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;