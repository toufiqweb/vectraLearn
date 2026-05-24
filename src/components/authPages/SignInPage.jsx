"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { Mail, Lock, ShieldAlert, LogIn, ArrowRight } from "lucide-react";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    const { email, password } = userData;

    try {
      const response = await authClient.signIn.email({
        email,
        password,
        rememberMe: false,
      });

      const data = response?.data;
      const error = response?.error;

      if (data) {
        toast.success("Login successful!");
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      toast.error(String(error?.message || error || "Something went wrong"));
    } catch (err) {
      console.error("Login error:", err);
      toast.error(String(err?.message || err || "Something went wrong"));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (!data) {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(String(err?.message || err || "Something went wrong"));
    }
  };

  return (
    <div className="hero-bg min-h-screen pt-28 lg:pt-36 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Unified Glassmorphism Card Frame */}
        <div className="glass-card rounded-3xl border border-[var(--glass-border)] overflow-hidden shadow-2xl">
          
          {/* Header Top Title Section */}
          <div className="bg-main-gradient px-8 py-10 text-white relative">
            {/* Soft decorative blur circle inside header area */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-3xl font-black text-center tracking-tight">
              Login to Your Account
            </h2>
            <p className="text-white/80 text-center text-sm font-medium mt-2 max-w-xs mx-auto">
              Welcome back! Sign in to continue your learning journey
            </p>
          </div>

          {/* Social Access Segment Area */}
          <div className="p-8 pb-0 space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-[var(--glass-border)] bg-[var(--card-bg)] hover:bg-[var(--glass-border)] text-primary font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              <FcGoogle className="text-2xl shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* Premium Cross-Section Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[var(--glass-border)] w-full"></div>
              <span className="absolute bg-[var(--background)] px-4 text-xs font-bold tracking-widest text-muted">
                OR
              </span>
            </div>
          </div>

          {/* Core Interactive Identification Inputs Form */}
          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
            
            {/* Email Address Input Workspace */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--brand-purple)]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Password Input Workspace */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--brand-indigo)]" />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-indigo)] focus:ring-2 focus:ring-[var(--brand-indigo)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Primary Submit CTA Switch */}
            <button
              type="submit"
              className="w-full bg-main-gradient text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none border-none outline-none text-base tracking-wide shadow-md hover:translate-y-[-1px]"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </form>

          {/* Redirection Navigation Footer Links */}
          <div className="px-8 py-5 border-t border-[var(--glass-border)] bg-[var(--card-bg)]/20 text-center">
            <p className="text-sm text-secondary">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="text-main-gradient font-bold tracking-wide inline-flex items-center gap-0.5 group">
                Register
                <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-purple)] transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>

        {/* Outer Micro Security Legal Framework Stamp */}
        <p className="text-center text-[11px] font-bold tracking-wider uppercase text-muted mt-6 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
          Secured by industry-leading encryption parameters
        </p>
      </div>
    </div>
  );
};

export default SignInPage;