import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import {Header} from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Toaster } from "react-hot-toast";




export const metadata = {
  title: "Messages",
};

export default function RootLayout({ children }) {
  return (
      <div
        className={`antialiased text-[15px] flex flex-col h-screen overflow-hidden`}
      >  
        <AuthProvider>
          <Header />
          <div className="flex-1 flex  h-screen overflow-hidden">{children}

          </div>
          <Toaster
        position="top-right"
        toastOptions={{
          success: { duration: 3000, style: { background: '#d4edda', color: '#155724' } },
          error: { duration: 5000, style: { background: '#f8d7da', color: '#721c24' } },
        }}
      />
        </AuthProvider>
      </div>
  );
}