import "@/src/app/globals.css";





export const metadata = {
  title: "Ue",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-[15px] flex flex-col h-screen overflow-hidden`}
      >  
          {children}

          
      </body>
    </html>
  );
}