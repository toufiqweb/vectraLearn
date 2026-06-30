import { getEnrolledCoursesClient } from "@/lib/api/course";
import { getUserServerSession } from "@/lib/actions/getUserServerSession";
import MyLearningClient from "./MyLearningClient";

export default async function MyLearningPage({ searchParams }) {
  // Await searchParams in Next.js 15+ if needed, but in 13/14 it's a plain object
  // Since we are not sure what Next version this is precisely, we'll await if possible or safely fall back.
  // We'll safely read the page param.
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || "1", 10);
  const limit = 6;

  // Server-Side Data Fetching
  const user = await getUserServerSession();
  const data = user 
    ? await getEnrolledCoursesClient(user.id, page, limit)
    : { success: false, message: "Unauthorized" };

  return <MyLearningClient initialData={data} currentPage={page} userId={user?.id} />;
}
