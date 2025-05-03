import "@/src/app/globals.css";
import AuthProvider from "@/src/components/AuthProvider";
import Footer from "@/src/components/common/Footer/Footer3";
import { Header } from "@/src/components/common/Header";
import { Toaster } from "react-hot-toast";




export const metadata = {
    title: "Notifications",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`antialiased text-[15px]`}
            >
                <AuthProvider>
                    <Header />
                    <div className="w-full bg-white"> 
                        <div className="flex-1 flex  h-screen overflow-hidden max-w-6xl mx-auto">{children}
                    </div>
                    </div>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            success: { duration: 3000, style: { background: '#d4edda', color: '#155724' } },
                            error: { duration: 5000, style: { background: '#f8d7da', color: '#721c24' } },
                        }}
                    />
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}