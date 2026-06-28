"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Eraser,
  LayoutGrid,
  Megaphone,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/hero-image.png";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Banner() {
  return (
    <header className="px-6 py-24 hero-bg">
      <section className="mx-auto max-w-7xl ">
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[65vh]">
          {/* Left Column (Content) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start space-y-8 z-10"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground"
            >
              Investing in <br />
              Knowledge and <br />
              <span className="text-main-gradient drop-shadow-sm">
                Your Future
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-md text-muted text-base leading-relaxed font-medium"
            >
              Our e-learning programs has been developed to be a vehicle of
              delivering multimedia learning solutions for your business.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-8 pt-4"
            >
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-main-gradient px-8 py-3.5 text-base font-bold text-white shadow-glow hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                Contact
              </Link>

              <div className="flex items-center gap-8">
                <div>
                  <h3 className="text-3xl font-black text-foreground">
                    50<span className="text-brand-ocean">+</span>
                  </h3>
                  <p className="text-xs font-medium text-muted mt-1">
                    Career Courses
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-foreground">
                    1M<span className="text-brand-ocean">+</span>
                  </h3>
                  <p className="text-xs font-medium text-muted mt-1">
                    Our Students
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Visuals) */}
          <div className="flex items-center justify-center w-full mt-12 lg:mt-0">
            <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] mx-auto">
              {/* Background Circular Shape */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-ocean/10 to-brand-ocean/30 z-0"
              />

              {/* Decorative inner dark circle ring (if dark mode) or outline */}
              <div className="absolute inset-0 rounded-full border-[20px] border-background/50 mix-blend-overlay z-0" />

              {/* Decorative Dots */}
              <motion.div
                variants={float}
                initial="animate"
                animate="animate"
                className="absolute top-[10%] right-[10%] w-4 h-4 rounded-full bg-brand-ocean/60 z-10"
              />
              <motion.div
                variants={float}
                initial="animate"
                animate="animate"
                style={{ animationDelay: "1s" }}
                className="absolute top-[5%] right-[20%] w-3 h-3 rounded-full bg-brand-ocean/40 z-10"
              />
              <motion.div
                variants={float}
                initial="animate"
                animate="animate"
                style={{ animationDelay: "0.5s" }}
                className="absolute bottom-[20%] left-[10%] w-5 h-5 rounded-full bg-brand-mint/40 z-10"
              />

              {/* Main Image - CLIPPED AT BOTTOM, BREAKING OUT TOP */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                // Overflow hidden with rounded-b-full creates a perfect bottom semicircle mask!
                className="absolute bottom-0 left-0 w-full h-[115%] overflow-hidden rounded-b-full z-10"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] h-full">
                  <Image
                    src={heroImage}
                    alt="Student holding books"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              {/* Floating Badge 1 (Top Left) */}
              <motion.div
                variants={float}
                initial="animate"
                animate="animate"
                className="absolute top-[5%] -left-4 sm:-left-12 z-20 flex items-center gap-3 glass-card border-gradient p-3 pr-6 shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-ocean/20 text-brand-ocean">
                  <User size={18} fill="currentColor" />
                </div>
                <div>
                  <div className="text-sm font-black text-foreground">175K</div>
                  <div className="text-[10px] font-semibold text-muted">
                    Assisted Students
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 2 (Bottom Left) */}
              <motion.div
                variants={float}
                initial="animate"
                animate="animate"
                style={{ animationDelay: "1.5s" }}
                className="absolute bottom-[5%] -left-8 sm:-left-16 z-20 flex flex-col gap-4 glass-card border-gradient p-5 shadow-card w-[220px]"
              >
                <div className="text-xs font-bold text-foreground">
                  Learning Chart
                </div>

                <div className="flex items-end gap-2 h-16 w-full">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between h-full text-[8px] font-bold text-muted mr-1">
                    <span>20k</span>
                    <span>10k</span>
                    <span>5k</span>
                  </div>
                  {/* Bars */}
                  <div className="flex-1 flex items-end justify-between h-full border-b border-muted/20 pb-1 gap-1">
                    <div className="w-full bg-brand-ocean rounded-sm h-[60%]" />
                    <div className="w-full bg-brand-cyan rounded-sm h-[80%]" />
                    <div className="w-full bg-brand-mint rounded-sm h-[40%]" />
                    <div className="w-full bg-brand-cyan rounded-sm h-[90%]" />
                    <div className="w-full bg-brand-ocean rounded-sm h-[70%]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* --- BOTTOM SECTION (CATEGORIES) --- */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-10"
        >
          <motion.h2 variants={fadeUp} className="section-title mb-10">
            Browse Top Essential <br />
            Career Courses
          </motion.h2>

          <div className="flex flex-wrap items-center gap-6">
            {/* Card 1: UI/UX Design */}
            <motion.div
              variants={fadeUp}
              className="group relative flex flex-col justify-between w-40 h-40 sm:w-48 sm:h-48 glass-card border-gradient p-6 cursor-pointer"
            >
              <div className="bg-brand-ocean/10 p-2.5 rounded-xl w-fit">
                <Eraser className="text-brand-ocean" size={24} />
              </div>
              <h3 className="text-foreground font-bold text-lg leading-tight mt-auto group-hover:text-brand-ocean transition-colors">
                UI/UX <br /> Design
              </h3>
            </motion.div>

            {/* Card 2: Web Development */}
            <motion.div
              variants={fadeUp}
              className="group relative flex flex-col justify-between w-40 h-40 sm:w-48 sm:h-48 glass-card border-gradient p-6 cursor-pointer"
            >
              <div className="bg-brand-cyan/10 p-2.5 rounded-xl w-fit">
                <Code2 className="text-brand-cyan" size={24} />
              </div>
              <h3 className="text-foreground font-bold text-lg leading-tight mt-auto group-hover:text-brand-cyan transition-colors">
                Web <br /> Development
              </h3>
            </motion.div>

            {/* Card 3: Digital Marketing */}
            <motion.div
              variants={fadeUp}
              className="group relative flex flex-col justify-between w-40 h-40 sm:w-48 sm:h-48 glass-card border-gradient p-6 cursor-pointer"
            >
              <div className="bg-brand-mint/10 p-2.5 rounded-xl w-fit">
                <Megaphone className="text-brand-mint" size={24} />
              </div>
              <h3 className="text-foreground font-bold text-lg leading-tight mt-auto group-hover:text-brand-mint transition-colors">
                Digital <br /> Marketing
              </h3>
            </motion.div>

            {/* Card 4: Practical Learning */}
            <motion.div
              variants={fadeUp}
              className="group relative flex flex-col justify-between w-40 h-40 sm:w-48 sm:h-48 glass-card border-gradient p-6 cursor-pointer"
            >
              <div className="bg-brand-ocean/10 p-2.5 rounded-xl w-fit">
                <LayoutGrid className="text-brand-ocean" size={24} />
              </div>
              <h3 className="text-foreground font-bold text-lg leading-tight mt-auto group-hover:text-brand-ocean transition-colors">
                Practical <br /> Learning
              </h3>
            </motion.div>

            {/* Action Button: Browse All */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-3 ml-4 sm:ml-8 mt-4 sm:mt-0"
            >
              <Link
                href="#"
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-brand-ocean/10 text-brand-ocean hover:bg-brand-ocean hover:text-white hover:shadow-lg hover:shadow-brand-ocean/30 transition-all duration-300"
              >
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <span className="text-sm font-bold text-foreground">
                Browse All
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </header>
  );
}
