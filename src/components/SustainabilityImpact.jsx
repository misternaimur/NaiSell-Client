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
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-surface relative overflow-hidden">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-72 h-72 bg-secondary-container/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT COLUMN: TEXT INFO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant/40 shadow-[0_2px_6px_rgba(0,0,0,0.02)] text-primary rounded-full text-xs font-bold uppercase tracking-wider font-sans">
                <FontAwesomeIcon
                  icon={faGlobeAmericas}
                  className="text-primary animate-[spin_8s_linear_infinite]"
                />
                Our Eco Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface leading-[1.15] font-display">
                Small Choices, <br />
                <span className="text-primary bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                  Massive Planetary Impact
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
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
                className="group bg-primary hover:bg-primary/95 text-white font-semibold px-6 h-12 rounded-[8px] shadow-sm transition-all duration-300 font-sans"
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
                className="bg-white/80 backdrop-blur-md border border-white hover:border-primary/30 rounded-2xl p-6 flex flex-col justify-between h-full shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group cursor-default"
              >
                <div className="space-y-5">
                  {/* Icon Wrapper */}
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white group-hover:rotate-[6deg] transition-all duration-300 text-base">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>

                  {/* Stat Big Number */}
                  <h3 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight group-hover:text-primary transition-colors duration-200 font-display">
                    {item.stat}
                  </h3>
                </div>

                <div className="space-y-1.5 mt-8">
                  <h4 className="text-sm font-bold text-on-surface tracking-tight font-sans">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed font-sans">
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
