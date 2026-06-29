"use client";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  BookOpen,
  Signal,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/context/WishlistProvider";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CourseCard({ course, allowRating = false, onRateClick, existingReview }) {
  const courseId = course.id || course._id;
  const {
    title,
    instructor,
    instructorName,
    image,
    rating,
    price,
    originalPrice,
    duration,
    lessons,
    level,
  } = course;

  const nameOfInstructor =
    instructorName ||
    (instructor && typeof instructor === "object" ? instructor.name : instructor) ||
    "Instructor";

  const { wishlistedIds, toggleWishlist, loadingIds, isStudent } = useWishlist();

  const courseIdStr = courseId?.toString();
  const isWishlisted = wishlistedIds.has(courseIdStr);
  const isToggling = loadingIds.has(courseIdStr);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isToggling) {
      toggleWishlist(courseIdStr, title);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative h-full flex flex-col rounded-2xl border border-card-border bg-card-bg shadow-md transition-all hover:shadow-lg overflow-hidden"
    >
      {/* 1. Card Container & Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/10">
        <Image
          fill
          src={image}
          alt={title}
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top-Right Bookmark (Wishlist) */}
        {isStudent && (
          <motion.button
            onClick={handleWishlistClick}
            disabled={isToggling}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`
              absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full
              backdrop-blur-md transition-all duration-300 cursor-pointer shadow-sm
              ${isWishlisted
                ? "bg-card-bg border border-card-border text-brand-cyan shadow-glow" 
                : "bg-white/70 hover:bg-white border-transparent text-muted hover:text-foreground dark:bg-black/50 dark:hover:bg-black/80"
              }
              ${isToggling ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-200 ${isToggling ? "animate-pulse" : ""}`}
              fill={isWishlisted ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </motion.button>
        )}
      </div>

      {/* Content wrapper */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-1 flex-col p-5"
      >
        {/* 2. Header & Subtitle */}
        <motion.div variants={item} className="flex justify-between items-start gap-4 mb-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-main-gradient transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-foreground">
              {rating?.toFixed(1) ?? "0.0"}
            </span>
          </div>
        </motion.div>

        <motion.p variants={item} className="text-sm font-medium text-muted mb-5">
          Instructor: {nameOfInstructor}
        </motion.p>

        {/* 3. Body (Vertical Info List) */}
        <motion.div variants={item} className="flex flex-col gap-2.5 mb-6 mt-auto text-sm font-medium text-muted">
          <div className="flex items-center gap-3">
            <Signal className="h-4 w-4 text-brand-ocean" strokeWidth={2.5} />
            <span>{level} Level</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-brand-ocean" strokeWidth={2.5} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-brand-ocean" strokeWidth={2.5} />
            <span>{lessons} Lessons</span>
          </div>
        </motion.div>

        {/* 4. Footer (Price & Action) */}
        <motion.div variants={item} className="flex items-center justify-between pt-4 border-t border-card-border mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-0.5">
              Start from
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-foreground">
                ${price}
              </span>
              {originalPrice > price && (
                <span className="text-xs text-muted font-semibold line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allowRating && (
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (onRateClick) onRateClick(course); 
                }}
                className="inline-flex items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-2.5 transition-colors duration-300"
                aria-label={existingReview ? "Update Review" : "Rate this course"}
                title={existingReview ? "Update Review" : "Rate Course"}
              >
                <Star className="h-4 w-4" />
              </button>
            )}
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center justify-center rounded-xl bg-main-gradient px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all duration-300 hover:scale-105"
            >
              View Details
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}