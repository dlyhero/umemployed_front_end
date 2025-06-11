'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchInput } from '../../../../components/common/dashboard/SearchInput'
import MobileSearchBar from '../../../../components/common/SearchBar/MobileSearchBar'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SidebarNav } from './SidebarNav'

export const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, activeTab, setActiveTab }) => {
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen, setMobileMenuOpen])

  // Close menu when clicking a nav item
  const handleNavItemClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30"
          />
          
          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="px-4 py-3 space-y-4">
              {/* Close button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              <MobileSearchBar />
              <SidebarNav
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab)
                  handleNavItemClick()
                }} 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}