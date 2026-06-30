"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mainLightModeLogo from "@/assets/mainLightModeLogo.png";
import mainlogo from "@/assets/mainLogo2.png";
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
  Eye,
  Loader2,
  LayoutDashboard,
  PlayCircle,
  Users,
} from "lucide-react";
import { imageUpload } from "@/lib/imageUpload";

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    const { name, email, password, image } = userData;

    // Email verification structural match
    const emailVerification = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailVerification.test(email.toString())) {
      toast.error("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Password validation constraints
    if (password.toString().length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    } else if (!/[A-Z]/.test(password.toString())) {
      toast.error("Password must contain at least one uppercase letter");
      setIsSubmitting(false);
      return;
    } else if (!/[0-9]/.test(password.toString())) {
      toast.error("Password must contain at least one number");
      setIsSubmitting(false);
      return;
    }

    try {
      let uploadedImageUrl = undefined;

      if (image && image instanceof File && image.size > 0) {
        const uploadResult = await imageUpload(image);
        if (uploadResult && uploadResult.url) {
          uploadedImageUrl = uploadResult.url;
        } else {
          toast.error("Image upload failed. Proceeding without image.");
        }
      }

      const response = await authClient.signUp.email(
        {
          email: email.toString(),
          password: password.toString(),
          name: name.toString(),
          image: uploadedImageUrl,
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
            setIsSubmitting(false);
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
    } finally {
      setIsSubmitting(false);
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
            Start Your Journey with{" "}
            <span className="text-main-gradient">Expert-Led</span> Courses.
          </h1>
          <p className="text-lg text-muted font-medium mb-12">
            Join a community of passionate learners. Build new skills from
            scratch or level up your career with hands-on projects.
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:px-24 bg-background relative overflow-y-auto">
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

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0 py-8 lg:py-0">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
              Create an Account
            </h2>
            <p className="text-muted text-sm font-medium">
              Join us and start your learning journey today.
            </p>
          </div>

          {/* Social Auth */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-card-border bg-card-bg hover:bg-foreground/5 text-primary font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-50"
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

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground placeholder:text-muted focus:border-brand-mint focus:ring-1 focus:ring-brand-mint outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                Profile Photo{" "}
                <span className="text-muted text-[10px] font-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <ImageIcon size={16} />
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-ocean file:text-white hover:file:bg-brand-ocean/90 focus:border-brand-mint focus:ring-1 focus:ring-brand-mint outline-none transition-all cursor-pointer shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
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
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground placeholder:text-muted focus:border-brand-mint focus:ring-1 focus:ring-brand-mint outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-main-gradient text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                    <ArrowRight size={14} className="ml-1" />
                  </>
                )}
              </button>
              <button
                type="reset"
                disabled={isSubmitting}
                className="flex-1 border border-card-border bg-card-bg hover:bg-foreground/5 text-muted hover:text-foreground font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted font-medium">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-brand-ocean hover:text-brand-mint font-bold transition-colors"
            >
              Login
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-card-bg/50 py-2 rounded-lg border border-card-border">
            <ShieldCheck size={14} className="text-brand-mint" />
            <span>Secured by industry-leading encryption parameters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
