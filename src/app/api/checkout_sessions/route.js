import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getUserServerSession } from "@/lib/actions/getUserServerSession";
import { serverFetch, protectedFetch } from "@/lib/core/server";

// POST /api/checkout_sessions
export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const courseId = formData.get("course_id");

    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    const user = await getUserServerSession();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // 1. Duplicate Enrollment Protection
    const enrollmentCheck = await protectedFetch(`/api/enrollments/check?userId=${user.id}&courseId=${courseId}`);
    if (enrollmentCheck.isEnrolled) {
      throw new Error("Already enrolled in this course.");
    }

    // 2. Never trust price from client. Fetch course from MongoDB via Express API.
    const courseResponse = await serverFetch(`/api/courses/${courseId}`);
    const courseData = courseResponse?.data;
    if (!courseData || !courseData._id) {
      throw new Error("Course not found.");
    }
    const coursePrice = courseData.price;
    const courseTitle = courseData.title;
    const instructorId = courseData.instructor?.instructorId || courseData.instructorId || "";

    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: courseTitle },
            unit_amount: Math.round(coursePrice * 100), // dollars → cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        courseId,
        userId: user.id,
        instructorId,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/courses/${courseId}`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
