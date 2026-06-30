"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getAllAdminCoursesClient } from "@/lib/api/course";
import { deleteCourse, approveOrRejectCourse } from "@/lib/actions/course";
import Pagination from "@/components/ui/Pagination";
import AdminCoursesTable from "./AdminCoursesTable";
import SearchFilterBar from "@/components/ui/SearchFilterBar";

export default function AdminCoursesContainer({ user }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [activeMenu, setActiveMenu] = useState({
    courseId: null,
    top: 0,
    right: 0,
  });

  // Reset to page 1 when limit changes
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [limit]);

  useEffect(() => {
    let active = true;

    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await getAllAdminCoursesClient(user.id, currentPage, limit);
        
        if (!active) return;
        
        if (data.success) {
          setCourses(data.data);
          setTotalPages(data.meta.totalPages || 1);
          setTotalCourses(data.meta.totalCourses || 0);
        } else {
          toast.error(data.message || "Failed to fetch admin courses.");
        }
      } catch (error) {
        if (!active) return;
        console.error("Error fetching admin courses:", error);
        toast.error("Network error fetching courses.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchCourses();
    
    return () => { active = false; };
  }, [currentPage, limit, user.id]);

  const handleAction = async (courseId, actionType, courseTitle) => {
    if (actionType === "delete") {
      const result = await Swal.fire({
        title: "Delete Course?",
        text: `Are you sure you want to permanently delete "${courseTitle}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Delete",
      });

      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteCourse(courseId, user.id);
          if (res.success) {
            toast.success("Course deleted successfully.");
            setCourses((prev) =>
              prev.filter((c) => (c._id || c.id) !== courseId),
            );
            if (courses.length <= 1 && currentPage > 1) {
              setCurrentPage((prev) => prev - 1);
            }
          } else {
            toast.error(res.error || "Failed to delete course.");
          }
        });
      }
      return;
    }

    const isApprove = actionType === "approve";
    const isPublish = actionType === "publish";
    const isReject = actionType === "reject";
    const isUnpublish = actionType === "unpublish";

    const titleMap = {
      approve: "Approve Course?",
      publish: "Publish Course?",
      reject: "Reject Course?",
      unpublish: "Unpublish Course?",
    };
    const textMap = {
      approve: `Approve and publish "${courseTitle}" to all students?`,
      publish: `Re-publish "${courseTitle}" so it becomes visible again?`,
      reject: `Are you sure you want to reject "${courseTitle}"?`,
      unpublish: `Are you sure you want to unpublish "${courseTitle}"? Students will no longer see it.`,
    };
    const colorMap = {
      approve: "#10b981",
      publish: "#10b981",
      reject: "#ef4444",
      unpublish: "#f59e0b",
    };

    const result = await Swal.fire({
      title: titleMap[actionType] || "Confirm Action?",
      text:
        textMap[actionType] ||
        `Are you sure you want to ${actionType} "${courseTitle}"?`,
      icon: isApprove || isPublish ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: colorMap[actionType] || "#6b7280",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`,
    });

    if (result.isConfirmed) {
      try {
        const data = await approveOrRejectCourse(courseId, actionType, user.id);

        if (data.success) {
          toast.success(data.message || `Course successfully ${actionType}d.`);

          setCourses((prev) =>
            prev.map((c) => {
              if ((c._id || c.id) === courseId) {
                return { ...c, status: data.status };
              }
              return c;
            }),
          );
        } else {
          toast.error(data.message || "Failed to process action.");
        }
      } catch (error) {
        console.error(`Error ${actionType}ing course:`, error);
        toast.error(`Network error while ${actionType}ing course.`);
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.instructor?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "" || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        searchPlaceholder="Search courses or instructors..."
        filters={[
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
              { value: "", label: "ALL STATUSES" },
              { value: "published", label: "Published" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
              { value: "unpublished", label: "Unpublished" },
            ],
          },
        ]}
      />

      {isLoading ? (
        <div className="glass-card rounded-2xl p-6 min-h-[400px] flex items-center justify-center dark:bg-gray-800/40">
          <Loader2 className="w-10 h-10 animate-spin text-brand-mint" />
        </div>
      ) : (
        <AdminCoursesTable
          courses={filteredCourses}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onAction={handleAction}
        />
      )}

      {!isLoading && (totalPages > 1 || totalCourses > 0) && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-white/5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalCourses}
            itemsPerPage={limit}
            onItemsPerPageChange={setLimit}
          />
        </div>
      )}
    </div>
  );
}
