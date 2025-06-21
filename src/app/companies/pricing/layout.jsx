import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import { Toaster } from "react-hot-toast";




export const metadata = {
  title: "Pricing",
};

export default function RootLayout({ children }) {
  return (
      <div
        className={`antialiased text-[15px]`}
      >  
        <AuthProvider>
          {children}
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