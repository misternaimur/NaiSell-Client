/** @format */
"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faWater,
  faTrashAlt,
  faGlobeAmericas,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function SustainabilityImpact() {
  const impacts = [
    {
      id: 1,
      icon: faLeaf,
      title: "Carbon Offset",
      stat: "65%",
      description:
        "Reduction in CO2 emissions when extending a product's lifecycle instead of buying brand new.",
    },
    {
      id: 2,
      icon: faWater,
      title: "Water Saved",
      stat: "2.7k L",
      description:
        "Average amount of water preserved per pre-loved cotton item kept in circulation.",
    },
    {
      id: 3,
      icon: faTrashAlt,
      title: "Waste Diverted",
      stat: "140M",
      description:
        "Tons of textile and electronic waste prevented from entering landfills globally each year.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[#f8faf7] relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#00543c]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-72 h-72 bg-[#F2A93B]/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN: TEXT INFO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#bec9c2]/40 shadow-[0_2px_6px_rgba(0,0,0,0.02)] text-[#00543c] rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ fontFamily: "Inter" }}
              >
                <FontAwesomeIcon
                  icon={faGlobeAmericas}
                  className="text-[#00543c] animate-[spin_8s_linear_infinite]"
                />
                Our Eco Mission
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#181d1a] leading-[1.15]"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                Small Choices, <br />
                <span className="text-[#00543c] bg-gradient-to-r from-[#00543c] to-[#096c4f] bg-clip-text text-transparent">
                  Massive Planetary Impact
                </span>
              </h2>
            </div>

            <p
              className="text-sm sm:text-base text-[#4a554e] leading-relaxed"
              style={{ fontFamily: "Inter" }}
            >
              Every pre-loved item you buy or sell on NaiSell Hub changes
              the equation. By giving quality goods a second life, we bypass the
              heavy environmental toll of manufacturing, resource extraction,
              and global shipping.
            </p>

            <div className="pt-2">
              <Button
                endContent={
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xs group-hover:translate-x-1 transition-transform"
                  />
                }
                className="group bg-[#00543c] hover:bg-[#054331] text-white font-semibold px-6 h-12 rounded-xl shadow-md shadow-[#00543c]/10 transition-all duration-300"
                style={{ fontFamily: "Inter" }}
              >
                Learn More About Our Green Initiative
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: IMPACT CARDS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {impacts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8 }}
                className="bg-white/80 backdrop-blur-md border border-white hover:border-[#00543c]/30 rounded-2xl p-6 flex flex-col justify-between h-full shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default"
              >
                <div className="space-y-5">
                  {/* Icon Wrapper Layer */}
                  <div className="w-12 h-12 rounded-xl bg-[#f1f5f0] text-[#00543c] flex items-center justify-center shadow-sm group-hover:bg-[#00543c] group-hover:text-white group-hover:rotate-[6deg] transition-all duration-300 text-base">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>

                  {/* Stat Big Number */}
                  <h3
                    className="text-3xl sm:text-4xl font-black text-[#181d1a] tracking-tight group-hover:text-[#00543c] transition-colors duration-200"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {item.stat}
                  </h3>
                </div>

                <div className="space-y-1.5 mt-8">
                  <h4
                    className="text-sm font-bold text-[#181d1a] tracking-tight"
                    style={{ fontFamily: "Inter" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[12px] text-[#556359] leading-relaxed"
                    style={{ fontFamily: "Inter" }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
