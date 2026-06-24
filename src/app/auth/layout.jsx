import Navbar from "@/components/Site/Navbar";
import Footer from "@/components/Site/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f0] font-sans dark:bg-black">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
