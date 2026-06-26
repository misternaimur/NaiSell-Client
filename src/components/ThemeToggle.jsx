"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("naisell-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      const timer = setTimeout(() => {
        setDark(true);
      }, 0);
      document.documentElement.classList.add("dark");
      return () => clearTimeout(timer);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("naisell-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("naisell-theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-[8px] text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon icon={dark ? faSun : faMoon} className="w-4 h-4" />
    </button>
  );
}
