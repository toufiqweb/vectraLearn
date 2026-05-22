"use client";
import { authClient } from "@/lib/auth-client";
import { error } from "better-auth/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    console.log(userData);
    const { name, email, password, image } = userData;

    // email verification
    const emailVerification = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailVerification.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    } else if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    } else if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        image, // User image URL (optional)
      },
      {
        onRequest: (ctx) => {
          // toast.loading("Creating your account...");
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          toast.success("Account created successfully!");
          router.push("/");
        },
        onError: (ctx) => {
          // display the error message
          toast.error(ctx.error.message || "Something went wrong");
        },
      },
    );
    // console.log(data, error);   
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
    <div className="min-h-[80vh]  flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white  rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-main-gradient px-8 py-10 text-white">
            <h2 className="text-3xl font-bold text-center">Create Account</h2>
            <p className="text-white/80 text-center mt-2">
              Join us and start your learning journey
            </p>
          </div>
          {/* Google Login */}
          <div className="p-8 space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300  hover:bg-gray-50  py-3 rounded-xl transition-all "
            >
              <FcGoogle className="text-2xl" />
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-300  w-full"></div>
              <span className="absolute bg-white  px-4 text-sm text-gray-500 ">
                OR
              </span>
            </div>
          </div>
          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700  mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200  outline-none transition-all"
                required
              />
            </div>

            {/* Photo*/}
            <div>
              <label className="block text-sm text-gray-700  mb-1.5">
                Profile Photo URL
              </label>
              <input
                required
                type="url"
                name="image"
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200  outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700  mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200  outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700  mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200  outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-main-gradient text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
              >
                Create Account
              </button>

              <button
                type="reset"
                className="flex-1 border border-gray-300  hover:bg-gray-50  font-medium py-3 rounded-2xl transition-all"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="px-8 py-6 border-t border-gray-100  text-center">
            <p className="text-sm text-gray-600 ">
              Already have an account?
              <Link href="/signin" className="text-main-gradient font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Secured by industry-leading encryption
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
