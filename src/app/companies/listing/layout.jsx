import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import {Header} from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";




export const metadata = {
  title: "company list",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-[15px]`}
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
