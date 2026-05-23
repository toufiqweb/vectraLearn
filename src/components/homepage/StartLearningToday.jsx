import Image from "next/image";
import Link from "next/link";
import React from "react";

import person from "@/assets/person.jpg";

import {
  BookOpen,
  GraduationCap,
  Award,
  Users,
  BadgeCheck,
} from "lucide-react";

const StartLearningToday = () => {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="glass-card overflow-hidden rounded-[32px] border border-white/10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative flex justify-center p-8 lg:p-12">
              <div className="absolute h-64 w-64 rounded-full bg-violet-500/20 blur-[100px]" />

              <Image
                src={person}
                alt="Student Learning"
                width={500}
                height={500}
                className="relative z-10 max-w-md rounded-3xl object-cover shadow-2xl"
                priority
              />
            </div>

            {/* Content Side */}
            <div className="p-8 lg:p-12">
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
                <BadgeCheck
                  size={16}
                  className="text-violet-400"
                />

                <span className="text-sm font-medium text-violet-400">
                  Trusted by 10,000+ Students
                </span>
              </div>

              <h2 className="text-4xl font-bold leading-tight text-primary md:text-5xl">
                Start Learning,
                <span className="text-main-gradient"> Today</span>
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-muted">
                Join SkillSphere and gain access to industry-leading courses,
                expert instructors, hands-on projects, and a supportive
                community designed to help you achieve your career goals.
              </p>

              <p className="mt-4 text-muted">
                Learn at your own pace and build real-world skills in Web
                Development, UI/UX Design, Programming, Data Science,
                Marketing, and much more.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <BookOpen
                    size={22}
                    className="mb-3 text-violet-400"
                  />

                  <h4 className="font-bold text-primary">
                    500+ Courses
                  </h4>

                  <p className="mt-1 text-sm text-muted">
                    Updated regularly
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <GraduationCap
                    size={22}
                    className="mb-3 text-blue-400"
                  />

                  <h4 className="font-bold text-primary">
                    Expert Mentors
                  </h4>

                  <p className="mt-1 text-sm text-muted">
                    Industry professionals
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Users
                    size={22}
                    className="mb-3 text-emerald-400"
                  />

                  <h4 className="font-bold text-primary">
                    10K+ Students
                  </h4>

                  <p className="mt-1 text-sm text-muted">
                    Learning actively
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Award
                    size={22}
                    className="mb-3 text-amber-400"
                  />

                  <h4 className="font-bold text-primary">
                    Lifetime Access
                  </h4>

                  <p className="mt-1 text-sm text-muted">
                    Learn anytime
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/courses">
                  <button className="bg-main-gradient rounded-full px-8 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-105">
                    Start Learning
                  </button>
                </Link>

                <Link href="/courses">
                  <button className="glass-card rounded-full border border-white/10 px-8 py-3 font-semibold text-primary transition-all duration-300 hover:border-violet-500/30">
                    Explore Courses
                  </button>
                </Link>
              </div>

              {/* Trust Text */}
              <p className="mt-5 text-sm text-muted">
                No credit card required • Learn at your own pace • Lifetime access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartLearningToday;