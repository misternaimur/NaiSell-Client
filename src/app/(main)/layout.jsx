
import Navbar from "@/components/Site/Navbar";
import Footer from "@/components/Site/Footer";

export default function RootLayout({ children }) {
  return (
    <>
        <Navbar />
       <div className="flex flex-col min-h-screen bg-[#f1f5f0] font-sans dark:bg-black">
          {children}
        </div>
        <Footer />
    
    </>
  );
}
