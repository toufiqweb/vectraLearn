"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import mainLightModeLogo from "@/assets/mainLightModeLogo.png";
import mainlogo from "@/assets/mainLogo2.png";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  LayoutDashboard,
  PlayCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(String(err?.message || err || "Something went wrong"));
      setIsLoading(false);
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
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero / Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 hero-bg relative items-center justify-center p-12 overflow-hidden border-r border-card-border">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-main-gradient opacity-5"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-mint/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <Image
              src={mainLightModeLogo}
              alt="VectraLern"
              width={220}
              height={60}
              className="dark:hidden block w-[180px] h-auto"
            />
            <Image
              src={mainlogo}
              alt="VectraLern"
              width={220}
              height={60}
              className="hidden dark:block w-[180px] h-auto"
            />
          </Link>

          <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6 tracking-tight">
            Unlock Your Potential with{" "}
            <span className="text-main-gradient">Expert-Led</span> Courses.
          </h1>
          <p className="text-lg text-muted font-medium mb-12">
            Join thousands of learners worldwide. Upgrade your skills and
            accelerate your career growth with interactive learning.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-card-border hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-mint/10 text-brand-mint shrink-0 border border-brand-mint/20">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Top Instructors
                </h4>
                <p className="text-xs text-muted font-medium">
                  Learn from the best industry experts globally.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-card-border hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan shrink-0 border border-brand-cyan/20">
                <PlayCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Interactive Content
                </h4>
                <p className="text-xs text-muted font-medium">
                  Engage with high-quality videos and assignments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-card-border hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ocean/10 text-brand-ocean shrink-0 border border-brand-ocean/20">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Track Progress
                </h4>
                <p className="text-xs text-muted font-medium">
                  Monitor your learning journey efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:px-24 bg-background relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden z-20">
          <Link href="/">
            <Image
              src={mainLightModeLogo}
              alt="VectraLern"
              width={220}
              height={60}
              className="dark:hidden block w-[150px] h-auto"
            />
            <Image
              src={mainlogo}
              alt="VectraLern"
              width={220}
              height={60}
              className="hidden dark:block w-[150px] h-auto"
            />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-muted text-sm font-medium">
              Sign in to your account to continue learning.
            </p>
          </div>

          {/* Social Auth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-card-border bg-card-bg hover:bg-foreground/5 text-primary font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-sm"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center py-7">
            <div className="border-t border-card-border w-full"></div>
            <span className="absolute bg-background px-4 text-[10px] font-black tracking-widest text-muted uppercase">
              OR
            </span>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground placeholder:text-muted focus:border-brand-mint focus:ring-1 focus:ring-brand-mint outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-bold text-brand-ocean hover:text-brand-mint transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground placeholder:text-muted focus:border-brand-mint focus:ring-1 focus:ring-brand-mint outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-main-gradient text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-ocean hover:text-brand-mint font-bold transition-colors"
            >
              Create one
            </Link>
          </p>

          <div className="mt-10 flex items-center justify-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-card-bg/50 py-2 rounded-lg border border-card-border">
            <ShieldCheck size={14} className="text-brand-mint" />
            <span>Secure Encrypted Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
