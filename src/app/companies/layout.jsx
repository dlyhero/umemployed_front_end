import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import {Header} from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer/index";
import ToastProvider from '../../components/common/ToastProvider';



export const metadata = {
  title: "Companies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-[15px]`}
      >  
        <AuthProvider>
        <ToastProvider />
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}