"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { 
  Search, 
  Grid, 
  List, 
  Trash2, 
  Plus, 
  BookOpen, 
  AlertTriangle, 
  X,
  Book,
  RefreshCw,
  GraduationCap,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { getCoursesByInstructorClient } from "@/lib/api/courses";
import { deleteCourse } from "@/lib/actions/courses";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import CoursesTableView from "./CoursesTableView";
import CoursesGridView from "./CoursesGridView";

const CATEGORY_OPTIONS = [
  "",
  "Development",
  "Design",
  "Data Science",
  "Marketing",
  "Security",
  "Cloud"
];

export default function MyCoursesContainer({ user, initialCoursesData }) {
  const [isPending, startTransition] = useTransition();

  // State Management
  const [courses, setCourses] = useState(initialCoursesData?.data || []);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid | table

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialCoursesData?.meta?.totalPages || 1);
  const [totalCourses, setTotalCourses] = useState(initialCoursesData?.meta?.totalCourses || 0);
  
  // Deletion Modal State
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  // Dynamic Pagination Limit
  const limit = viewMode === "grid" ? 9 : 10;

  // Debounce Search Query Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page number on filter/sort/view changes (asynchronously to avoid linter warnings)
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(handler);
  }, [debouncedSearch, selectedCategory, selectedStatus, sortBy, viewMode]);

  // Fetch paginated data from Express API
  useEffect(() => {
    let active = true;
    if (!user?.id) return;

    // Set loading state
    const timer = setTimeout(() => {
      if (active) setLoadingCourses(true);
    }, 0);

    const fetchCourses = async () => {
      try {
        const res = await getCoursesByInstructorClient(
          user.id,
          currentPage,
          limit,
          {
            search: debouncedSearch,
            category: selectedCategory,
            status: selectedStatus,
            sort: sortBy
          }
        );
        if (active) {
          if (res?.success) {
            setCourses(res.data || []);
            setTotalPages(res.meta?.totalPages || 1);
            setTotalCourses(res.meta?.totalCourses || 0);
          } else {
            toast.error(res?.message || "Failed to load courses");
          }
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        if (active) {
          toast.error("Failed to fetch courses. Please check your connection.");
        }
      } finally {
        if (active) {
          setLoadingCourses(false);
        }
      }
    };

    fetchCourses();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [user?.id, currentPage, limit, debouncedSearch, selectedCategory, selectedStatus, sortBy]);

  // Handler for course deletion
  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;

    startTransition(async () => {
      try {
        const result = await deleteCourse(courseId, user.id);
        if (result?.success) {
          toast.success(result.message || "Course deleted successfully");
          
          // UI Update: Filter out the deleted course from local React state array instantly
          setCourses(prev => prev.filter(c => c._id !== courseId && c.id !== courseId));
          setTotalCourses(prev => Math.max(0, prev - 1));
          
          // Adjust page number if the current page becomes empty and we're not on page 1
          if (courses.length <= 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }

          // Reset deletion state on completion
          setCourseToDelete(null);
        } else {
          toast.error(result?.error || result?.message || "Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("An unexpected error occurred while deleting the course.");
      }
    });
  };

  // Handler for course status toggling (publish / unpublish / submit)
  const handleToggleStatus = async (courseId, actionType) => {
    if (!courseId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-instructor-id": user.id,
        },
        body: JSON.stringify({ action: actionType }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || `Status updated successfully!`);
        
        // Update local React state instantly by mapping over the courses array
        setCourses(prev =>
          prev.map(c => {
            if (c._id === courseId || c.id === courseId) {
              return { 
                ...c, 
                status: data.status || (actionType === "publish" ? "published" : actionType === "unpublish" ? "unpublished" : "pending") 
              };
            }
            return c;
          })
        );
      } else {
        toast.error(data.message || "Failed to update course status.");
      }
    } catch (error) {
      console.error("Error toggling course status:", error);
      toast.error("An error occurred while updating course status.");
    }
  };

  const isFiltered = debouncedSearch !== "" || selectedCategory !== "" || selectedStatus !== "";

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card-bg/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-purple)]/5 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--brand-purple)]/10 text-[var(--brand-purple)]">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--brand-purple)]">Instructor Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">My Courses</h1>
            <p className="text-sm text-muted mt-1 font-medium">
              Manage, monitor, and configure the learning material you&apos;ve designed.
            </p>
          </div>
          <Link
            href="/dashboard/create-course"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Control Actions / Filter Panels */}
      {(totalCourses > 0 || isFiltered) && (
        <div className="flex flex-col lg:flex-row justify-between gap-4 p-4 rounded-2xl border border-card-border bg-card-bg/20 backdrop-blur-md">
          {/* Searching */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-muted">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card-bg border border-card-border text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/15 outline-none transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtering parameters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-card-bg border border-card-border text-primary font-bold text-xs uppercase tracking-wider pl-4 pr-10 py-3 rounded-xl focus:border-[var(--brand-purple)] outline-none cursor-pointer transition-all min-w-[150px]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "" ? "ALL CATEGORIES" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            {/* Status selection */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-card-bg border border-card-border text-primary font-bold text-xs uppercase tracking-wider pl-4 pr-10 py-3 rounded-xl focus:border-[var(--brand-purple)] outline-none cursor-pointer transition-all min-w-[150px]"
              >
                <option value="">ALL STATUSES</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            {/* Sort Selection */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card-bg border border-card-border text-primary font-bold text-xs uppercase tracking-wider pl-4 pr-10 py-3 rounded-xl focus:border-[var(--brand-purple)] outline-none cursor-pointer transition-all min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title-asc">Title: A-Z</option>
                <option value="title-desc">Title: Z-A</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            {/* Grid/Table Mode Toggles */}
            <div className="flex border border-card-border rounded-xl bg-card-bg p-1.5 gap-1 self-stretch">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[var(--brand-purple)] text-white" : "text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-[var(--brand-purple)] text-white" : "text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Course Listing section */}
      {loadingCourses ? (
        viewMode === "grid" ? <GridSkeleton /> : <TableSkeleton />
      ) : totalCourses === 0 && !isFiltered ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 sm:p-16 text-center border-2 border-dashed border-card-border rounded-[32px] bg-card-bg/10 backdrop-blur-md"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[var(--brand-purple)]/10 rounded-full blur-xl scale-125" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[var(--brand-purple)]/15 border border-[var(--brand-purple)]/25 text-[var(--brand-purple)]">
              <Book className="w-10 h-10 animate-bounce" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-primary tracking-tight">No Courses Found</h3>
          <p className="text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">
            You haven’t designed any courses yet. Share your knowledge with the world!
          </p>
          <div className="flex gap-4 items-center justify-center mt-8">
            <Link
              href="/dashboard/create-course"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              Create Your First Course
            </Link>
          </div>
        </motion.div>
      ) : courses.length === 0 ? (
        /* Filtered Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center border border-card-border bg-card-bg/20 rounded-2xl">
          <Layers className="w-10 h-10 text-muted mb-3" />
          <h4 className="text-lg font-bold text-primary">No results match your filters</h4>
          <p className="text-sm text-muted mt-1">Try clearing some query filters or search keywords.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedStatus("");
            }}
            className="mt-4 px-4 py-2 border border-card-border rounded-xl text-xs font-bold uppercase tracking-wider text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Render Layouts */
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {viewMode === "grid" ? (
              <CoursesGridView 
                courses={courses}
                handleToggleStatus={handleToggleStatus}
                setCourseToDelete={setCourseToDelete}
              />
            ) : (
              <CoursesTableView 
                courses={courses}
                handleToggleStatus={handleToggleStatus}
                setCourseToDelete={setCourseToDelete}
              />
            )}
          </AnimatePresence>

          {/* Standalone Pagination Section */}
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}

      {/* Dynamic Confirmation Modal */}
      <AnimatePresence>
        {courseToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay with motion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setCourseToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md dark:bg-black/80"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-card-border bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 z-10 text-center"
            >
              {/* Alert/Warning Icon */}
              <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4 animate-bounce">
                <AlertTriangle className="w-7 h-7" />
              </div>

              {/* Title & Warning message */}
              <h3 className="text-xl font-black text-primary tracking-tight mb-2 dark:text-white">Delete Course?</h3>
              <p className="text-sm text-muted dark:text-slate-300 leading-relaxed mb-6">
                Are you sure you want to permanently delete <strong className="text-primary dark:text-white font-bold">&ldquo;{courseToDelete?.title}&rdquo;</strong>? 
                This action is irreversible.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 items-center justify-end pt-4 border-t border-card-border dark:border-slate-800">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setCourseToDelete(null)}
                  className="flex-1 py-3 px-5 text-center text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 border border-card-border bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDeleteCourse(courseToDelete.id || courseToDelete._id)}
                  className="flex-1 py-3 px-5 text-center text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 shadow-lg shadow-rose-500/15 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skeletons definitions for loading course state
const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse rounded-[28px] border border-card-border bg-card-bg/25 p-4 h-[380px] flex flex-col gap-4">
        <div className="h-44 rounded-[20px] bg-slate-200 dark:bg-slate-800 w-full" />
        <div className="flex-1 flex flex-col gap-3 px-1">
          <div className="h-5 rounded bg-slate-200 dark:bg-slate-800 w-5/6" />
          <div className="h-4 rounded bg-slate-200 dark:bg-slate-800 w-1/2" />
          <div className="h-8 rounded-xl bg-slate-200 dark:bg-slate-800 w-full mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="w-full overflow-hidden rounded-3xl border border-card-border bg-card-bg/25 backdrop-blur-md animate-pulse">
    <div className="h-14 border-b border-card-border bg-card-bg/40" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b border-card-border">
        <div className="h-10 w-14 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded bg-slate-200 dark:bg-slate-800 w-1/3" />
        </div>
        <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-12 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 ml-auto" />
      </div>
    ))}
  </div>
);
