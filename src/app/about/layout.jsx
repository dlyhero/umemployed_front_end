// src/app/(auth)/accountType/layout.jsx
import { Header } from "@/src/components/common/Header";
import "../../app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer";




export const metadata = {
  title: "About",
};

export default function ResumeLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px]`}
      > 
       <AuthProvider>
       <Header />
       {children}  
       <Footer />
       </AuthProvider>
      </body>
    </html>
  );
}