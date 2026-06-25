import Image from "next/image";
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
import { getCourseById } from "@/lib/api/courses";
import { FaStar } from "react-icons/fa";

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
  "An eagerness to learn and build real-world applications"
];

const fallbackCurriculum = [
  "Course Introduction & Setup",
  "Understanding Core Architectures",
  "Designing our First Modules",
  "Advanced Features & Performance Tweaks",
  "Deploying to Production",
  "Final Projects & Code Reviews"
];

const reviews = [
  {
    name: "Alex Johnson",
    rating: 5,
    comment:
      "Excellent course. Everything is explained clearly with practical examples.",
  },
  {
    name: "Sarah Williams",
    rating: 5,
    comment: "One of the best online courses I've taken. Highly recommended.",
  },
  {
    name: "Michael Brown",
    rating: 4,
    comment: "Very detailed curriculum and easy-to-follow lessons.",
  },
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
      title: "Course Not Found | SkillSphere",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | SkillSphere`,
    description: course.description,
  };
}

const CourseDetailPage = async ({ params }) => {
  const { id } = await params;
  let course = null;
  try {
    const response = await getCourseById(id);
    course = response?.success ? response.data : null;
  } catch (error) {
    console.error("Course fetch failed:", error);
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground text-xl font-medium">
        Course not found
      </div>
    );
  }

  const courseRequirements = course.requirements || fallbackRequirements;
  const courseCurriculum = course.curriculum || fallbackCurriculum;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 lg:py-20 overflow-hidden transition-colors duration-300">
      {/* Background Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] dark:bg-purple-600/10" />
        <div className="absolute bottom-1/3 left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] dark:bg-indigo-600/10" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* =========================================================
            TOP BANNER SECTION
            ========================================================= */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative h-80 md:h-96 lg:h-[450px] rounded-[32px] overflow-hidden border border-gray-200/50 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl shadow-md transition-all duration-300">
            {course.image && (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover opacity-30 dark:opacity-20 mix-blend-overlay dark:mix-blend-normal hover:scale-105 transition-transform duration-[10s]"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/30 to-transparent dark:from-zinc-950 dark:via-zinc-950/30 dark:to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10">
              <div className="max-w-4xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-4">
                  <Layers className="w-3.5 h-3.5" />
                  {course.category || "General"}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none mb-4">
                  {course.title}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-zinc-300 max-w-2xl font-medium leading-relaxed line-clamp-2">
                  {course.subTitle || course.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN LAYOUT CONTENT SPLIT
            ========================================================= */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* LEFT CONTENT CONTAINER */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* About Course Section */}
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-gray-200/50 dark:border-zinc-800/80 shadow-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  About This Course
                </h2>
                <p className="text-gray-600 dark:text-zinc-300 font-normal leading-relaxed text-sm">
                  {course.description ||
                    `Immerse yourself in a program explicitly curated to target
                  current industry demands. This pathway integrates elementary
                  baseline foundations with high-tier real-world structural
                  paradigms. By pursuing targeted case exercises, you will
                  transform conceptual theory into production-ready tactical
                  configurations.`}
                </p>
              </div>

              {/* What You'll Learn Section */}
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-gray-200/50 dark:border-zinc-800/80 shadow-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(course.whatYoullLearn || learnPoints).map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2 shrink-0 transition-transform duration-200 group-hover:scale-125" />
                      <p className="text-gray-600 dark:text-zinc-300 text-sm font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-gray-200/50 dark:border-zinc-800/80 shadow-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  Requirements
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3.5">
                  {courseRequirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 text-sm font-medium"
                    >
                      <ChevronRight className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum Section */}
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-[28px] p-6 md:p-8 border border-gray-200/50 dark:border-zinc-800/80 shadow-sm transition-all">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {courseCurriculum.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 bg-white/40 dark:bg-zinc-900/40 hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-all duration-200 group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <p className="text-gray-700 dark:text-zinc-200 text-sm font-semibold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item}
                        </p>
                      </div>
                      <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT STICKY SIDEBAR */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[28px] border border-gray-200/50 dark:border-zinc-800/80 p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Pricing Blocks */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="line-through text-base text-gray-400 font-semibold">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-4 bg-emerald-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 border border-emerald-500/20 uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    Special promotional pricing
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                    Enroll Now
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 hover:bg-gray-100 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-200 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    Add to Wishlist
                  </button>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-gray-200 dark:border-zinc-800/80 pt-6">
                  <h3 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Student Reviews
                  </h3>
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-800/60 rounded-xl p-3.5 space-y-1.5"
                      >
                        <h4 className="font-semibold text-gray-800 dark:text-zinc-200 text-xs sm:text-sm">
                          {review.name}
                        </h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-zinc-700"}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-zinc-400 text-[11px] sm:text-xs font-normal leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Details List */}
                <div className="border-t border-gray-200 dark:border-zinc-800/80 pt-6">
                  <h3 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    Course Details
                  </h3>

                  <div className="divide-y divide-gray-150 dark:divide-zinc-800/80 text-xs font-medium text-gray-600 dark:text-zinc-300">
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" /> Duration
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-400" /> Lessons
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {course.lessons} lectures
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" /> Students
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {course.students?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" /> Skill Level
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {course.level}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-400" /> Rating
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        {course.rating}{" "}
                        <FaStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor Details Card */}
                <div className="border-t border-gray-200 dark:border-zinc-800/80 pt-6">
                  <h3 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Instructor
                  </h3>
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-200 dark:border-zinc-800/60">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                      {(course.instructorName || course.instructor || "I")[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                        {course.instructorName || course.instructor || "Lead Faculty"}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold truncate mt-0.5">
                        {course.instructorRole || "Senior Engineering Instructor"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
