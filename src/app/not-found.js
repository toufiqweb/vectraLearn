import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Activity, AlertCircle } from "lucide-react";
import mainLightModeLogo from "@/assets/mainLightModeLogo.png";
import mainlogo from "@/assets/mainLogo2.png";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center hero-bg p-4 overflow-hidden relative">
      {/* Ambient background glowing orbs using brand variables */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-brand-ocean/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-brand-cyan/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Container */}
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

        {/* 404 Visual Header */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[180px] font-black text-main-gradient tracking-tighter leading-none select-none drop-shadow-sm">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 dark:bg-[#093c5d]/80 backdrop-blur-md p-4 rounded-2xl shadow-glow border border-brand-cyan/20">
              <AlertCircle className="w-10 h-10 text-brand-ocean dark:text-brand-mint" />
            </div>
          </div>
        </div>

        {/* Standardized Typography from theme */}
        <h2 className="section-title mb-4">Page not found</h2>

        <p className="section-desc max-w-lg mx-auto mb-10 text-muted">
          We couldn't find the page you're looking for. It might have been
          moved, deleted, or perhaps the URL is incorrect.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          {/* Primary Action Button */}
          <Link
            href="/"
            className="w-full sm:w-1/2 px-6 py-4 rounded-xl bg-main-gradient text-white font-bold tracking-wide shadow-glow hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          {/* Secondary Action Button */}
          <Link
            href="/courses"
            className="w-full sm:w-1/2 px-6 py-4 border-gradient text-secondary font-bold tracking-wide hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 glass-card rounded-xl"
          >
            <Search className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>

        {/* Subtle Diagnostic Footer */}
        <div className="mt-16 flex items-center gap-2 text-muted text-xs font-mono font-medium opacity-70 bg-glass-bg border border-glass-border px-4 py-2 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          <span>STATUS: ERR_RESOURCE_NOT_FOUND</span>
        </div>
      </div>
    </main>
  );
}
