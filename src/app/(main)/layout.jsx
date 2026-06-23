
import Navbar from "@/components/Site/Navbar";
import Footer from "@/components/Site/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export default function RootLayout({ children }) {
  return (
    <>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
       <div className="flex flex-col min-h-screen bg-[#f1f5f0] font-sans dark:bg-black">
          {children}
        </div>
        <Footer />
    
    </>
  );
}
