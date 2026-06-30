"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Home, RefreshCw, Terminal } from "lucide-react";

import mainLightModeLogo from "@/assets/mainLightModeLogo.png";
import mainlogo from "@/assets/mainLogo2.png";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleReload = () => {
    if (reset) {
      reset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glowing orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-red-500/5 dark:bg-red-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-brand-cyan/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Brand Logo */}
        <Link
          href="/"
          className="mb-12 hover:opacity-80 transition-opacity drop-shadow-sm"
        >
          <Image
            src={mainLightModeLogo}
            alt="VectraLern"
            width={200}
            height={55}
            className="dark:hidden block w-[160px] sm:w-[200px] h-auto"
            priority
          />
          <Image
            src={mainlogo}
            alt="VectraLern"
            width={200}
            height={55}
            className="hidden dark:block w-[160px] sm:w-[200px] h-auto"
            priority
          />
        </Link>

        {/* Error Visual Header */}
        <div className="relative mb-6">
          <h1 className="text-[100px] sm:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500/80 to-red-600/20 dark:from-red-400 dark:to-red-900/30 tracking-tighter leading-none select-none drop-shadow-sm">
            500
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 dark:bg-[#093c5d]/80 backdrop-blur-md p-4 rounded-2xl shadow-glow border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Typography */}
        <h2 className="section-title mb-4">Application Error</h2>

        <p className="section-desc max-w-lg mx-auto mb-10 text-muted">
          We encountered an unexpected error while trying to process your
          request. Our engineering team has been notified.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          {/* Primary Action Button */}
          <button
            onClick={handleReload}
            className="w-full sm:w-1/2 px-6 py-4 rounded-xl bg-main-gradient text-white font-bold tracking-wide shadow-glow hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          {/* Secondary Action Button */}
          <Link
            href="/"
            className="w-full sm:w-1/2 px-6 py-4 border-gradient text-secondary font-bold tracking-wide hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 glass-card rounded-xl"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Error Digest */}
        <div className="mt-16 flex items-center gap-3 text-muted text-xs font-mono font-medium opacity-80 bg-glass-bg border border-glass-border px-5 py-2.5 rounded-full shadow-sm">
          <Terminal className="w-4 h-4 text-red-500/70" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-muted/70">
              Reference Code
            </span>
            <span className="truncate max-w-[200px] sm:max-w-xs">
              {error?.digest || "ERR_INTERNAL_SERVER_ERROR"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
