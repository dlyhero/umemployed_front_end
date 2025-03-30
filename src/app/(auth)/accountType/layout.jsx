// src/app/(auth)/accountType/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Account Type",
};

export default function AccountTypeLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-[15px]`}
      >
        {children}
        <Toaster
        position="top-right"
        toastOptions={{
          success: { duration: 3000, style: { background: '#d4edda', color: '#155724' } },
          error: { duration: 5000, style: { background: '#f8d7da', color: '#721c24' } },
        }}
      />
        <Footer />
      </body>
    </html>
  );
}