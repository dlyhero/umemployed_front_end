import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer3 from "@/src/components/common/Footer/Footer3";
import { Header } from "@/src/components/common/Header";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";



export const metadata = {
  title: `Profile `,
};



export default function ShortListedJobsLayout({ children }) {
  return (
    <div
      className={` antialiased text-[15px]`}
    >
      <AuthProvider>
        <Header />
        {children}
        <footer className="w-full text-center py-4 text-sm text-gray-500 ">
          &copy; {new Date().getFullYear()} UmEmployed. All rights reserved.
        </footer>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </div>
  );
}