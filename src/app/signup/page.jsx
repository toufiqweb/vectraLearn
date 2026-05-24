"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { User, Image as ImageIcon, Mail, Lock, UserPlus, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";

const SignUpPage = () => {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    const { name, email, password, image } = userData;

    // Email verification structural match
    const emailVerification = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailVerification.test(email.toString())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation constraints
    if (password.toString().length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    } else if (!/[A-Z]/.test(password.toString())) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    } else if (!/[0-9]/.test(password.toString())) {
      toast.error("Password must contain at least one number");
      return;
    }

    try {
      const response = await authClient.signUp.email(
        {
          email: email.toString(),
          password: password.toString(),
          name: name.toString(),
          image: image ? image.toString() : undefined,
        },
        {
          onRequest: () => {
            // Loading hooks can be bound cleanly here
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(
              String(ctx?.error?.message || ctx?.error || "Something went wrong"),
            );
          },
        },
      );

      const data = response?.data;
      const error = response?.error;
      if (!data && error) {
        toast.error(String(error?.message || error || "Something went wrong"));
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(String(err?.message || err || "Something went wrong"));
    }
  };

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    if (!data) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="hero-bg min-h-screen pt-28 lg:pt-36 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Main Fluid Glassmorphism Profile Creation Card */}
        <div className="glass-card rounded-3xl border border-[var(--glass-border)] overflow-hidden shadow-2xl">
          
          {/* Header Visual Panel Identity */}
          <div className="bg-main-gradient px-8 py-10 text-white relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <h2 className="text-3xl font-black text-center tracking-tight">Create Account</h2>
            <p className="text-white/80 text-center text-sm font-medium mt-2">
              Join us and start your learning journey
            </p>
          </div>

          {/* Social OAuth Google Bridge */}
          <div className="p-8 pb-0 space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-[var(--glass-border)] bg-[var(--card-bg)] hover:bg-[var(--glass-border)] text-primary font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              <FcGoogle className="text-2xl shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* Content Splitting Intersection Separator */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[var(--glass-border)] w-full"></div>
              <span className="absolute bg-[var(--background)] px-4 text-xs font-bold tracking-widest text-muted">
                OR
              </span>
            </div>
          </div>

          {/* Interactive Core Payload Identification Registration Form */}
          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
            
            {/* Input Element: Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--brand-purple)]" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Input Element: Profile Picture Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--brand-indigo)]" />
                Profile Photo URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-indigo)] focus:ring-2 focus:ring-[var(--brand-indigo)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Input Element: Electronic Mailing Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--brand-blue)]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Input Element: Cryptographic Secure Cipher Block Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/20 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Control Operational Submission Triggers Grid Layer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 order-2 sm:order-1 bg-main-gradient text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none border-none outline-none tracking-wide shadow-md hover:translate-y-[-1px]"
              >
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>

              <button
                type="reset"
                className="flex-1 order-1 sm:order-2 border border-[var(--glass-border)] bg-[var(--card-bg)] hover:bg-[var(--glass-border)] text-primary font-bold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-muted" />
                Reset
              </button>
            </div>
          </form>

          {/* Core System Redirection Access Paths Anchor links */}
          <div className="px-8 py-5 border-t border-[var(--glass-border)] bg-[var(--card-bg)]/20 text-center">
            <p className="text-sm text-secondary">
              Already have an account?{" "}
              <Link href="/signin" className="text-main-gradient font-bold tracking-wide inline-flex items-center gap-0.5 group">
                Login
                <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-purple)] transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>

        {/* Global Security Standard Assertion Signature Badge */}
        <p className="text-center text-[11px] font-bold tracking-wider uppercase text-muted mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Secured by industry-leading encryption parameters
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;