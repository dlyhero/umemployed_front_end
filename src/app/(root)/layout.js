import { Geist, Geist_Mono } from "next/font/google";
import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-[15px]`}
      >  
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}