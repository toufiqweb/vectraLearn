"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid, List, PlayCircle, BookOpen, Clock, Star } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import CourseCard from "@/components/ui/CourseCard";
import CourseRatingModal from "@/components/ui/CourseRatingModal";
import { useRouter, usePathname } from "next/navigation";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import DashboardPageHeader from "@/components/ui/DashboardPageHeader";

export default function MyLearningClient({ initialData, currentPage }) {
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingModalCourse, setRatingModalCourse] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [courses, setCourses] = useState(initialData?.data || []);
  const totalPages = initialData?.totalPages || 1;

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setCourses(initialData?.data || []);
  }

  const handleRatingSuccess = (newAverageRating) => {
    if (!ratingModalCourse) return;
    setCourses(prev => prev.map(enrollment => {
      const courseData = enrollment.course;
      if (!courseData) return enrollment;
      if (courseData._id === ratingModalCourse._id || courseData.id === ratingModalCourse.id) {
        return {
          ...enrollment,
          course: {
            ...courseData,
            rating: newAverageRating
          }
        };
      }
      return enrollment;
    }));
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
  };

  const handlePageChange = (newPage) => {
    // Navigating natively pushes a new server request for the Server Component
    router.push(`${pathname}?page=${newPage}`);
  };

  // Empty state handling
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] glass-card border border-card-border rounded-3xl p-8 text-center space-y-6 shadow-card">
        <div className="w-20 h-20 bg-[var(--brand-cyan)]/10 rounded-full flex items-center justify-center border border-[var(--brand-cyan)]/20">
          <BookOpen className="w-10 h-10 text-[var(--brand-cyan)]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            You haven't enrolled in any courses yet!
          </h2>
          <p className="text-muted font-medium max-w-md mx-auto">
            Ready to learn something new? Browse our vast catalog and start your learning journey today.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-ocean)] hover:brightness-110 text-background font-black text-sm rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md shadow-[var(--brand-cyan)]/20 active:scale-[0.98]"
        >
          Explore Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <DashboardPageHeader
        icon={BookOpen}
        title={
          <>
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-ocean">Learning</span>
          </>
        }
        subtitle="Pick up right where you left off"
        rightContent={
          <span className="px-4 py-2 rounded-xl bg-foreground/5 border border-card-border text-xs font-bold text-muted flex items-center gap-2 shadow-sm">
            <PlayCircle size={16} className="text-brand-mint" /> 
            Active Student
          </span>
        }
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        searchPlaceholder="Search enrolled courses..."
        viewMode={{
          value: view,
          onChange: setView,
        }}
      />

      {/* Content Area */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((enrollment) => {
            const courseData = enrollment.course;
            if (!courseData) return null;
            return (
              <CourseCard 
                key={enrollment._id} 
                course={courseData} 
                allowRating={true} 
                onRateClick={(course) => setRatingModalCourse({ ...course, existingReview: enrollment.existingReview })}
                existingReview={enrollment.existingReview}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-[24px] border border-card-border shadow-card overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted font-medium border-collapse">
              <thead className="bg-foreground/5 border-b border-card-border text-xs uppercase font-black text-muted tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Course</th>
                  <th scope="col" className="px-6 py-4">Enrolled On</th>
                  <th scope="col" className="px-6 py-4">Amount Paid</th>
                  <th scope="col" className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {courses.filter(enrollment => {
                  const course = enrollment.course;
                  return course && course.title.toLowerCase().includes(searchQuery.toLowerCase());
                }).map((enrollment) => {
                  const courseData = enrollment.course;
                  if (!courseData) return null;

                  return (
                    <tr key={enrollment._id} className="hover:bg-foreground/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-card-border bg-foreground/5">
                            <Image 
                              src={courseData.image} 
                              alt={courseData.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <div className="font-bold text-foreground group-hover:text-[var(--brand-cyan)] transition-colors truncate max-w-xs md:max-w-sm">
                              {courseData.title}
                            </div>
                            <div className="text-[10px] font-bold text-muted/70 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                              <span className="text-[var(--brand-cyan)]">
                                {courseData.category}
                              </span>
                              <span>&bull;</span>
                              <span>
                                {courseData.instructorName || 
                                 (courseData.instructor && courseData.instructor.name) || 
                                 "Instructor"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-muted">
                          <Clock className="w-3.5 h-3.5 text-muted/50" />
                          {formatDate(enrollment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-black text-foreground">
                        ${enrollment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRatingModalCourse({ ...courseData, existingReview: enrollment.existingReview })}
                            className="inline-flex items-center justify-center rounded-xl bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/20 text-[#fbbf24] p-2 transition-all duration-300"
                            aria-label={enrollment.existingReview ? "Update Review" : "Rate this course"}
                            title={enrollment.existingReview ? "Update Review" : "Rate Course"}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/courses/${courseData._id || courseData.id}`}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--brand-ocean)]/10 hover:bg-[var(--brand-ocean)]/20 border border-[var(--brand-ocean)]/20 text-[var(--brand-ocean)] font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Start Learning
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination component bound dynamically */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Shared Rating Modal for List View */}
      <CourseRatingModal
        isOpen={!!ratingModalCourse}
        onClose={() => setRatingModalCourse(null)}
        courseId={ratingModalCourse?._id || ratingModalCourse?.id}
        courseTitle={ratingModalCourse?.title}
        onRatingSuccess={handleRatingSuccess}
        initialRating={ratingModalCourse?.existingReview?.rating || 0}
        initialMessage={ratingModalCourse?.existingReview?.message || ""}
      />
    </div>
  );
}
