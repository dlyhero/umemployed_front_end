import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer3 from "@/src/components/common/Footer/Footer3";
import {Header} from "@/src/components/common/Header";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";



export const metadata = {
  title: `Profile `,
};



export default function ProfileLayout({ children }) {
  return (
      <div
        className={` antialiased text-[15px]`}
      >  
        <AuthProvider>
          <Header />
          {children}
          <Footer3 />
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </div>
  );
}