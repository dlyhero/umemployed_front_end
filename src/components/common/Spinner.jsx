"use client";
import { UilSpinner } from '@iconscout/react-unicons';

export default function Spinner({ fullPage = false }) {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : ''}`}>
      <UilSpinner className="animate-spin h-4 w-4 text-brand" />
    </div>
  );
}