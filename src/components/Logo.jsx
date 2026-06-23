/** @format */

import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      
      <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105 duration-200">
        <FaShoppingBag className="text-xl" />
      </div>

      <div className="flex flex-col">
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 bg-clip-text text-transparent font-display">
          NaiSell <span className="text-emerald-500">Hub</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
