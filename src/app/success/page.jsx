import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, BookOpen, ArrowRight, LayoutDashboard } from "lucide-react";
import { stripe } from "../../lib/stripe";
import { createTransaction } from "@/lib/actions/transaction";

export const metadata = {
  title: "Enrollment Confirmed | VectraLearn",
  description: "Your payment was successful and you are now enrolled in the course.",
};

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
    amount_total,
    payment_intent,
  } = session;

  if (status === "open") {
    return redirect("/courses");
  }

  if (status !== "complete") {
    return redirect("/");
  }

  // Extract payment method information
  const paymentMethod = payment_intent?.payment_method_types?.[0] || "card";

  // ── Write to MongoDB via Express ──
  let enrollmentResult = null;
  let enrollmentError  = null;

  try {
    const txData = {
      courseId:      metadata.courseId,
      userId:        metadata.userId,
      instructorId:  metadata.instructorId || "",
      amount:        amount_total / 100, // cents → dollars
      stripeSessionId: session_id,
      paymentStatus: "paid",
      paymentMethod,
      customerEmail,
    };
    enrollmentResult = await createTransaction(txData);
  } catch (err) {
    if (!err.message?.includes("Payment already recorded")) {
      console.error("[SuccessPage] createTransaction error:", err);
      enrollmentError = err.message;
    } else {
      enrollmentResult = { success: true, message: "Payment already recorded" };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[28px] shadow-sm p-10 text-center space-y-6">
          {enrollmentError ? (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Verification Failed
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Your payment was received but enrollment could not be confirmed.
                  Please contact support with your session ID:
                </p>
                <code className="block text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-lg px-4 py-2 font-mono break-all">
                  {session_id}
                </code>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Return to homepage
              </Link>
            </>
          ) : (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Payment Confirmed
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  You're enrolled!
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                  {enrollmentResult?.message === "Payment already recorded"
                    ? "You were already enrolled in this course. Head to your dashboard to continue learning."
                    : `Your payment was processed successfully. A confirmation has been sent to ${customerEmail}.`}
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800" />

              <div className="text-left space-y-3">
                <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                  What's next
                </p>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                      Start learning immediately
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">
                      Your course is now available in My Learning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                      Track your progress
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">
                      Resume where you left off from your dashboard anytime.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/my-learning"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-600/10 hover:scale-[1.01]"
              >
                <BookOpen className="w-4 h-4" />
                Go to My Learning
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors font-medium">
                Browse more courses
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
