'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSelectPayment }) => {
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const handlePayment = async () => {
    setIsStripeLoading(true);
    try {
      await onSelectPayment();
    } finally {
      setIsStripeLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Unlock candidate endorsements for $5. Your payment is secure and encrypted.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <Button
            onClick={handlePayment}
            disabled={isStripeLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300"
          >
            {isStripeLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            Pay with Stripe
          </Button>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
        </DialogFooter>
        <div className="text-center text-xs text-gray-500 mt-4">
          Secured by industry-standard encryption
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;