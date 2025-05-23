import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import FooterCopyright from "@/src/components/common/Footer/FooterCopyright";
import {Header} from "@/src/components/common/Header";





export default function RootLayout({ children }) {
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