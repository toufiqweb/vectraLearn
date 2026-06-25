"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import {
  User,
  Image as ImageIcon,
  Mail,
  Lock,
  UserPlus,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Eye,
} from "lucide-react";

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
              String(
                ctx?.error?.message || ctx?.error || "Something went wrong",
              ),
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
    <div className="relative min-h-screen bg-background transition-colors duration-300 pt-32 pb-16 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Graphic Curves & Sparkle Highlights from theme context */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/8 left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px]" />

        {/* Subtle background star elements */}
        <span className="absolute top-1/4 right-20 text-indigo-400/30 font-serif text-xl select-none">
          ✦
        </span>
        <span className="absolute bottom-1/4 left-16 text-purple-400/20 font-serif text-2xl select-none">
          ✦
        </span>
      </div>

      {/* Top-Left Isolated Platform Brand Logo */}
      <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2.5 select-none">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <GraduationCap size={18} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-black tracking-tight text-foreground leading-none transition-colors duration-300 ">
            Skill
            <span className="text-muted transition-colors duration-300 font-semibold">
              Sphere
            </span>
          </h1>
          <span className="text-[7px] uppercase tracking-[0.25em] text-muted transition-colors duration-300 font-bold mt-0.5">
            Learn • Grow • Succeed
          </span>
        </div>
      </div>

      {/* Main Structural Wrapper Grid Form Element Container */}
      <div className="w-full max-w-[520px] relative z-10 mt-6">
        {/* Floating Absolute Center Top Accent Icon Badge Element */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 flex h-20 w-20 items-center justify-center rounded-full border border-purple-500/30 bg-background transition-colors duration-300 text-purple-300 shadow-[0_0_30px_rgba(109,93,252,0.25)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#6d5dfc]/20 to-transparent">
            <UserPlus size={22} className="text-[#8b7eff]" />
          </div>
        </div>

        {/* Main Card Element Block layout frame settings */}
        <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[32px] border border-card-border transition-colors duration-300 pt-16 pb-2 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          {/* Main Integrated Text Layout Headers info panel */}
          <div className="px-8 mb-8 text-center">
            <h2 className="text-2xl font-black text-foreground tracking-tight sm:text-3xl transition-colors duration-300 ">
              Create Your <span className="text-[#8b7eff]">Account</span>
            </h2>
            <p className="text-muted transition-colors duration-300 text-xs sm:text-sm font-medium mt-2.5">
              Join us and start your learning journey
            </p>
          </div>

          {/* Core Login Triggers with Google platform API element integration */}
          <div className="px-8 space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-card-border transition-colors duration-300 bg-card-bg/50 transition-colors duration-300 hover:bg-foreground/5 transition-colors duration-300 text-primary transition-colors duration-300 font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              <FcGoogle className="text-lg shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* Separator Module Grid strip layer configuration block standard line layout */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-card-border transition-colors duration-300 w-full"></div>
              <span className="absolute bg-card-bg transition-colors duration-300 px-3 py-0.5 rounded-md border border-card-border transition-colors duration-300 text-[9px] font-black tracking-widest text-muted transition-colors duration-300 uppercase">
                OR
              </span>
            </div>
          </div>

          {/* Content Entry Shell Form Inputs fields map wrapper initialization block */}
          <form onSubmit={onSubmit} className="px-8 space-y-5">
            {/* Input Element Module: Full Name setup layout */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary transition-colors duration-300 flex items-center gap-2 tracking-wide">
                <User size={13} className="text-indigo-400" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3.5 rounded-xl bg-card-bg/60 transition-colors duration-300 border border-card-border transition-colors duration-300 text-sm text-foreground placeholder:text-slate-600 focus:border-indigo-500 focus:bg-background transition-colors duration-300 outline-none transition-all duration-200 transition-colors duration-300 "
                required
              />
            </div>

            {/* Input Element Module: Photo URL setup layout */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary transition-colors duration-300 flex items-center gap-2 tracking-wide">
                <ImageIcon size={13} className="text-indigo-400" />
                <span>
                  Profile Photo URL{" "}
                  <span className="text-muted transition-colors duration-300 font-medium font-mono text-[10px]">
                    (Optional)
                  </span>
                </span>
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3.5 rounded-xl bg-card-bg/60 transition-colors duration-300 border border-card-border transition-colors duration-300 text-sm text-foreground placeholder:text-slate-600 focus:border-indigo-500 focus:bg-background transition-colors duration-300 outline-none transition-all duration-200 transition-colors duration-300 "
                required
              />
            </div>

            {/* Input Element Module: Mailing Address layout block integration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary transition-colors duration-300 flex items-center gap-2 tracking-wide">
                <Mail size={13} className="text-indigo-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-card-bg/60 transition-colors duration-300 border border-card-border transition-colors duration-300 text-sm text-foreground placeholder:text-slate-600 focus:border-indigo-500 focus:bg-background transition-colors duration-300 outline-none transition-all duration-200 transition-colors duration-300 "
                required
              />
            </div>

            {/* Input Element Module: Secure Cipher block password encryption data shell field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary transition-colors duration-300 flex items-center gap-2 tracking-wide">
                <Lock size={13} className="text-indigo-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3.5 pr-10 rounded-xl bg-card-bg/60 transition-colors duration-300 border border-card-border transition-colors duration-300 text-sm text-foreground placeholder:text-slate-600 focus:border-indigo-500 focus:bg-background transition-colors duration-300 outline-none transition-all duration-200 transition-colors duration-300 "
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-300 hover:text-secondary transition-colors duration-300 "
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>

            {/* Control Triggers Button Matrix Actions blocks re-ordered to precisely match image reference frame */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-2">
              <button
                type="submit"
                className="flex-[2] bg-gradient-to-r from-[#5643ff] to-[#6d5dfc] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none outline-none tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:brightness-110 active:scale-[0.99]"
              >
                <UserPlus size={14} />
                <span>Create Account</span>
                <ArrowRight size={13} className="ml-0.5 shrink-0" />
              </button>

              <button
                type="reset"
                className="flex-1 border border-card-border transition-colors duration-300 bg-card-bg/30 transition-colors duration-300 hover:bg-foreground/5 transition-colors duration-300 text-secondary transition-colors duration-300 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <RotateCcw
                  size={13}
                  className="text-muted transition-colors duration-300 "
                />
                <span>Reset</span>
              </button>
            </div>
          </form>

          {/* Bottom redirection anchor row links access panel wrap context */}
          <div className="mt-6 px-8 py-4 border-t border-card-border transition-colors duration-300 bg-card-bg/40 transition-colors duration-300 text-center">
            <p className="text-xs sm:text-sm text-muted transition-colors duration-300 font-medium">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#8b7eff] font-bold tracking-wide inline-flex items-center gap-0.5 group hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Dynamic Global Compliance / Security assertion section banner */}
        <p className="text-center text-[10px] font-bold tracking-wider uppercase text-muted transition-colors duration-300 mt-6 flex items-center justify-center gap-2 select-none">
          <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
          <span>Secured by industry-leading encryption parameters</span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
