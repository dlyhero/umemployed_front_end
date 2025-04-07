'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchInput } from './SearchInput'
import { SidebarNav } from '@/src/app/companies/[companyId]/dashboard/recruiter/SidebarNav'
import  MobileSearchBar  from '../SearchBar/MobileSearchBar'


export const MobileMenu = ({ mobileMenuOpen, activeTab, setActiveTab }) => (
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="md:hidden bg-white shadow-lg z-40"
      >
        <div className="px-4 py-3 space-y-4">
          <MobileSearchBar />
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)