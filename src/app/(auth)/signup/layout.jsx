import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/src/components/common/Header/index";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sign Up",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-[15px]`}
      >  
      <Header />
        {children}
      </body>
    </html>
  );
}
