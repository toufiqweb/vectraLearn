"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-card-bg/50 border border-card-border animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-card-bg hover:border-brand-mint/50 hover:bg-brand-ocean/5 border border-card-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 focus:ring-offset-background group"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-brand-ocean group-hover:text-brand-cyan" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-brand-cyan group-hover:text-brand-mint" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
