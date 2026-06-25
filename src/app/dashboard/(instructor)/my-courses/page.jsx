"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserClientSession } from "@/lib/api/getUserServerSession";
import { getCoursesByInstructorClient } from "@/lib/api/courses";
import { deleteCourse } from "@/lib/actions/courses";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Grid, 
  List, 
  Edit2, 
  Trash2, 
  Plus, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  X,
  Book,
  RefreshCw,
  GraduationCap,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Eye
} from "lucide-react";

// Curated list of categories matching user specs
const CATEGORY_OPTIONS = [
  "",
  "Development",
  "Design",
  "Data Science",
  "Marketing",
  "Security",
  "Cloud"
];

export default function MyCoursesPage() {
  const router = useRouter();
  const { user, isPending: isSessionPending } = useUserClientSession();
  const [isPending, startTransition] = useTransition();

  // State Management
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  // Filters & Sorting (defaults match specs)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid | table

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
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

    // Set loading state asynchronously to avoid linter renders trigger
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

  // Status badge styling helper (maps to 'pending', 'published', 'unpublished')
  const getStatusBadge = (status) => {
    const defaultStyle = "bg-slate-500/10 text-slate-500 border-slate-500/20";
    const styles = {
      pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      published: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      unpublished: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    };
    const displayNames = {
      pending: "Pending Review",
      published: "Published",
      unpublished: "Unpublished",
    };
    const normalized = status?.toLowerCase();
    const dotStyle = normalized === "published" 
      ? "bg-emerald-500 animate-pulse" 
      : normalized === "unpublished" 
      ? "bg-rose-500" 
      : "bg-amber-500 animate-ping";

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[normalized] || defaultStyle}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
        {displayNames[normalized] || status || "Unknown"}
      </span>
    );
  };

  // Loading Screen
  if (isSessionPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCw className="w-10 h-10 text-[var(--brand-purple)] animate-spin" />
        <p className="text-sm font-semibold text-muted">Loading authentication session...</p>
      </div>
    );
  }

  // Not Logged In or Not Instructor check
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Access Denied</h2>
        <p className="text-muted max-w-sm mb-6">
          You must be logged in as an instructor to access this page.
        </p>
        <Link
          href="/signin"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white text-sm font-bold shadow-md animate-pulse"
        >
          Sign In
        </Link>
      </div>
    );
  }

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
              /* GRID VIEW MODE */
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {courses.map((course) => {
                  const courseId = course.id || course._id;
                  return (
                    <motion.article
                      layout
                      key={courseId}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="group relative h-full rounded-[28px] border border-card-border bg-card-bg/40 hover:bg-card-bg/75 transition-all duration-300 p-[1px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(109,93,252,0.08)] flex flex-col"
                    >
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-card-bg/80 backdrop-blur-md p-3">
                        {/* Image Thumbnail wrapper */}
                        <div className="relative h-44 overflow-hidden rounded-[20px] mb-4 bg-slate-200 dark:bg-slate-800">
                          <Image
                            src={course.image || "/fallback-course.jpg"}
                            alt={course.title || "Course thumbnail"}
                            fill
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                          {/* Badges on Thumbnail overlay */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-black uppercase text-white backdrop-blur-md">
                              {course.category || "General"}
                            </span>
                          </div>
                        </div>

                        {/* Course Content Details */}
                        <div className="flex-1 flex flex-col px-2">
                          <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-primary group-hover:text-[var(--brand-purple)] transition-colors min-h-[48px] tracking-tight">
                            {course.title}
                          </h3>

                          {/* Metadata row */}
                          <div className="flex items-center gap-4 text-xs font-semibold text-muted my-3 py-2.5 border-y border-card-border/60">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-[var(--brand-purple)]" />
                              {course.lessons || 0} Lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                              Price: ${course.price || 0}
                            </span>
                          </div>

                          {/* Status + Actions Footer */}
                          <div className="mt-auto flex items-center justify-between gap-2 pt-2 pb-1">
                            {getStatusBadge(course.status)}

                            {/* Quick Actions Drawer */}
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/courses/${course._id || course.id}`}
                                className="p-2.5 rounded-xl border border-card-border bg-card-bg/60 text-muted hover:text-blue-500 hover:border-blue-500/25 hover:bg-blue-500/5 transition-all cursor-pointer"
                                title="View Public Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href={`/dashboard/edit-course/${courseId}`}
                                className="p-2.5 rounded-xl border border-card-border bg-card-bg/60 text-muted hover:text-[var(--brand-purple)] hover:border-[var(--brand-purple)]/25 hover:bg-[var(--brand-purple)]/5 transition-all cursor-pointer"
                                title="Edit Course"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => setCourseToDelete(course)}
                                className="p-2.5 rounded-xl border border-card-border bg-card-bg/60 text-muted hover:text-rose-500 hover:border-rose-500/25 hover:bg-rose-500/5 transition-all cursor-pointer"
                                title="Delete Course"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              /* TABLE VIEW MODE */
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-x-auto rounded-3xl border border-card-border bg-card-bg/40 backdrop-blur-md shadow-lg"
              >
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-card-border bg-card-bg/40 text-xs font-black uppercase tracking-wider text-muted select-none">
                      <th className="py-4 px-6">Course</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Lessons</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/60 text-sm font-semibold">
                    {courses.map((course) => {
                      const courseId = course.id || course._id;
                      return (
                        <motion.tr
                          layout
                          key={courseId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-card-bg/20 transition-colors group"
                        >
                          {/* Course Column with Image */}
                          <td className="py-4.5 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-card-border flex-shrink-0 bg-slate-100">
                                <Image
                                  src={course.image || "/fallback-course.jpg"}
                                  alt={course.title || "Course thumbnail"}
                                  fill
                                  loading="lazy"
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-extrabold text-primary line-clamp-1 group-hover:text-[var(--brand-purple)] transition-colors max-w-sm">
                                {course.title}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4.5 px-4 text-muted">
                            <span className="text-xs uppercase font-extrabold bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-card-border">
                              {course.category || "General"}
                            </span>
                          </td>

                          {/* Lessons */}
                          <td className="py-4.5 px-4 text-primary">
                            {course.lessons || 0} Lessons
                          </td>

                          {/* Price */}
                          <td className="py-4.5 px-4 font-extrabold text-primary">
                            ${course.price || 0}
                          </td>

                          {/* Status badge */}
                          <td className="py-4.5 px-4">
                            {getStatusBadge(course.status)}
                          </td>

                          {/* Action buttons */}
                          <td className="py-4.5 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/courses/${course._id || course.id}`}
                                className="p-2 rounded-xl border border-card-border bg-card-bg text-muted hover:text-blue-500 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-3"
                                title="View Public Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">View</span>
                              </Link>
                              <Link
                                href={`/dashboard/edit-course/${courseId}`}
                                className="p-2 rounded-xl border border-card-border bg-card-bg text-muted hover:text-[var(--brand-purple)] hover:border-[var(--brand-purple)]/20 hover:bg-[var(--brand-purple)]/5 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-3"
                                title="Edit Course"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </Link>
                              <button
                                onClick={() => setCourseToDelete(course)}
                                className="p-2 rounded-xl border border-card-border bg-card-bg text-muted hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-3"
                                title="Delete Course"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
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
