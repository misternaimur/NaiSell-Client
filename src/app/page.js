import Hero from "@/components/Hero";
import Image from "next/image";
import Chategories from "@/components/Categories";
import CuratedArrivals from "@/components/CuratedArrivals";
import SuccessStories from "@/components/SuccessStories";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Hero />
      <Chategories />
      <CuratedArrivals />
      <SuccessStories />
    </div>
  );
}
