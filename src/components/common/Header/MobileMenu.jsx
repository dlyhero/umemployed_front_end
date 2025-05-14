"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';
import { MenuLinks } from './MenuLinks';
import  MenuAuthButtons  from '../MenuAuthButtons'

// 6. MobileMenu.js
export function MobileMenu({ isOpen, onClose }) {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
  
      const handleResize = () => {
        if (window.innerWidth > 768) {
          onClose();
        }
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        document.body.style.overflow = 'auto';
      };
    }, [isOpen, onClose]);
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 flex flex-col bg-white max-w-sm w-full p-6 shadow-lg  md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <Logo />
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <MenuLinks />
              <div className="mt-8">
                <MenuAuthButtons />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }