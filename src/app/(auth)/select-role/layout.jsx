// src/app/(auth)/accountType/layout.jsx
import "../../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';
import { Toaster } from "sonner";



export const metadata = {
  title: "Account Type",
};

export default function AccountTypeLayout({ children }) {
  return (
    <>
      <div
        className={` antialiased text-[15px]`}
      >
        {children}
        <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000, style: { background: '#d4edda', color: '#155724' } },
          error: { duration: 5000, style: { background: '#f8d7da', color: '#721c24' } },
        }}
      />
        <Footer />
      </div>
    </>
  );
}