"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import person2 from "../../assets/person2.jpg";
import person3 from "../../assets/person3.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const LearningTips = () => {
  const [students, setStudents] = useState([]);

  return (
    <section className="relative overflow-hidden section-light py-16 lg:py-24 transition-colors duration-300">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-brand-mint/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* LEFT COLUMN (Text Content) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-start max-w-xl"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-6">
              Our Commitment to Excellence, Learn, Grow & Success.
            </motion.h2>

            <motion.p variants={fadeUp} className="section-desc mb-8">
              We are passionate about transforming lives through education.
              Founded with a vision to make learning accessible to all, we
              believe in the power of knowledge to
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="grid sm:grid-cols-2 gap-y-5 gap-x-6 mb-10 w-full"
            >
              {[
                "9/10 Average Satisfaction Rate",
                "Friendly Environment & Expert Teacher",
                "96% Completion Rate",
                "9/10 Average Satisfaction Rate",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 fill-brand-mint text-white shrink-0 mt-0.5 shadow-sm rounded-full" />
                  <span className="text-sm font-bold text-foreground leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xl bg-brand-mint px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:brightness-110 transition-all duration-300 hover:scale-105"
              >
                Read More
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN (Collage Grid) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4 lg:gap-5"
          >
            {/* Left Sub-Column */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {/* Green Reviews Card */}
              <div className="bg-brand-mint rounded-3xl p-6 flex flex-col items-center justify-center text-center text-white shadow-lg h-44 sm:h-52 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-white rounded-full p-2.5 mb-3 shadow-md flex items-center justify-center">
                  <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <div className="font-extrabold text-xl sm:text-2xl mb-1">
                  4.6 (2.4k)
                </div>
                <div className="text-xs sm:text-sm font-bold opacity-90 tracking-wide uppercase">
                  AVG Reviews
                </div>
              </div>

              {/* Small Image */}
              <div className="relative rounded-3xl overflow-hidden h-44 sm:h-56 shadow-lg bg-muted/20 group">
                <Image
                  src={person2}
                  alt="Students collaborating"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Right Sub-Column */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {/* Tall Image */}
              <div className="relative rounded-3xl overflow-hidden h-full min-h-[250px] sm:min-h-[300px] shadow-lg bg-muted/20 group">
                <Image
                  src={person3}
                  alt="Student Success"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Bottom Full-Width Card */}
            <div className="col-span-2 bg-brand-ocean rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <div className="font-bold text-base sm:text-lg">
                36k+ Enrolled Students
              </div>
              <div className="flex -space-x-3">
                {students.length > 0 ? (
                  students.map((student, idx) => (
                    <Image
                      height={40}
                      width={40}
                      key={student._id || idx}
                      src={
                        student.image ||
                        student.photoURL ||
                        `https://i.pravatar.cc/150?u=${student._id || idx}`
                      }
                      className="w-10 h-10 rounded-full ring-2 ring-brand-ocean object-cover bg-white"
                      alt={student.name || "Student"}
                    />
                  ))
                ) : (
                  // Fallback while loading
                  <>
                    <Image
                      height={40}
                      width={40}
                      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                      className="w-10 h-10 rounded-full ring-2 ring-brand-ocean object-cover bg-white"
                      alt="Student"
                    />
                    <Image
                      height={40}
                      width={40}
                      src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                      className="w-10 h-10 rounded-full ring-2 ring-brand-ocean object-cover bg-white"
                      alt="Student"
                    />
                    <Image
                      height={40}
                      width={40}
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      className="w-10 h-10 rounded-full ring-2 ring-brand-ocean object-cover bg-white"
                      alt="Student"
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LearningTips;
