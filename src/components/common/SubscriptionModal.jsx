'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '../../components/common/Header/Logo';

export const SubscriptionModal = ({ isOpen, onClose, errorMessage }) => {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Subscription Required</h2>
            <p className="text-gray-600 mb-6 text-center">
              {errorMessage || 'You have reached your daily quota. Upgrade your plan to continue posting or cancel.'}
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                className="bg-[#1e90ff] text-white hover:bg-[#1c86ee]"
              >
                Upgrade
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
