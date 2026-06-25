"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Eye, 
  EyeOff, 
  Play, 
  Send, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MoreVertical 
} from "lucide-react";

// Status badge styling helper
export const getStatusBadge = (status) => {
  const defaultStyle = "bg-slate-500/10 text-slate-500 border-slate-500/20";
  const styles = {
    draft: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    published: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    unpublished: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  };
  const displayNames = {
    draft: "Draft",
    pending: "Pending Review",
    published: "Published",
    unpublished: "Unpublished",
  };
  const normalized = status?.toLowerCase();
  const dotStyle = normalized === "published" 
    ? "bg-emerald-500 animate-pulse" 
    : normalized === "unpublished" 
    ? "bg-rose-500" 
    : normalized === "draft"
    ? "bg-blue-500"
    : "bg-amber-500 animate-ping";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${styles[normalized] || defaultStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {displayNames[normalized] || status || "Unknown"}
    </span>
  );
};

export default function CoursesTableView({ courses, handleToggleStatus, setCourseToDelete }) {
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
    <div className="overflow-x-auto rounded-3xl border border-card-border bg-card-bg/40 backdrop-blur-md shadow-lg">
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
              <tr
                key={courseId}
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

                {/* Actions Dropdown trigger */}
                <td className="relative whitespace-nowrap text-right px-6 py-4">
                  <div className="inline-block text-left">
                    <button
                      onClick={(e) => handleToggleMenu(e, courseId)}
                      className={`dropdown-trigger-btn p-2 rounded-xl border border-card-border bg-card-bg text-muted hover:text-primary transition-all cursor-pointer relative z-50 flex items-center justify-center ${activeMenu.courseId === courseId ? "ring-2 ring-[var(--brand-purple)]/15 border-[var(--brand-purple)]" : ""}`}
                      title="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
