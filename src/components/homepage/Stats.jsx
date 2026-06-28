"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import globeImg from "@/assets/globe.png";

const stats = [
  {
    value: "200K+",
    label: "Happy Students",
  },
  {
    value: "500+",
    label: "Expert Instructors",
  },
  {
    value: "200+",
    label: "Top Quality Courses",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
  },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden  section-light border border-card-border shadow-sm py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-4 text-sm font-bold tracking-widest uppercase text-brand-ocean"
            >
              Trusted by learners worldwide
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-title max-w-md"
            >
              Numbers speaking
              <br />
              <span className="text-main-gradient drop-shadow-sm">
                for themselves
              </span>
            </motion.h2>

            <div className="mt-16 grid grid-cols-2 gap-y-14 gap-x-12">
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="mt-1 h-14 w-[3px] rounded-full bg-main-gradient" />

                  <div>
                    <h3 className="text-5xl font-black text-foreground">
                      {item.value}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-muted">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="relative hidden lg:block">
            <div className="relative flex items-center justify-center mx-auto h-[600px] w-[600px] rounded-full">
              <Image
                src={globeImg}
                alt="Globe"
                width={500}
                height={500}
                className="object-contain z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
