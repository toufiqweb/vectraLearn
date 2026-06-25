"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Play, 
  Send, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MoreVertical,
  BookOpen,
  DollarSign
} from "lucide-react";
import { getStatusBadge } from "./CoursesTableView";

export default function CoursesGridView({ courses, handleToggleStatus, setCourseToDelete }) {
  const [activeMenu, setActiveMenu] = useState({ courseId: null, top: 0, right: 0 });
  const dropdownRef = useRef(null);

  const handleToggleMenu = (e, courseId) => {
    e.stopPropagation();
    if (activeMenu.courseId === courseId) {
      setActiveMenu({ courseId: null, top: 0, right: 0 });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveMenu({
        courseId,
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-trigger-btn")
      ) {
        setActiveMenu({ courseId: null, top: 0, right: 0 });
      }
    };

    const handleScrollOrResize = () => {
      setActiveMenu(prev => prev.courseId ? { courseId: null, top: 0, right: 0 } : prev);
    };

    if (activeMenu.courseId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [activeMenu.courseId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {/* Unified Actions Dropdown Trigger */}
                  <div className="inline-block text-left">
                    <button
                      onClick={(e) => handleToggleMenu(e, courseId)}
                      className={`dropdown-trigger-btn p-2 rounded-xl border border-card-border bg-card-bg text-muted hover:text-primary transition-all cursor-pointer relative z-50 flex items-center justify-center ${activeMenu.courseId === courseId ? "ring-2 ring-[var(--brand-purple)]/15 border-[var(--brand-purple)]" : ""}`}
                      title="Actions"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}

      {/* Floating Actions Dropdown Menu */}
      {activeMenu.courseId && (() => {
        const activeCourse = courses.find(c => (c.id || c._id) === activeMenu.courseId);
        if (!activeCourse) return null;
        
        const courseId = activeCourse.id || activeCourse._id;
        const status = activeCourse.status?.toLowerCase();
        const isActionDisabled = status === "pending" || status === "published";

        return (
          <div 
            ref={dropdownRef}
            style={{ 
              position: "fixed",
              top: `${activeMenu.top}px`, 
              right: `${activeMenu.right}px` 
            }}
            className="fixed z-[9999] w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 font-medium animate-in fade-in slide-in-from-top-1 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Option */}
            <Link
              href={`/courses/${courseId}`}
              onClick={() => setActiveMenu({ courseId: null, top: 0, right: 0 })}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-500" />
              <span>View Details</span>
            </Link>

            {/* Status actions: Publish / Unpublish / Submit Review */}
            {status === "published" && (
              <button
                onClick={() => {
                  handleToggleStatus(courseId, "unpublish");
                  setActiveMenu({ courseId: null, top: 0, right: 0 });
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4 text-amber-500" />
                <span>Unpublish</span>
              </button>
            )}

            {status === "unpublished" && (
              <button
                onClick={() => {
                  handleToggleStatus(courseId, "publish");
                  setActiveMenu({ courseId: null, top: 0, right: 0 });
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-500" />
                <span>Publish</span>
              </button>
            )}

            {status === "draft" && (
              <button
                onClick={() => {
                  handleToggleStatus(courseId, "submit");
                  setActiveMenu({ courseId: null, top: 0, right: 0 });
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-indigo-500" />
                <span>Submit Review</span>
              </button>
            )}

            {status === "pending" && (
              <span 
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-amber-500/60 bg-amber-500/5 rounded-xl font-bold select-none cursor-not-allowed"
                title="Under administrative review"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Reviewing</span>
              </span>
            )}

            {/* Divider */}
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

            {/* Edit Option */}
            {isActionDisabled ? (
              <span
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none opacity-40"
                title="Edit is disabled for published/pending courses"
              >
                <Edit3 className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                <span>Edit Course</span>
              </span>
            ) : (
              <Link
                href={`/dashboard/edit-course/${courseId}`}
                onClick={() => setActiveMenu({ courseId: null, top: 0, right: 0 })}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-zinc-500" />
                <span>Edit Course</span>
              </Link>
            )}

            {/* Delete Option */}
            {isActionDisabled ? (
              <span
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none opacity-40"
                title="Delete is disabled for published/pending courses"
              >
                <Trash2 className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                <span>Delete Course</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setCourseToDelete(activeCourse);
                  setActiveMenu({ courseId: null, top: 0, right: 0 });
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Delete Course</span>
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}
