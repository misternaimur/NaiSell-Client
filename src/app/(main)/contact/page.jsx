/** @format */

"use client";

import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const contactItems = [
  {
    title: "Email",
    value: "hello@naisell.com",
    icon: <FaEnvelope className="text-cyan-400" />,
  },
  {
    title: "Phone",
    value: "+880 1700 000 000",
    icon: <FaPhoneAlt className="text-cyan-400" />,
  },
  {
    title: "Office",
    value: "Dhaka, Bangladesh",
    icon: <FaMapMarkerAlt className="text-cyan-400" />,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080c18] px-4 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Contact Us
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            We are here to help.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Reach out for product questions, account support, or anything
            related to the NaiSell experience.
          </p>

          <div className="mt-8 space-y-4">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-400">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white">Send us a message</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              required
            />
            <textarea
              rows="5"
              placeholder="How can we help?"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {submitted ? "Message Sent" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
