'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkPaymentCancel } from '@/lib/api/endorsements';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function PaymentCancelContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId') || 'default';
    const { data: session, status } = useSession();
  
    useEffect(() => {
      if (status === 'loading') return;
  
      const handleCancel = async () => {
        try {
          if (status === 'authenticated') {
            await checkPaymentCancel(session.accessToken);
          }
          toast.error('Payment cancelled.');
        } catch (error) {
          toast.error(error.message || 'Error processing cancellation');
        }
      };
      handleCancel();
    }, [status, session]);
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">Payment Cancelled</h1>
          <p className="text-gray-600 mb-4">Your payment was cancelled. Please try again to view endorsements.</p>
          <Button
            onClick={() => router.push(`/companies/${companyId}/dashboard`)}
            className="bg-blue-600 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
}
