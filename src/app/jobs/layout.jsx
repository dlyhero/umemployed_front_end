import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer";
import {Header} from "@/src/components/common/Header";
import { Toaster } from "sonner";



export const metadata = {
  title: "Job-Listing",
};

export default function RootLayout({ children }) {
  return (
        <div
        className={` antialiased text-[15px]`}
      >  
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </div>
  );
}