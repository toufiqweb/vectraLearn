"use client";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Signal,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function CourseCard({ course }) {
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
    students,
    level,
    category,
  } = course;

  // console.log(course);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative h-full rounded-[28px] border border-card-border transition-colors duration-300 p-[1px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(109,93,252,0.1)] bg-gradient-to-b from-white/10 to-transparent"
    >
      {/* Inner Glass Surface — Updated to Deep Space Styling Framework */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-card-bg/75 transition-colors duration-300 backdrop-blur-2xl">
        
        {/* Image */}
        <div className="relative h-52 overflow-hidden m-2 rounded-[20px]">
          <Image
            fill
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 transition-colors duration-300 " />

          {/* Top Badges */}
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            <span className="rounded-full border border-card-border bg-card-bg/60 px-3 py-1 text-[11px] font-semibold text-primary transition-colors duration-300 backdrop-blur-md">
              {category}
            </span>

            <span className="flex items-center gap-1 rounded-full border border-card-border bg-card-bg/60 px-2.5 py-1 text-[11px] font-black text-foreground backdrop-blur-md transition-colors duration-300 ">
              <Star
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                strokeWidth={1.5}
              />
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Level */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-card-border bg-card-bg/70 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors duration-300 backdrop-blur-md">
            <Signal className="h-3 w-3 text-indigo-400" strokeWidth={2.5} />
            {level}
          </div>
        </div>

        {/* Body */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-1 flex-col gap-4 p-5"
        >
          <motion.h3
            variants={item}
            className="line-clamp-2 text-base sm:text-lg font-black leading-snug text-foreground tracking-tight group-hover:text-brand-purple transition-colors duration-300 "
          >
            {title}
          </motion.h3>

          {/* Instructor */}
          <motion.div variants={item} className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-foreground shadow-md shadow-indigo-600/10 transition-colors duration-300 "
              style={{ backgroundImage: "linear-gradient(to right, #5643ff, #6d5dfc)" }}
            >
              {(instructorName || instructor || "I")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted transition-colors duration-300 ">Instructor</span>

              <span className="text-sm font-bold text-secondary transition-colors duration-300 ">
                {instructorName || instructor}
              </span>
            </div>
          </motion.div>

          {/* Meta Info Wrapper Card Setup */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-1 rounded-2xl border border-card-border transition-colors duration-300 bg-card-bg/40 p-2.5"
          >
            <div className="flex flex-col items-center gap-1 text-center justify-center">
              <Clock
                className="h-3.5 w-3.5 text-indigo-400"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-muted transition-colors duration-300 ">
                {duration}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 border-x border-card-border transition-colors duration-300 text-center justify-center">
              <BookOpen
                className="h-3.5 w-3.5 text-purple-400"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-muted transition-colors duration-300 ">
                {lessons} lessons
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 text-center justify-center">
              <Users
                className="h-3.5 w-3.5 text-pink-400"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-muted transition-colors duration-300 ">
                {students} students
              </span>
            </div>
          </motion.div>

          {/* Price + CTA Actions Block Section */}
          <motion.div
            variants={item}
            className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-card-border transition-colors duration-300 "
          >
            <div className="flex items-baseline gap-1.5">
              <span
                className="bg-clip-text text-xl font-black text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 transition-colors duration-300 "
              >
                ${price}
              </span>

              {originalPrice > price && (
                <span className="text-xs text-muted transition-colors duration-300 font-semibold line-through">
                  ${originalPrice}
                </span>
              )}
            </div>

            <Link
              href={`/courses/${courseId}`}
              className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#5643ff] to-[#6d5dfc] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
            >
              <span>View Details</span>

              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                strokeWidth={2.5}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}