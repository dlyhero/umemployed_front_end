import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer/Footer";
import {Header} from "@/src/components/common/Header";
import { Toaster } from "sonner";


export const metadata = {
    title: "resume advisor",
  };
  



export default function ResumeAvisorLayout({ children }) {
  return (
      <div
        className={` antialiased text-[15px] bg-white`}
      >  
        <AuthProvider>
          <Header />
          <div className="min-h-screen flex flex-col">{children}
          <div className="items-end"><Footer /></div>
          </div>
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </div>
  );
}