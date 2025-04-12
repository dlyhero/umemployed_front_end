"use client";

import "@/src/app/globals.css";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer/Footer";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-[15px]">
        <SessionProvider>
          <Header />
          {children}
                <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}