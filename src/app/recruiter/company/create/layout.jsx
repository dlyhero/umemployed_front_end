"use client";

import { SessionProvider } from 'next-auth/react';
import { Header } from '@/src/components/common/Header/index'; // Changed to named import
import Footer from '@/src/components/common/Footer/Footer';

export default function CompanyCreateLayout({ children }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}