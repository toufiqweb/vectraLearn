"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getPendingCoursesClient } from "@/lib/api/course";
import { approveOrRejectCourse } from "@/lib/actions/course";
import SearchFilterBar from "@/components/ui/SearchFilterBar";

export default function PendingCoursesContainer({ user }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const data = await getPendingCoursesClient(user.id);
        if (data.success) {
          setCourses(data.data);
        } else {
          toast.error(data.message || "Failed to fetch pending courses.");
        }
      } catch (error) {
        console.error("Error fetching pending courses:", error);
        toast.error("Network error fetching pending courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCourses();
  }, [user.id]);

  const handleAction = async (courseId, actionType, courseTitle) => {
    const isApprove = actionType === "approve";

    const result = await Swal.fire({
      title: isApprove ? "Approve Course?" : "Reject Course?",
      text: isApprove
        ? `Are you sure you want to publish "${courseTitle}"?`
        : `Are you sure you want to reject "${courseTitle}"?`,
      icon: isApprove ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isApprove ? "Yes, Approve!" : "Yes, Reject!",
      background: "var(--bg-base-100, #ffffff)", // simple fallback
      color: "var(--text-base-content, #000000)",
    });

    if (result.isConfirmed) {
      try {
        const data = await approveOrRejectCourse(courseId, actionType, user.id);

        if (data.success) {
          // Instantly filter out the approved/rejected course from local state
          setCourses((prev) => prev.filter((c) => c._id !== courseId && c.id !== courseId));
          toast.success(data.message || `Course successfully ${actionType}d.`);
          
          Swal.fire({
            title: isApprove ? "Approved!" : "Rejected!",
            text: data.message || `The course has been ${actionType}d.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          toast.error(data.message || "Failed to process action.");
        }
      } catch (error) {
        console.error("Error updating course status:", error);
        toast.error("Network error while updating course status.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex justify-center items-center h-64 glass-card border border-card-border rounded-[24px]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--brand-cyan)]" />
        </div>
      </div>
    );
  }

  const uniqueCategories = ["", ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.instructor?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        searchPlaceholder="Search pending courses..."
        filters={[
          {
            value: selectedCategory,
            onChange: setSelectedCategory,
            options: uniqueCategories.map(cat => ({
              value: cat,
              label: cat === "" ? "ALL CATEGORIES" : cat,
            })),
          },
        ]}
      />

      <div className="glass-card border border-card-border rounded-[24px] shadow-card overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/5 border-b border-card-border text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-4 font-bold">Course</th>
              <th className="px-6 py-4 font-bold">Instructor</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 rounded-full bg-foreground/5">
                      <CheckCircle className="w-8 h-8 text-muted" />
                    </div>
                    <p className="text-sm font-bold">No courses match your criteria.</p>
                    <p className="text-xs font-medium">You&apos;re all caught up!</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course._id || course.id}
                  className="hover:bg-foreground/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-card-border bg-foreground/5">
                        {course.image ? (
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-muted">No Img</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground line-clamp-1 max-w-[250px]">
                          {course.title}
                        </h3>
                        <p className="text-sm font-medium text-muted mt-0.5">
                          ${course.price} • {course.level || "All Levels"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-cyan)]/10 border border-[var(--brand-cyan)]/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[var(--brand-cyan)]">
                          {course.instructor?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {course.instructor?.name || "Unknown Instructor"}
                        </p>
                        <p className="text-xs font-medium text-muted">
                          {course.instructor?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--brand-ocean)]/10 text-[var(--brand-ocean)] border border-[var(--brand-ocean)]/20 uppercase tracking-wider">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAction(course._id || course.id, "approve", course.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-[var(--brand-mint)] bg-[var(--brand-mint)]/10 hover:bg-[var(--brand-mint)]/20 border border-[var(--brand-mint)]/20 rounded-xl transition-all cursor-pointer"
                        title="Approve Course"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleAction(course._id || course.id, "reject", course.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
                        title="Reject Course"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
