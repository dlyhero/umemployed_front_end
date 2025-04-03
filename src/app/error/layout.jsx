// src/app/(auth)/accountType/layout.jsx
import { Header } from "@/src/components/common/Header";
import "../globals.css";
import AuthProvider from "@/src/components/AuthProvider";




export const metadata = {
  title: "Account Type",
};

export default function AccountTypeLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px]`}
      > 
       <AuthProvider>
       <Header />
       {children}                                     
       </AuthProvider>
      </body>
    </html>
  );
}