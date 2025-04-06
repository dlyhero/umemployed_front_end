'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { MobileNav } from './MobileNav'
import { SearchInput } from './SearchInput'

export const MobileMenu = ({ mobileMenuOpen }) => (
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="md:hidden bg-white shadow-lg z-40"
      >
        <div className="px-4 py-3 space-y-4">
          <SearchInput />
          <MobileNav />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)