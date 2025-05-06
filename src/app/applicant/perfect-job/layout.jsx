import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer/Footer";
import {Header} from "@/src/components/common/Header";
import { Toaster } from "sonner";


export const metadata = {
  title: "perfect job title",
};



export default function PerfectJobLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px] bg-white`}
      >  
        <AuthProvider>
          <Header />
          <div className="min-h-screen bg-gray-100 flex flex-col">{children}
          <div className="items-end"><Footer /></div>
          </div>
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </body>
    </html>
  );
}