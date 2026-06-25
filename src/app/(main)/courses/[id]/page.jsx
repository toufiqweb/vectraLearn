import React from "react";
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
import { getAllCoursesData } from "@/lib/getAllCourses";
import { FaStar } from "react-icons/fa";

const learnPoints = [
  "Build real-world projects from scratch",
  "Master industry-standard tools",
  "Understand best practices",
  "Work on practical assignments",
  "Create portfolio-ready projects",
  "Gain job-ready skills",
];

const requirements = [
  "Basic computer knowledge",
  "Internet connection",
  "No prior experience required",
  "Willingness to learn and practice",
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

const curriculum = [
  "Course Introduction & Overview",
  "Understanding the Fundamentals",
  "Core Concepts and Strategies",
  "Practical Tools & Techniques",
  "Advanced Strategies & Best Practices",
  "Hands-on Projects & Case Studies",
  "Common Challenges and Solutions",
  "Industry Best Practices",
  "Final Project & Assessment",
  "Course Summary & Next Steps",
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const courses = await getAllCoursesData();
  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return {
      title: "Course Not Found | Skill Sphere",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | Skill Sphere`,
    description: course.description,
  };
}

const CourseDetailPage = async ({ params }) => {
  const { id } = await params;
  const courses = await getAllCoursesData();
  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-300 text-foreground text-xl font-medium transition-colors duration-300 ">
        Course not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 py-20 transition-colors duration-300 overflow-hidden">
      
      {/* Background Ambient Radial Space Lights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-10 right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* =========================================================
            TOP BANNER SECTION
            ========================================================= */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl">
          <div className="relative h-85 md:h-115 rounded-[32px] overflow-hidden bg-card-bg/40 transition-colors duration-300 border border-card-border transition-colors duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover opacity-20 dark:opacity-25 mix-blend-luminosity dark:mix-blend-normal"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background transition-colors duration-300 via-card-bg/40 transition-colors duration-300 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10">
              <div className="max-w-4xl">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-md text-xs font-bold tracking-wider text-[#8b7eff] uppercase mb-4">
                  <Layers className="w-3.5 h-3.5" />
                  {course.category || "General"}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-none mb-4 transition-colors duration-300 ">
                  {course.title}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-muted transition-colors duration-300 max-w-2xl font-medium leading-relaxed line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN LAYOUT CONTENT SPLIT
            ========================================================= */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONTENT CONTAINER */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* About Course Section */}
              <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 border border-card-border transition-colors duration-300 shadow-xl">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider transition-colors duration-300 ">
                  <TrendingUp className="w-4 h-4 text-[#8b7eff]" />
                  About This Course
                </h2>
                <p className="text-muted transition-colors duration-300 font-medium leading-relaxed text-xs sm:text-sm">
                  Immerse yourself in a program explicitly curated to target
                  current industry demands. This pathway integrates elementary
                  baseline foundations with high-tier real-world structural
                  paradigms. By pursuing targeted case exercises, you will
                  transform conceptual theory into production-ready tactical
                  configurations.
                </p>
              </div>

              {/* What You'll Learn Section */}
              <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 border border-card-border transition-colors duration-300 shadow-xl">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-foreground mb-6 flex items-center gap-2.5 uppercase tracking-wider transition-colors duration-300 ">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {learnPoints.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 transition-transform duration-200 group-hover:scale-125" />
                      <p className="text-muted transition-colors duration-300 text-xs sm:text-sm font-medium leading-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 border border-card-border transition-colors duration-300 shadow-xl">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-foreground mb-5 flex items-center gap-2.5 uppercase tracking-wider transition-colors duration-300 ">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  Requirements
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3.5">
                  {requirements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-muted transition-colors duration-300 text-xs sm:text-sm font-medium"
                    >
                      <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum Section */}
              <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] p-6 md:p-8 border border-card-border transition-colors duration-300 shadow-xl">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-foreground mb-6 flex items-center gap-3 uppercase tracking-wider transition-colors duration-300 ">
                  <PlayCircle className="w-5 h-5 text-[#8b7eff]" />
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {curriculum.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border border-card-border transition-colors duration-300 rounded-2xl p-4 bg-card-bg/40 transition-colors duration-300 hover:bg-foreground/5 transition-colors duration-300 transition-all duration-200 group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#8b7eff] font-bold text-xs flex items-center justify-center shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <p className="text-secondary transition-colors duration-300 text-xs sm:text-sm font-bold tracking-tight group-hover:text-[#8b7eff] transition-colors duration-300 ">
                          {item}
                        </p>
                      </div>
                      <PlayCircle className="w-4 h-4 text-slate-600 group-hover:text-[#8b7eff] transition-colors duration-300 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT STICKY SIDEBAR */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div className="bg-card-bg/60 transition-colors duration-300 backdrop-blur-2xl rounded-[28px] border border-card-border transition-colors duration-300 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6">
                
                {/* Pricing Blocks */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground transition-colors duration-300 ">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="line-through text-base text-slate-600 font-bold">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-400 font-bold mt-4 bg-emerald-500/10 px-3 py-1.5 rounded-full inline-flex items-center gap-1 border border-emerald-500/20 uppercase tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <Sparkles className="w-3 h-3" />
                    Special promotional pricing
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-[#5643ff] to-[#6d5dfc] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-600/10 hover:brightness-110 cursor-pointer active:scale-[0.99] select-none">
                    Enroll Now
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-card-border transition-colors duration-300 bg-card-bg/60 transition-colors duration-300 hover:bg-foreground/5 transition-colors duration-300 text-secondary transition-colors duration-300 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.99]">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    Add to Wishlist
                  </button>
                </div>

                {/* =========================================================
                    NEW POSITION: Student Reviews Section (Below Enroll)
                    ========================================================= */}
                <div className="border-t border-card-border transition-colors duration-300 pt-6">
                  <h3 className="font-black text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-300 ">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Student Reviews
                  </h3>
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/5">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-card-bg/40 transition-colors duration-300 border border-card-border transition-colors duration-300 rounded-xl p-3.5 space-y-1.5"
                      >
                        <h4 className="font-bold text-primary transition-colors duration-300 text-xs sm:text-sm">
                          {review.name}
                        </h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "text-yellow-400" : "text-slate-700"}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted transition-colors duration-300 text-[11px] sm:text-xs font-medium leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Features Table Data */}
                <div className="border-t border-card-border transition-colors duration-300 pt-6">
                  <h3 className="font-black text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-300 ">
                    <Layers className="w-4 h-4 text-[#8b7eff]" />
                    Course Details
                  </h3>

                  <div className="divide-y divide-white/5 text-xs font-medium">
                    <div className="flex justify-between py-3.5">
                      <span className="text-muted transition-colors duration-300 flex items-center gap-2 font-bold">
                        <Clock className="w-4 h-4 text-slate-600" /> Duration
                      </span>
                      <span className="font-bold text-primary transition-colors duration-300 ">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex justify-between py-3.5">
                      <span className="text-muted transition-colors duration-300 flex items-center gap-2 font-bold">
                        <PlayCircle className="w-4 h-4 text-slate-600" /> Lessons
                      </span>
                      <span className="font-bold text-primary transition-colors duration-300 ">
                        {course.lessons} lectures
                      </span>
                    </div>
                    <div className="flex justify-between py-3.5">
                      <span className="text-muted transition-colors duration-300 flex items-center gap-2 font-bold">
                        <Users className="w-4 h-4 text-slate-600" /> Students
                      </span>
                      <span className="font-bold text-primary transition-colors duration-300 ">
                        {course.students?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between py-3.5">
                      <span className="text-muted transition-colors duration-300 flex items-center gap-2 font-bold">
                        <Award className="w-4 h-4 text-slate-600" /> Skill Level
                      </span>
                      <span className="font-bold text-primary transition-colors duration-300 ">
                        {course.level}
                      </span>
                    </div>
                    <div className="flex justify-between py-3.5">
                      <span className="text-muted transition-colors duration-300 flex items-center gap-2 font-bold">
                        <Star className="w-4 h-4 text-slate-600" /> Rating
                      </span>
                      <span className="font-bold text-primary transition-colors duration-300 flex items-center gap-1">
                        {course.rating}{" "}
                        <FaStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor Card Container */}
                <div className="border-t border-card-border transition-colors duration-300 pt-6">
                  <h3 className="font-black text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-300 ">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Instructor
                  </h3>
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-card-bg/40 transition-colors duration-300 border border-card-border transition-colors duration-300 ">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#5643ff] to-[#8b7eff] text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                      {course.instructor ? course.instructor[0] : "I"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-primary transition-colors duration-300 truncate text-sm">
                        {course.instructor || "Lead Faculty"}
                      </h4>
                      <p className="text-[11px] text-muted transition-colors duration-300 font-bold tracking-tight truncate mt-0.5">
                        Senior Engineering Instructor
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