"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter ,useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // console.log(router);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    const { email, password } = userData;
    // console.log(data);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: false,
    });
    // console.log(data, error);
    if (data) {
      toast.success("Login successful!");
      router.push(callbackUrl);
      return;
    } else {
      toast.error(error.message || "Something went wrong");
      return;
    }
  };
  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
       callbackURL: callbackUrl,
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
            <h2 className="text-3xl font-bold text-center">
              Login to Your Account
            </h2>
            <p className="text-white/80 text-center mt-2">
              Welcome back! Sign in to continue your learning journey
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
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700  mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200  outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-main-gradient text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
            >
              Login
            </button>
          </form>

          <div className="px-8 py-6 border-t border-gray-100  text-center">
            <p className="text-sm text-gray-600 ">
              Don&apos;t have an account?
              <Link href="/signup" className="text-main-gradient font-medium">
                Register
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

export default SignInPage;
