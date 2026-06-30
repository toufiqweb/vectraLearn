"use client";

import { useState, useEffect, useCallback } from "react";
import CourseCard from "../../../components/ui/CourseCard";
import SearchCourses from "../../../components/ui/SearchCourses";
import Pagination from "../../../components/ui/Pagination";
import { Sparkles } from "lucide-react";
import { getAllCourses } from "@/lib/api/course";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const CoursesPageClient = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const coursesPerPage = 12;

  const debouncedSearch = useDebounce(search, 500);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllCourses({
        page: currentPage,
        limit: coursesPerPage,
        search: debouncedSearch,
        category: category === "All" ? "" : category,
        level: level === "All" ? "" : level,
        sort: sort,
      });

      if (response.success) {
        setCourses(response.data);
        setTotalPages(response.meta.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, category, level, sort]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, level, sort]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
    setSort("");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-10 py-24 space-y-12 max-w-7xl">
      {/* Header */}
      <div className="mb-10 text-center relative flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/10 px-4 py-1.5 mb-6">
          <Sparkles size={14} className="text-brand-cyan fill-brand-cyan" />
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
            Explore Knowledge
          </span>
        </div>

        <h1 className="section-title mb-6 leading-tight max-w-3xl">
          Discover Our
          <span className="text-main-gradient"> Premium Courses</span>
        </h1>

        <p className="section-desc mb-8 max-w-2xl mx-auto">
          Explore industry-focused courses, learn from expert instructors, and
          build real-world skills to accelerate your career journey.
        </p>
      </div>

      {/* Search Input Box Area Segment Wrapper */}
      <div className="relative z-20">
        <SearchCourses
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          level={level}
          setLevel={setLevel}
          sort={sort}
          setSort={setSort}
          handleReset={handleReset}
        />
      </div>

      {/* Courses Grid Container Block */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6">
        {loading ? (
          /* Skeletons to match CourseCard */
          [...Array(coursesPerPage)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-[32px] p-4 flex flex-col h-[400px]"
            >
              <div className="w-full h-48 bg-foreground/5 rounded-2xl animate-pulse mb-4"></div>
              <div className="w-24 h-4 bg-foreground/5 rounded-full animate-pulse mb-4"></div>
              <div className="w-full h-6 bg-foreground/5 rounded-full animate-pulse mb-2"></div>
              <div className="w-2/3 h-6 bg-foreground/5 rounded-full animate-pulse mb-4"></div>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-foreground/5 rounded-full animate-pulse"></div>
                  <div className="w-20 h-4 bg-foreground/5 rounded-full animate-pulse mt-2"></div>
                </div>
                <div className="w-16 h-6 bg-foreground/5 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id || course._id} course={course} />
          ))
        ) : (
          /* Empty State Node Block Integration Form matching design rules */
          <div className="col-span-full text-center py-20 px-4 rounded-[32px] glass-card max-w-md mx-auto">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              No Courses Found
            </h2>

            <p className="text-muted text-xs sm:text-sm font-medium mt-2">
              Try searching with another keyword or tag
            </p>

            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2.5 text-xs font-bold rounded-xl border border-card-border bg-card-bg/60 hover:bg-foreground/5 text-primary transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Reusable Pagination Component */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CoursesPageClient;
