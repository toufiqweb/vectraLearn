"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TbChartBarPopular } from "react-icons/tb";
import CourseCard from "../ui/CourseCard";

const PopularCourses = ({ courses = [] }) => {
  const topCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [courses]);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="glass-card rounded-2xl p-4">
              <TbChartBarPopular className="h-7 w-7 text-violet-400" />
            </div>

            <div>
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                Top Rated Courses
              </span>

              <h2 className="text-3xl font-bold text-primary md:text-4xl">
                Popular Courses
              </h2>

              <p className="mt-2 text-sm text-muted md:text-base">
                Discover the highest-rated courses loved by thousands of
                students.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
          >
            <span className="text-main-gradient font-semibold">
              View all courses
            </span>

            <FaArrowRight className="text-violet-400 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topCourses.map((course) => (
            <div
              key={course.id}
              className="h-full transition-all duration-500 hover:-translate-y-2"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;