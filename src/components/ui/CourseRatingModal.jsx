"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { rateCourseAction } from "@/lib/actions/courseRating";

export default function CourseRatingModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onRatingSuccess,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error("Please select a rating first.");
      return;
    }
    if (!reviewMessage.trim()) {
      toast.error("Please write a review message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await rateCourseAction(courseId, selectedRating, reviewMessage);

      if (result.success) {
        toast.success("Rating submitted successfully!");
        if (onRatingSuccess) {
          onRatingSuccess(result.newAverageRating, result.newTotalRatingsCount);
        }
        onClose();
      } else {
        toast.error(result.message || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("An error occurred while submitting your rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 m-4 border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-5">
          <div className="space-y-1.5 pt-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Rate this Course
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 px-2">
              {courseTitle}
            </p>
          </div>

          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setSelectedRating(star)}
              >
                <Star
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200 ${
                    star <= (hoveredRating || selectedRating)
                      ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                      : "text-gray-200 dark:text-zinc-700"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          <div className="w-full text-left">
            <textarea
              className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              rows={4}
              placeholder="Write your review message..."
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRating === 0 || !reviewMessage.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${
              selectedRating > 0 && reviewMessage.trim() && !isSubmitting
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
