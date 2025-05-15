'use client';

import { Suspense } from 'react';
import PaymentCancelContent from './PaymentCancelContent';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
