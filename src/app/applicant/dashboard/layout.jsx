// src/app/(auth)/accountType/layout.jsx
import { Header } from "@/src/components/common/Header";
import "../../globals.css";
import AuthProvider from "@/src/components/AuthProvider";




export const metadata = {
  title: "Dashboard - Applicant",
  description: "Dashboard for applicants to manage their applications and profile.",
  keywords: "dashboard, applicant, job applications, profile management",
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "Dashboard - Applicant",
    description: "Dashboard for applicants to manage their applications and profile.",
    url: "https://yourwebsite.com/dashboard",
    siteName: "Your Website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },                        
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