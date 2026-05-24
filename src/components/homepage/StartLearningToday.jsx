import Image from "next/image";
import Link from "next/link";
import React from "react";
import girl from "@/assets/girl.png";

import {
  BookOpen,
  GraduationCap,
  Award,
  Users,
  BadgeCheck,
} from "lucide-react";

const StartLearningToday = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="glass-card overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Side */}
            <div className="relative flex justify-center p-5 sm:p-8 lg:p-12">
              <div className="absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-violet-500/20 blur-[100px]" />

              <Image
                src={girl}
                alt="Student Learning"
                width={500}
                height={500}
                priority
                className="relative z-10 w-full max-w-[280px] rounded-3xl object-cover  sm:max-w-sm md:max-w-md"
              />
            </div>

            {/* Content Side */}
            <div className="p-5 sm:p-8 lg:p-12">
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-2 sm:px-4">
                <BadgeCheck
                  size={16}
                  className="text-violet-400"
                />

                <span className="text-xs font-medium text-violet-400 sm:text-sm">
                  Trusted by 10,000+ Students
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                Start Learning,
                <span className="text-main-gradient"> Today</span>
              </h2>

              {/* Description */}
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                Join SkillSphere and gain access to industry-leading courses,
                expert instructors, hands-on projects, and a supportive
                community designed to help you achieve your career goals.
              </p>

              <p className="mt-4 text-sm text-muted sm:text-base">
                Learn at your own pace and build real-world skills in Web
                Development, UI/UX Design, Programming, Data Science,
                Marketing, and much more.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/20 sm:p-4">
                  <BookOpen
                    size={20}
                    className="mb-2 text-violet-400 sm:mb-3"
                  />

                  <h4 className="text-sm font-bold text-primary sm:text-base">
                    500+ Courses
                  </h4>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Updated regularly
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/20 sm:p-4">
                  <GraduationCap
                    size={20}
                    className="mb-2 text-blue-400 sm:mb-3"
                  />

                  <h4 className="text-sm font-bold text-primary sm:text-base">
                    Expert Mentors
                  </h4>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Industry professionals
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/20 sm:p-4">
                  <Users
                    size={20}
                    className="mb-2 text-emerald-400 sm:mb-3"
                  />

                  <h4 className="text-sm font-bold text-primary sm:text-base">
                    10K+ Students
                  </h4>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Learning actively
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/20 sm:p-4">
                  <Award
                    size={20}
                    className="mb-2 text-amber-400 sm:mb-3"
                  />

                  <h4 className="text-sm font-bold text-primary sm:text-base">
                    Lifetime Access
                  </h4>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Learn anytime
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto"
                >
                  <button className="bg-main-gradient w-full rounded-full px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-105">
                    Start Learning
                  </button>
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto"
                >
                  <button className="glass-card w-full rounded-full border border-white/10 px-8 py-3 font-semibold text-primary transition-all duration-300 hover:border-violet-500/30">
                    Explore Courses
                  </button>
                </Link>
              </div>

              {/* Trust Text */}
              <p className="mt-5 text-center text-xs text-muted sm:text-left sm:text-sm">
                No credit card required • Learn at your own pace • Lifetime
                access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartLearningToday;