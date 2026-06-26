
import Navbar from "@/components/Site/Navbar";
import Footer from "@/components/Site/Footer";

export default function RootLayout({ children }) {
  return (
    <>
        <Navbar />
       <div className="flex flex-col min-h-screen bg-surface-container-low text-on-surface font-sans">
          {children}
        </div>
        <Footer />
    
    </>
  );
}
