// src/app/(auth)/accountType/layout.jsx
import "../globals.css";
import Header from "@/src/components/common/Header/index";
import Footer from '@/src/components/common/Footer/Footer';




export const metadata = {
  title: "home",
};

export default function RootLayout({ children }) {
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