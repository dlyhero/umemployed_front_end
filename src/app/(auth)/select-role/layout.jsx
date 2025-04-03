// src/app/(auth)/accountType/layout.jsx
import "../../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';



export const metadata = {
  title: "Account Type",
};

export default function AccountTypeLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px]`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}