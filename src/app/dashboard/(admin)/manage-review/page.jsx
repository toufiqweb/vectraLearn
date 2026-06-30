"use client";

import React, { useState, useEffect } from "react";
import { MessageSquareWarning, Trash2, Star, Loader2, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Pagination from "@/components/ui/Pagination";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getAllReviewsForModerationClient } from "@/lib/api/review";
import { deleteReviewAdminClient } from "@/lib/actions/review";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import DashboardPageHeader from "@/components/ui/DashboardPageHeader";



export default function ManageReviewPage() {
  const { data: session, isPending } = useSession();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const data = await getAllReviewsForModerationClient(session.user.id, currentPage, 10);
        
        if (data.success) {
          setReviews(data.reviews);
          setTotalPages(data.totalPages || 1);
        } else {
          toast.error("Failed to load reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Error loading reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, session?.user?.id]);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This will permanently remove the review and recalculate the course rating.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteReviewAdminClient(session.user.id, reviewId);
        
        if (data.success) {
          toast.success(data.message || "Review deleted successfully.");
          setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        } else {
          toast.error(data.message || "Failed to delete review.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting.");
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"}`}
      />
    ));
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const filteredReviews = reviews.filter(r => {
    const searchMatch = (r.userName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (r.message || "").toLowerCase().includes(searchQuery.toLowerCase());
    const ratingMatch = ratingFilter === "" || r.rating.toString() === ratingFilter;
    return searchMatch && ratingMatch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10">
      {/* Page Header */}
      <DashboardPageHeader
        icon={MessageSquareWarning}
        title={
          <>
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-ocean">Reviews</span>
          </>
        }
        subtitle="Monitor, moderate, and remove inappropriate course reviews from the platform."
        rightContent={
          <span className="px-4 py-2 rounded-xl bg-foreground/5 border border-card-border text-xs font-bold text-muted flex items-center gap-2 shadow-sm">
            <ShieldCheck size={16} className="text-brand-mint" /> 
            Community Moderation
          </span>
        }
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        searchPlaceholder="Search reviews or students..."
        filters={[
          {
            value: ratingFilter,
            onChange: setRatingFilter,
            options: [
              { value: "", label: "ALL RATINGS" },
              { value: "5", label: "5 Stars" },
              { value: "4", label: "4 Stars" },
              { value: "3", label: "3 Stars" },
              { value: "2", label: "2 Stars" },
              { value: "1", label: "1 Star" },
            ],
          },
        ]}
      />

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <MessageSquareWarning className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No reviews found
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              There are currently no reviews on the platform to moderate.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 dark:bg-zinc-800/50 text-xs uppercase font-bold text-gray-500 dark:text-zinc-400 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-tl-3xl whitespace-nowrap">Student Details</th>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap">Rating</th>
                  <th scope="col" className="px-6 py-4">Review Content</th>
                  <th scope="col" className="px-6 py-4 rounded-tr-3xl text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {review.userName || "Student"}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {review.userEmail || "No Email"}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-2 font-mono">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-gray-700 dark:text-gray-300 max-w-lg" title={review.message}>
                        <p className="line-clamp-3 leading-relaxed">
                          {review.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                        title="Delete Review"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          onPageChange={(page) => setCurrentPage(page)} 
          totalPages={totalPages} 
          useUrlQuery={false}
        />
      )}
    </div>
  );
}
