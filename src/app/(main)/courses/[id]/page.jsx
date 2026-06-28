import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Users,
  Award,
  PlayCircle,
  ChevronRight,
  BookOpen,
  Layers,
  Star,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { getCourseById, getCourseReviews } from "@/lib/api/courses";
import { FaStar } from "react-icons/fa";
import { getUserServerSession } from "@/lib/actions/getUserServerSession";
import { serverFetch } from "@/lib/core/server";

const learnPoints = [
  "Build real-world projects from scratch",
  "Master industry-standard tools",
  "Understand best practices",
  "Work on practical assignments",
  "Create portfolio-ready projects",
  "Gain job-ready skills",
];

const fallbackRequirements = [
  "Basic knowledge of the core subject is helpful",
  "A computer with reliable internet access",
  "An eagerness to learn and build real-world applications",
];

const fallbackCurriculum = [
  "Course Introduction & Setup",
  "Understanding Core Architectures",
  "Designing our First Modules",
  "Advanced Features & Performance Tweaks",
  "Deploying to Production",
  "Final Projects & Code Reviews",
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  let course = null;
  try {
    const response = await getCourseById(id);
    course = response?.success ? response.data : null;
  } catch (error) {
    console.error("Course fetch failed:", error);
  }

  if (!course) {
    return {
      title: "Course Not Found | VectraLearn",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | VectraLearn`,
    description: course.description,
  };
}

const CourseDetailPage = async ({ params }) => {
  const { id } = await params;
  let course = null;
  let dynamicReviews = [];
  try {
    const [courseResponse, reviewsResponse] = await Promise.all([
      getCourseById(id),
      getCourseReviews(id),
    ]);
    course = courseResponse?.success ? courseResponse.data : null;
    dynamicReviews = reviewsResponse?.success ? reviewsResponse.reviews : [];
  } catch (error) {
    console.error("Course fetch failed:", error);
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground text-xl font-medium">
        Course not found
      </div>
    );
  }

  const user = await getUserServerSession();
  let isEnrolled = false;
  if (user && course) {
    try {
      const enrollmentCheck = await serverFetch(
        `/api/enrollments/check?userId=${user.id}&courseId=${course._id}`,
      );
      isEnrolled = enrollmentCheck?.isEnrolled || false;
    } catch (err) {
      console.error("Error checking enrollment status:", err);
    }
  }

  const courseRequirements = course.requirements || fallbackRequirements;
  const courseCurriculum = course.curriculum || fallbackCurriculum;

  const resolvedInstructorName =
    course.instructorName ||
    (course.instructor && typeof course.instructor === "object"
      ? course.instructor.name
      : course.instructor) ||
    "Lead Faculty";

  return (
    <div className="relative min-h-screen bg-background text-foreground py-12 lg:py-20 overflow-hidden transition-colors duration-300">
      {/* Background Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-brand-ocean/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* =========================================================
              LEFT COLUMN: MAIN CONTENT (HERO + DETAILS)
              ========================================================= */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header / Hero Section (Text Only) */}
            <div className="space-y-6 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-wider text-brand-cyan uppercase">
                <Layers className="w-3.5 h-3.5" />
                {course.category || "General"}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-secondary font-medium leading-relaxed max-w-3xl">
                {course.subTitle || course.description}
              </p>

              {/* Quick Stats Row under Title */}
              <div className="flex flex-wrap items-center gap-6 pt-2 pb-4 border-b border-card-border">
                {/* Instructor mini-profile */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-ocean/20 text-brand-ocean font-bold text-sm flex items-center justify-center shrink-0 border border-brand-ocean/30">
                    {resolvedInstructorName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Instructor
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {resolvedInstructorName}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-card-border hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-brand-mint fill-brand-mint" />
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Rating
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {course.rating} / 5.0
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-card-border hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-cyan" />
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Students
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {course.students?.toLocaleString() || "0"} Enrolled
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Course Section */}
            <div className="space-y-4">
              <h2 className="section-title flex items-center gap-2.5 !text-2xl">
                <TrendingUp className="w-6 h-6 text-brand-ocean" />
                About This Course
              </h2>
              <div className="glass-card rounded-3xl p-6 md:p-8 text-secondary font-normal leading-relaxed text-sm">
                <p>
                  {course.description ||
                    `Immerse yourself in a program explicitly curated to target current industry demands. This pathway integrates elementary baseline foundations with high-tier real-world structural paradigms. By pursuing targeted case exercises, you will transform conceptual theory into production-ready tactical configurations.`}
                </p>
              </div>
            </div>

            {/* What You'll Learn Section */}
            <div className="space-y-4">
              <h2 className="section-title flex items-center gap-2.5 !text-2xl">
                <CheckCircle2 className="w-6 h-6 text-brand-mint" />
                What You'll Learn
              </h2>
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                  {(course.whatYoullLearn || learnPoints).map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand-mint/30 bg-brand-mint/10 mt-0.5">
                        <CheckCircle2
                          className="text-brand-mint"
                          size={12}
                          strokeWidth={3}
                        />
                      </div>
                      <p className="text-secondary text-sm font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Curriculum Section */}
            <div className="space-y-4">
              <h2 className="section-title flex items-center gap-3 !text-2xl">
                <PlayCircle className="w-6 h-6 text-brand-ocean" />
                Course Curriculum
              </h2>
              <div className="glass-card rounded-3xl p-4 md:p-6 space-y-3">
                {courseCurriculum.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-card-border rounded-2xl p-4 bg-background/40 hover:bg-foreground/5 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-ocean/10 border border-brand-ocean/20 text-brand-ocean font-bold text-xs flex items-center justify-center shrink-0">
                        {typeof item === "object"
                          ? item.id || String(index + 1).padStart(2, "0")
                          : String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-foreground text-sm font-semibold tracking-tight group-hover:text-brand-ocean transition-colors">
                          {typeof item === "object" ? item.title : item}
                        </p>
                        {typeof item === "object" &&
                          item.lectures !== undefined && (
                            <span className="text-[10px] text-muted font-medium mt-0.5">
                              {item.lectures} lectures
                            </span>
                          )}
                      </div>
                    </div>
                    <PlayCircle className="w-5 h-5 text-muted group-hover:text-brand-ocean transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Student Reviews Section (Moved to main column for better layout) */}
            <div className="space-y-4">
              <h2 className="section-title flex items-center gap-2.5 !text-2xl">
                <Star className="w-6 h-6 text-brand-mint fill-brand-mint" />
                Student Reviews
              </h2>
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-card-border">
                  {dynamicReviews.length > 0 ? (
                    dynamicReviews.map((review, index) => (
                      <div
                        key={review._id || index}
                        className="bg-background/40 border border-card-border rounded-2xl p-5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground text-sm">
                            {review.userName}
                          </h4>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? "text-brand-mint" : "text-muted/30"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-secondary text-xs font-normal leading-relaxed">
                          "{review.message}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-sm italic col-span-full text-center py-8">
                      No student reviews submitted yet for this course.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: STICKY SIDEBAR (ACTION & DETAILS)
              ========================================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* Primary Action Card (Image + Price + Enroll) */}
            <div className="glass-card rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
              {/* Course Image at the top of the card */}
              {course.image && (
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 md:p-8 space-y-6 bg-card-bg relative z-10">
                {/* Pricing */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="line-through text-lg text-muted font-semibold">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-mint font-bold mt-3 bg-brand-mint/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 border border-brand-mint/20 uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    Special promotional pricing
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isEnrolled ? (
                    <Link
                      href="/dashboard/my-learning"
                      className="w-full flex items-center justify-center gap-2 bg-main-gradient text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-glow transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <BookOpen className="w-4 h-4" />
                      Go to Course
                    </Link>
                  ) : (
                    <form action="/api/checkout_sessions" method="POST">
                      <input
                        type="hidden"
                        name="course_id"
                        value={course._id}
                      />
                      <button
                        id="enroll-now-btn"
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-main-gradient text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-glow transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                      >
                        Enroll Now
                      </button>
                    </form>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 border border-card-border bg-transparent hover:bg-foreground/5 text-foreground font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200">
                    <Bookmark className="w-4 h-4 text-brand-cyan" />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details List Card */}
            <div className="glass-card rounded-[28px] p-6 md:p-8">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-ocean" />
                Course Details
              </h3>
              <div className="divide-y divide-card-border text-sm font-medium text-secondary">
                <div className="flex justify-between py-3">
                  <span className="flex items-center gap-2 text-muted">
                    <Clock className="w-4 h-4" /> Duration
                  </span>
                  <span className="font-semibold text-foreground">
                    {course.duration}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="flex items-center gap-2 text-muted">
                    <PlayCircle className="w-4 h-4" /> Lessons
                  </span>
                  <span className="font-semibold text-foreground">
                    {course.lessons}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="flex items-center gap-2 text-muted">
                    <Award className="w-4 h-4" /> Skill Level
                  </span>
                  <span className="font-semibold text-foreground">
                    {course.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="glass-card rounded-[28px] p-6 md:p-8">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-cyan" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {courseRequirements.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-secondary text-xs sm:text-sm font-medium leading-relaxed"
                  >
                    <ChevronRight className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
