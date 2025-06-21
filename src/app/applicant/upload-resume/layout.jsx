// src/app/(auth)/accountType/layout.jsx
import { Header } from "@/src/components/common/Header";
import "../../globals.css";
import AuthProvider from "@/src/components/AuthProvider";




export const metadata = {
  title: "Upload Resume",
};

export default function ResumeLayout({ children }) {
  return (
      <div
        className={` antialiased text-[15px]`}
      > 
       <AuthProvider>
       <Header />
       {children}  
       </AuthProvider>
      </div>
  );
}