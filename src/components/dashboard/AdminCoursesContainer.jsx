"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  getAllAdminCoursesClient,
  approveOrRejectCourse,
} from "@/lib/api/courses";
import { deleteCourse } from "@/lib/actions/courses";
import Pagination from "@/components/ui/Pagination";
import AdminCoursesTable from "./AdminCoursesTable";

export default function AdminCoursesContainer({ user }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [activeMenu, setActiveMenu] = useState({
    courseId: null,
    top: 0,
    right: 0,
  });

  useEffect(() => {
    const fetchCourses = async (page) => {
      setIsLoading(true);
      try {
        const data = await getAllAdminCoursesClient(user.id, page, 10);
        if (data.success) {
          setCourses(data.data);
          setTotalPages(data.meta.totalPages || 1);
          setCurrentPage(data.meta.currentPage || 1);
        } else {
          toast.error(data.message || "Failed to fetch admin courses.");
        }
      } catch (error) {
        console.error("Error fetching admin courses:", error);
        toast.error("Network error fetching courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses(currentPage);
  }, [currentPage, user.id]);

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

  return (
    <div className="space-y-6 pb-12">
      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <AdminCoursesTable
          courses={courses}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onAction={handleAction}
        />
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
