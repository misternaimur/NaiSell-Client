/** @format */
"use client";

import React from "react";
import { motion } from "motion/react";
import { Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

export default function SuccessStories({ stories = [] }) {

  const displayStories =
    stories.length > 0
      ? stories
      : [
          {
            _id: "story001",
            name: "Anika Rahman",
            role: "Verified Buyer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika",
            rating: 5,
            comment:
              "I was hesitant about buying a pre-loved designer handbag, but NaiSell's verification process gave me full confidence. The item arrived in absolute pristine condition!",
            itemTraded: "Classic Heritage Leather Tote",
          },
          {
            _id: "story002",
            name: "Tanvir Ahmed",
            role: "Verified Seller",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir",
            rating: 5,
            comment:
              "Sold my gaming console within 48 hours of listing. The payout was incredibly fast, and the communication with the buyer was seamless. Highly recommended platform!",
            itemTraded: "Midnight Series X",
          },
          {
            _id: "story003",
            name: "Arif Chowdhury",
            role: "Verified Buyer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arif",
            rating: 5,
            comment:
              "Found an amazing deal on a titanium smartwatch. The platform is clean, elegant, and avoids all the clutter of traditional resale websites. A premium experience.",
            itemTraded: "Ultra Titanium Smartwatch",
          },
        ];

  return (
    <section className="bg-[#f7faf6] py-20 px-4 sm:px-6 lg:px-12 border-t border-[#bec9c2]/20">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span
            className="inline-block px-3 py-1 bg-[#00543c]/10 text-[#00543c] rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{ fontFamily: "Inter" }}
          >
            Community Voices
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#181d1a]"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Trust Made Visible Through <br />
            <span className="text-[#00543c]">Our Success Stories</span>
          </h2>
          <p
            className="text-sm sm:text-base text-[#3f4943]"
            style={{ fontFamily: "Inter" }}
          >
            Hear from the buyers and sellers who are reshaping the future of
            resale.
          </p>
        </div>

        {/* STORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {displayStories.map((story) => (
            <motion.div
              key={story._id}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 32px -12px rgba(0,0,0,0.06)",
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-[#bec9c2]/30 flex flex-col justify-between h-full shadow-[0_4px_16px_rgba(0,0,0,0.01)] relative overflow-hidden group"
            >
              {/* Quote Icon Overlay */}
              <div className="absolute top-4 right-6 text-[#00543c]/5 group-hover:text-[#00543c]/10 transition-colors duration-300">
                <FontAwesomeIcon
                  icon={faQuoteLeft}
                  className="text-5xl lg:text-6xl"
                />
              </div>

              <div className="space-y-4 z-10">
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(story.rating || 5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="w-3.5 h-3.5 text-[#F2A93B]"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p
                  className="text-sm sm:text-base text-[#3f4943] italic leading-relaxed"
                  style={{ fontFamily: "Inter" }}
                >
                  "{story.comment}"
                </p>
              </div>

              {/* USER PROFILE INFO FOOTER */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#bec9c2]/20 z-10">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={story.avatar}
                    className="w-10 h-10 border border-[#bec9c2]/40 bg-[#f1f5f0]"
                  />
                  <div>
                    <h4
                      className="text-sm font-bold text-[#181d1a]"
                      style={{ fontFamily: "Inter" }}
                    >
                      {story.name}
                    </h4>
                    <p
                      className="text-xs text-[#00543c] font-medium"
                      style={{ fontFamily: "Inter" }}
                    >
                      {story.role}
                    </p>
                  </div>
                </div>

                {/* Traded Product Tag */}
                {story.itemTraded && (
                  <span className="text-[10px] font-semibold bg-[#f1f5f0] text-[#3f4943] px-2.5 py-1 rounded-md max-w-[120px] truncate">
                    {story.itemTraded}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
