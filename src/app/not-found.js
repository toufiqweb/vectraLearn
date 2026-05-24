"use client";

import Link from "next/link";
import React from "react";
import { Compass, Home, HelpCircle, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="hero-bg min-h-screen flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Main Glassmorphism 404 Display Frame */}
        <div className="glass-card rounded-3xl border border-[var(--glass-border)] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative soft purple radial glow inside the card */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[var(--brand-purple)]/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Animated/Styled Discovery Compass Icon Container */}
          <div className="w-16 h-16 bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--brand-purple)]/20 shadow-inner">
            <Compass className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
          </div>

          {/* Master 404 Display Elements */}
          <h1 className="text-7xl font-black text-main-gradient tracking-tighter mb-2">
            404
          </h1>
          
          <h2 className="text-xl font-bold text-primary tracking-tight mb-3">
            Route Destination Not Found
          </h2>
          
          <p className="text-secondary text-sm leading-relaxed max-w-xs mx-auto mb-8">
            The layout directory or page path parameters you are trying to pull don&apos;t exist or have been completely parsed out of system files.
          </p>

          {/* Navigational Anchor Workspace Triggers */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/support"
              className="flex-1 order-2 sm:order-1 border border-[var(--glass-border)] bg-[var(--card-bg)] hover:bg-[var(--glass-border)] text-primary font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-muted" />
              Get Support
            </Link>

            <Link
              href="/"
              className="flex-1 order-1 sm:order-2 bg-main-gradient text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer select-none border-none outline-none shadow-md hover:translate-y-[-1px]"
            >
              <Home className="w-4 h-4" />
              Go Back Home
            </Link>
          </div>

          {/* Secondary Escape Action Anchor */}
          <div className="mt-8 pt-5 border-t border-[var(--glass-border)]">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors tracking-wide uppercase group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Return to primary workspace
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;