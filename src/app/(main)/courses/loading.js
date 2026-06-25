import { Skeleton, Spinner } from "@heroui/react";
import React from "react";
import { Terminal, Layers, Grid2X2 } from "lucide-react";

const CourseLoadingSkeleton = () => {
  // Generate an array of 6 elements to construct a realistic course layout matrix
  const skeletonCards = Array.from({ length: 6 });

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 py-12 pt-28 lg:pt-36 px-4 transition-colors duration-300 overflow-hidden">
      
      {/* Background Cyber-Aesthetic Vector Glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl relative z-10">
        
        {/* =========================================================
            SECTION 1: Header Skeletons (Title & Description)
            ========================================================= */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          {/* Tagline Badge Placeholder */}
          <div className="mx-auto w-48 h-7 bg-purple-500/5 border border-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 rounded-full bg-purple-500/20 animate-ping mr-2" />
            <div className="w-24 h-2.5 bg-purple-500/20 rounded-md" />
          </div>

          {/* Heading Lines */}
          <Skeleton className="h-10 sm:h-12 w-3/4 mx-auto rounded-xl bg-white/[0.03]" />
          <Skeleton className="h-4 sm:h-5 w-5/6 mx-auto rounded-lg bg-white/[0.02]" />
        </div>

        {/* =========================================================
            SECTION 2: Interactive Toolbar Skeleton (Search/Filter Control)
            ========================================================= */}
        <div className="w-full max-w-xl mx-auto bg-card-bg/40 transition-colors duration-300 border border-card-border transition-colors duration-300 p-2 rounded-2xl shadow-xl backdrop-blur-md">
          <Skeleton className="h-12 w-full rounded-xl bg-white/[0.04]" />
        </div>

        {/* =========================================================
            SECTION 3: Core Grid Matrix Stream (6-Card Skeleton Deck)
            ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {skeletonCards.map((_, idx) => (
            <div 
              key={idx} 
              className="bg-card-bg/40 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] border border-card-border transition-colors duration-300 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between p-5 space-y-5"
            >
              <div className="space-y-4">
                {/* Simulated Thumbnail Frame Container */}
                <div className="h-44 w-full bg-card-bg/60 transition-colors duration-300 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/[0.02]">
                  <div className="absolute inset-0 bg-gradient-to-t from-card-bg/50 transition-colors duration-300 via-transparent to-transparent opacity-40" />
                  <Skeleton className="w-full h-full rounded-2xl bg-white/[0.03]" />
                </div>
                
                {/* Meta Category Tag & Duration Row */}
                <div className="flex justify-between items-center px-1">
                  <Skeleton className="h-4 w-24 rounded-md bg-white/[0.04]" />
                  <Skeleton className="h-4 w-16 rounded-md bg-white/[0.02]" />
                </div>

                {/* Course Title Line Segments */}
                <div className="space-y-2 px-1">
                  <Skeleton className="h-5 w-full rounded-md bg-white/[0.04]" />
                  <Skeleton className="h-5 w-4/5 rounded-md bg-white/[0.04]" />
                </div>

                {/* Description Snippet Block */}
                <div className="space-y-1.5 px-1 pt-1">
                  <Skeleton className="h-3 w-full rounded-sm bg-white/[0.02]" />
                  <Skeleton className="h-3 w-full rounded-sm bg-white/[0.02]" />
                  <Skeleton className="h-3 w-2/3 rounded-sm bg-white/[0.02]" />
                </div>
              </div>

              {/* Card Footer Segment (Author / Call to Action) */}
              <div className="pt-4 border-t border-card-border transition-colors duration-300 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-7 h-7 rounded-lg bg-white/[0.03]" />
                  <Skeleton className="h-3.5 w-20 rounded-md bg-white/[0.02]" />
                </div>
                <Skeleton className="h-8 w-24 rounded-xl bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================
            SECTION 4: Lower Telemetry Diagnostic Feedback
            ========================================================= */}
        <div className="max-w-md mx-auto bg-card-bg/90 transition-colors duration-300 border border-card-border transition-colors duration-300 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#8b7eff] flex items-center justify-center shrink-0">
              <Spinner size="sm" color="secondary" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[9px] font-black tracking-widest text-muted transition-colors duration-300 uppercase flex items-center gap-1">
                <Terminal className="w-2.5 h-2.5" /> Pipeline Handshake
              </p>
              <p className="text-xs font-mono font-medium text-secondary transition-colors duration-300 truncate mt-0.5 animate-pulse">
                Parsing active database curriculum registries...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wide shrink-0">
            <Grid2X2 className="w-3 h-3" /> Grid Stream
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseLoadingSkeleton;