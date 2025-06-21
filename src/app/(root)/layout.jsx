import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import {Header} from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Toaster } from "sonner";



export const metadata = {
  title: "home",
};

export default function RootLayout({ children }) {
  return (
      <div
        className={` antialiased text-[15px]`}
      >  
        <AuthProvider>
          {children}
          <Footer />
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </div>
  );
}