"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Cpu, RefreshCw } from "lucide-react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(10);

  // Micro-simulation to mimic active system data pipeline initialization
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 25;
        return Math.min(oldProgress + diff, 100);
      });
    }, 280);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="hero-bg min-h-screen flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-sm">
        
        {/* Main Fluid Loading Glassmorphism Frame Container */}
        <div className="glass-card rounded-3xl border border-[var(--glass-border)] p-8 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative back panel blurred ambient tracking points */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--brand-purple)]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[var(--brand-indigo)]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

          {/* Central Rotating Progress Ring Vector Framework */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            {/* SVG Track Perimeter Base */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="5"
                className="text-[var(--glass-border)] fill-transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#loading-gradient)"
                strokeWidth="6"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                strokeLinecap="round"
                className="fill-transparent transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-gradient-start)" />
                  <stop offset="100%" stopColor="var(--primary-gradient-end)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Axis Lucide Core Spinner Element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--brand-purple)] animate-spin" />
            </div>
          </div>

          {/* Context Metric Indicators Labeling */}
          <h3 className="text-lg font-black text-primary tracking-tight mb-1">
            Synchronizing Workspace
          </h3>
          
          <p className="text-muted text-xs font-semibold tracking-wider uppercase mb-6 flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[var(--brand-indigo)]" />
            Compiling Modules {Math.floor(progress)}%
          </p>

          {/* Fluid Horizontal Skeleton Loading Bar Track */}
          <div className="w-full h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-main-gradient transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Secondary Footer Security Checkpoint Logs */}
          <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4 text-[11px] font-bold tracking-wider uppercase text-muted">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> TLS Active
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-reverse-spin" /> Parsing State
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadingPage;