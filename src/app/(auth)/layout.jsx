import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import FooterCopyright from "@/src/components/common/Footer/FooterCopyright";
import {Header} from "@/src/components/common/Header";





export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased text-[15px]`}
      >  
        <AuthProvider>
          <Header />
          {children}
          <FooterCopyright />
        </AuthProvider>
      </body>
    </html>
  );
}