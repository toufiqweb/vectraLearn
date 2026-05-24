"use client";

import Link from "next/link";
import React from "react";
import { AlertCircle, Home, RefreshCw, MoveLeft } from "lucide-react";

const ErrorPage = () => {
  // Safe window refresh execution logic for the retry trigger
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="hero-bg min-h-screen flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Main Glassmorphism Error Display Wrapper */}
        <div className="glass-card rounded-3xl border border-[var(--glass-border)] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative soft purple glow inside the background card matrix */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Main Contextual System Warning Icon Frame */}
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>

          {/* Error Message Structural Elements */}
          <h1 className="text-4xl font-black text-primary tracking-tight mb-3">
            System Exception
          </h1>
          
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-8">
            An unexpected breakdown or structural request error occurred while processing your query dataset. Please try your terminal execution again later.
          </p>

          {/* Operational Navigation CTA Routing Blocks */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReload}
              className="flex-1 order-2 sm:order-1 border border-[var(--glass-border)] bg-[var(--card-bg)] hover:bg-[var(--glass-border)] text-primary font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-muted" />
              Retry Operation
            </button>

            <Link
              href="/"
              className="flex-1 order-1 sm:order-2 bg-main-gradient text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none border-none outline-none shadow-md hover:translate-y-[-1px]"
            >
              <Home className="w-4 h-4" />
              Go Back Home
            </Link>
          </div>

          {/* Quick link escape segment anchor */}
          <div className="mt-8 pt-5 border-t border-[var(--glass-border)]">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors tracking-wide uppercase group"
            >
              <MoveLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to previous safety dashboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorPage;