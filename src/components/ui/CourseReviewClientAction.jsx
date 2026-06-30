"use client";

import { useState } from "react";
import { Star, Lock } from "lucide-react";
import CourseRatingModal from "./CourseRatingModal";

export default function CourseReviewClientAction({ isEnrolled, courseId, courseTitle, existingReview, userId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We can choose to reload the page or optimistically update the UI,
  // but for simplicity, we just reload so the server component fetches new reviews.
  const handleRatingSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      {isEnrolled ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-ocean)]/10 hover:bg-[var(--brand-ocean)]/20 text-[var(--brand-ocean)] border border-[var(--brand-ocean)]/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
        >
          <Star className="w-4 h-4 fill-[var(--brand-ocean)]" />
          {existingReview ? "Update Review" : "Write a Review"}
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground/5 text-muted border border-card-border font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed">
          <Lock className="w-4 h-4 text-muted/50" />
          Enroll to Review
        </div>
      )}

      {isEnrolled && (
        <CourseRatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseId={courseId}
          courseTitle={courseTitle}
          onRatingSuccess={handleRatingSuccess}
          initialRating={existingReview?.rating || 0}
          initialMessage={existingReview?.message || ""}
          userId={userId}
        />
      )}
    </>
  );
}
