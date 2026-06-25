import { getAllCoursesData } from "@/lib/getAllCourses";
import CoursesPageClient from "@/components/coursespage/CoursesPageClient";

export const metadata = {
  title: "Courses | Skill Sphere",
  description:
    "Browse all available courses on Skill Sphere and start learning new skills to grow your career.",
};


const CoursesPage = async () => {
  const courses = await getAllCoursesData();

  return <CoursesPageClient courses={courses} />;
};

export default CoursesPage;
