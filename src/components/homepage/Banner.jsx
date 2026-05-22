"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Rocket,
  PlayCircle,
  Users,
  UserCheck,
  BookOpen,
} from "lucide-react";

// Assuming these are your main structural images
import bannerImage from "@/assets/banner.png";
import dot from "@/assets/dot.png";

const Banner = () => {
  // Framer Motion Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
  };

  const floatAnimation = (delay) => ({
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
    },
  });

  return (
    <header  className="bg-linear-to-br from-[#e6edfc] to-[#f4f7ff] ">
      <div className="container mx-auto px-5  rounded-3xl py-12 lg:py-20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-around items-center gap-12 lg:gap-6">
          {/* Left Side: Text & CTAs */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex-1 flex flex-col items-center lg:items-start p-6 z-10"
          >
            <div className="max-w-3xl w-full text-center lg:text-left space-y-6">
              {/* Badge */}
              <motion.div
                variants={fadeUp}
                className="flex w-fit mx-auto lg:mx-0 items-center gap-2 bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-full px-5 py-2"
              >
                <GraduationCap className="text-indigo-600 w-5 h-5" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-sm md:text-base font-semibold">
                  Online Learning Platform
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[#0F172A]"
              >
                Upgrade Your
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Skills Today
                </span>
                <Rocket className="inline-block ml-3 w-8 h-8 md:w-12 md:h-12 text-purple-500 -mt-2" />
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg md:text-xl text-slate-600 max-w-md mx-auto lg:mx-0"
              >
                Learn from industry experts and advance your career with our
                high-quality online courses.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4"
              >
                <Link href={"/courses"}>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3.5 rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                    Explore Courses
                  </button>
                </Link>

                <button className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-2xl hover:bg-slate-50 transition-all duration-300 active:scale-95 shadow-md border border-slate-100 group">
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform text-indigo-600" />
                  How It Works
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Image & Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex-1 flex items-center justify-center p-6 relative"
          >
            <div className="relative flex justify-center items-center w-full max-w-[500px]">
              {/* Background Decor */}
              <Image
                src={dot}
                alt="dot decoration"
                width={80}
                height={80}
                className="absolute -bottom-8 -left-8 opacity-60 animate-pulse"
              />
              <Image
                src={dot}
                alt="dot decoration"
                width={80}
                height={80}
                className="absolute -top-8 -right-8 opacity-60 animate-pulse"
              />

              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  src={bannerImage}
                  alt="Woman learning"
                  width={450}
                  height={450}
                  className="rounded-[2.5rem] shadow-2xl object-cover border-4 border-white"
                  priority
                />
              </div>

              {/* Floating Card 1: Active Students */}
              <motion.div
                variants={floatAnimation(0)}
                initial="initial"
                animate="animate"
                className="absolute -top-6 -left-4 md:-left-12 z-20 backdrop-blur-xl bg-white/90 border border-white shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                    <Users className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="flex flex-col pr-2">
                    <h2 className="font-extrabold text-slate-800 text-base md:text-xl">
                      20K+
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                      Active Students
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2: Expert Instructors */}
              <motion.div
                variants={floatAnimation(1.5)}
                initial="initial"
                animate="animate"
                className="absolute bottom-16 -right-6 md:-right-14 z-20 backdrop-blur-xl bg-white/90 border border-white shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                    <UserCheck className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="flex flex-col pr-2">
                    <h2 className="font-extrabold text-slate-800 text-base md:text-xl">
                      200+
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                      Expert Instructors
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 3: Online Courses */}
              <motion.div
                variants={floatAnimation(0.8)}
                initial="initial"
                animate="animate"
                className="absolute -bottom-8 left-8 md:left-12 z-20 backdrop-blur-xl bg-white/90 border border-white shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                    <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="flex flex-col pr-2">
                    <h2 className="font-extrabold text-slate-800 text-base md:text-xl">
                      500+
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                      Online Courses
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Banner;
