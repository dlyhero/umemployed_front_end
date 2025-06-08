'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SubscriptionModal({ isOpen, onClose, errorMessage }) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Upgrade Required</DialogTitle>
          <DialogDescription className="text-center">
            {errorMessage || 'This feature requires an active subscription.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <p className="text-gray-700">
              To post jobs and access premium features, please upgrade your account.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-center">Premium Benefits:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Post unlimited jobs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                AI-powered job description generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Priority job listings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Advanced analytics
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            onClick={() => router.push('/companies/pricing')}
            className="flex-1 bg-brand hover:bg-brand/90 text-white"
          >
            View Subscription Plans
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Go Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}