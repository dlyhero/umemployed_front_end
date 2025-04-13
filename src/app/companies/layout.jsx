import { Geist, Geist_Mono } from "next/font/google";
import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import { Header } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-[15px]">
        <AuthProvider>
          <Header />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              success: { duration: 3000, style: { background: '#d4edda', color: '#155724' } },
              error: { duration: 5000, style: { background: '#f8d7da', color: '#721c24' } },
            }}
          />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
