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
  const {
    id,
    title,
    instructor,
    image,
    rating,
    price ,
    originalPrice ,
    duration ,
    lessons ,
    students ,
    level ,
    category ,
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
      className="group relative h-full rounded-3xl border border-[var(--glass-border)] p-[1px] shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-glow)]"
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      {/* Inner Glass Surface */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.45rem] bg-[oklch(0.14_0.04_280_/_0.75)] backdrop-blur-xl">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            fill
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.04_280)] via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <span className="rounded-full border border-[var(--glass-border)] bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {category}
            </span>

            <span className="flex items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[oklch(0.14_0.04_280_/_0.7)] px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <Star
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                strokeWidth={1.5}
              />
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Level */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[oklch(0.14_0.04_280_/_0.7)] px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Signal className="h-3 w-3" strokeWidth={2} />
            {level}
          </div>
        </div>

        {/* Body */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-1 flex-col gap-4 p-6"
        >
          <motion.h3
            variants={item}
            className="line-clamp-2 text-lg font-bold leading-snug line-clamp-1 text-white"
          >
            {title}
          </motion.h3>

          {/* Instructor */}
          <motion.div variants={item} className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {instructor
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-foreground/55">Instructor</span>

              <span className="text-sm font-medium text-foreground/90">
                {instructor}
              </span>
            </div>
          </motion.div>

          {/* Meta Info */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--glass-border)] bg-white/[0.04] p-3"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <Clock
                className="h-4 w-4 text-[var(--brand-blue)]"
                strokeWidth={2}
              />
              <span className="text-[11px] font-medium text-foreground/80">
                {duration}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 border-x border-white/10 text-center">
              <BookOpen
                className="h-4 w-4 text-[var(--brand-purple)]"
                strokeWidth={2}
              />
              <span className="text-[11px] font-medium text-foreground/80">
                {lessons} lessons
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Users
                className="h-4 w-4 text-[var(--brand-indigo)]"
                strokeWidth={2}
              />
              <span className="text-[11px] font-medium text-foreground/80">
                {students} students
              </span>
            </div>
          </motion.div>

          {/* Price + CTA */}
          <motion.div
            variants={item}
            className="mt-auto flex items-center justify-between gap-3 pt-2"
          >
            <div className="flex items-baseline gap-2">
              <span
                className="bg-clip-text text-2xl font-bold text-transparent"
                style={{
                  backgroundImage: "var(--gradient-text)",
                }}
              >
                ${price}
              </span>

              {originalPrice > price && (
                <span className="text-sm text-foreground/40 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>

            <Link
              href={`/courses/${id}`}
              className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-[1.04]"
              style={{
                backgroundImage: "var(--gradient-primary)",
              }}
            >
              <span>View Details</span>

              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                strokeWidth={2.25}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}
