/** @format */

import Link from "next/link";
import { ShoppingBag } from "@gravity-ui/icons";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <div className="bg-primary p-2 rounded-xl text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105 duration-200">
        <ShoppingBag className="text-xl" />
      </div>

      <div className="flex flex-col">
        <span className="font-black text-xl tracking-tight text-on-surface font-display">
          NaiSell <span className="text-primary">Hub</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
