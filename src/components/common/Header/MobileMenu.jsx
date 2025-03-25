import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import MenuAuthButtons from '../MenuAuthButtons'
import MenuLinks from './MenuLinks';

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

                    {/*Menu Links*/}
                    <MenuLinks />
                    {/* Authentication Buttons */}
                    <MenuAuthButtons />
                </motion.div>
            )}
        </AnimatePresence>
    );
}