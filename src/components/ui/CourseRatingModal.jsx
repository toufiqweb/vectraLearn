"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";
import { rateCourseAction } from "@/lib/actions/courseRating";

export default function CourseRatingModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onRatingSuccess,
  initialRating = 0,
  initialMessage = "",
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [reviewMessage, setReviewMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(initialRating);
      setReviewMessage(initialMessage);
      setIsSubmitting(false);
    }
  }, [isOpen, initialRating, initialMessage]);

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
      const result = await rateCourseAction(
        courseId,
        selectedRating,
        reviewMessage,
      );

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity p-4">
      <div className="relative w-full max-w-sm glass-card rounded-[32px] shadow-card p-8 border border-card-border animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-foreground/5 text-muted hover:text-foreground hover:bg-foreground/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6">
          <div className="space-y-2 pt-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Rate this Course
            </h2>
            <p className="text-sm font-medium text-muted line-clamp-2 px-2">
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
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 ${
                    star <= (hoveredRating || selectedRating)
                      ? "text-[#fbbf24] fill-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] scale-110"
                      : "text-muted/30"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          <div className="w-full text-left">
            <textarea
              className="w-full p-4 text-sm font-medium rounded-2xl border border-card-border bg-foreground/5 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all resize-none shadow-inner"
              rows={4}
              placeholder="Write your review message..."
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting || selectedRating === 0 || !reviewMessage.trim()
            }
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 uppercase ${
              selectedRating > 0 && reviewMessage.trim() && !isSubmitting
                ? "bg-gradient-to-r from-brand-cyan to-brand-ocean hover:brightness-110 text-background shadow-lg shadow-brand-cyan/20 active:scale-[0.98]"
                : "bg-foreground/5 text-muted/50 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
