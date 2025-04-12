'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileNav } from './MobileNav';

export const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, activeTab, setActiveTab, companyId }) => (
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="md:hidden bg-white shadow-lg z-40 absolute top-0 left-0 w-full"
      >
        <div className="px-4 py-4 space-y-4">
          <MobileNav
            companyId={companyId}
            closeMenu={() => setMobileMenuOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);