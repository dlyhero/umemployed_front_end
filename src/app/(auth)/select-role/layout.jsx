// src/app/(auth)/accountType/layout.jsx
import "../../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';
import { Toaster } from "sonner";
import AuthProvider from "@/src/components/AuthProvider";



export const metadata = {
  title: "Account Type",
};

export default function AccountTypeLayout({ children }) {
  return (
    <>
      <div
        className={` antialiased text-[15px]`}
      ><AuthProvider>
          {children}
        <Toaster

        position="top-center"
        richColors
      />
        <Footer />

      </AuthProvider>
      
      </div>
    </>
  );
}