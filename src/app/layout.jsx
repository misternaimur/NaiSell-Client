import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "NaiSell Hub - Premium Second-Hand Marketplace",
  description: "NaiSell Hub is a premium editorial second-hand marketplace offering verified trust and sustainable circular living.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
      >
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        {children}
      </body>
    </html>
  );
}
