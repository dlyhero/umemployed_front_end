'use client';

import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import DescriptionContent from './DescriptionContent'; // import the child component

export default function DescriptionPage() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <DescriptionContent />
      </Suspense>
    </>
  );
}
