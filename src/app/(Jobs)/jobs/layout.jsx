import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer";
import {Header} from "@/src/components/common/Header";



export const metadata = {
  title: "Job-Listing",
};

export default function RootLayout({ children }) {
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