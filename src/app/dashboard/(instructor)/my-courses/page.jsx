import { useUserServerSession } from "@/lib/actions/getUserServerSession";
import { getCoursesByInstructorClient } from "@/lib/api/courses";
import MyCoursesContainer from "@/components/dashboard/MyCoursesContainer";
import { redirect } from "next/navigation";

export default async function MyCoursesPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = await useUserServerSession();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch initial page of courses (page 1, limit 9 for default grid layout)
  let initialCoursesData = null;
  try {
    initialCoursesData = await getCoursesByInstructorClient(user.id, 1, 9, {
      sort: "newest"
    });
  } catch (error) {
    console.error("Failed to fetch initial courses server-side:", error);
  }

  return (
    <MyCoursesContainer 
      user={user} 
      initialCoursesData={initialCoursesData?.success ? initialCoursesData : null} 
    />
  );
}
