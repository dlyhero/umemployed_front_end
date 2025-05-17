import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";

import { Toaster } from "sonner";



export const metadata = {
  title: "home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px]`}
      >  
        <AuthProvider>
          
          {children}
          
          <Toaster position="top-center" richColors/>
        </AuthProvider>
      </body>
    </html>
  );
}