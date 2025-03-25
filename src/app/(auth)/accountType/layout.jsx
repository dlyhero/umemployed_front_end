// src/app/(auth)/accountType/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';

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
        <Footer />
      </body>
    </html>
  );
}