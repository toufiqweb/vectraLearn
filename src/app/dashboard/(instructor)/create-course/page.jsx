"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  Save,
  DollarSign,
  FileText,
  HelpCircle,
  Clock,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { createCourse } from "@/lib/actions/course";
import { imageUpload } from "@/lib/imageUpload";
import DashboardPageHeader from "@/components/ui/DashboardPageHeader";

export default function CreateCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    category: "",
    duration: "",
    lessons: "",
    level: "Beginner",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
  });

  const [whatYoullLearn, setWhatYoullLearn] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [curriculum, setCurriculum] = useState([{ title: "", lectures: "" }]);

  // Form field change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = await imageUpload(file);
      if (data && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading image to server.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Dynamic lists handlers (What You'll Learn & Requirements)
  const addListField = (type) => {
    if (type === "learn") {
      setWhatYoullLearn([...whatYoullLearn, ""]);
    } else {
      setRequirements([...requirements, ""]);
    }
  };

  const removeListField = (type, index) => {
    if (type === "learn") {
      const updated = whatYoullLearn.filter((_, i) => i !== index);
      setWhatYoullLearn(updated.length ? updated : [""]);
    } else {
      const updated = requirements.filter((_, i) => i !== index);
      setRequirements(updated.length ? updated : [""]);
    }
  };

  const handleListFieldChange = (type, index, value) => {
    if (type === "learn") {
      const updated = [...whatYoullLearn];
      updated[index] = value;
      setWhatYoullLearn(updated);
    } else {
      const updated = [...requirements];
      updated[index] = value;
      setRequirements(updated);
    }
  };

  // Dynamic Curriculum Row handlers
  const addCurriculumRow = () => {
    setCurriculum([...curriculum, { title: "", lectures: "" }]);
  };

  const removeCurriculumRow = (index) => {
    const updated = curriculum.filter((_, i) => i !== index);
    setCurriculum(updated.length ? updated : [{ title: "", lectures: "" }]);
  };

  const handleCurriculumChange = (index, field, value) => {
    const updated = [...curriculum];
    updated[index][field] = value;
    setCurriculum(updated);
  };

  // Navigation validation
  const validateTab = (tabIndex) => {
    if (tabIndex === 0) {
      if (!formData.title.trim()) {
        toast.error("Course title is required.");
        return false;
      }
      if (!formData.category.trim()) {
        toast.error("Category is required.");
        return false;
      }
    } else if (tabIndex === 1) {
      if (!formData.lessons || Number(formData.lessons) <= 0) {
        toast.error("Lessons count must be greater than 0.");
        return false;
      }
      if (!formData.price || Number(formData.price) < 0) {
        toast.error("Price is required.");
        return false;
      }
      if (uploadingImage) {
        toast.error("Please wait for the image upload to complete.");
        return false;
      }
      if (!formData.image.trim()) {
        toast.error("Course thumbnail image is required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateTab(activeTab)) {
      setActiveTab((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTab(0) || !validateTab(1)) return;

    if (!formData.description.trim()) {
      toast.error("Please add a course description.");
      setActiveTab(0);
      return;
    }

    startTransition(async () => {
      const coursePayload = {
        ...formData,
        lessons: Number(formData.lessons),
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : Number(formData.price),
        whatYoullLearn: whatYoullLearn.filter((item) => item.trim() !== ""),
        requirements: requirements.filter((item) => item.trim() !== ""),
        curriculum: curriculum
          .map((chap, index) => ({
            id: String(index + 1).padStart(2, "0"),
            title: chap.title,
            lectures: Number(chap.lectures) || 0,
          }))
          .filter((chap) => chap.title.trim() !== ""),
      };

      const result = await createCourse(coursePayload);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/my-courses");
      } else {
        toast.error(result.error);
        console.log(result.error);
      }
    });
  };

  // Steps indicator names
  const steps = [
    { title: "Basic Info", icon: FileText },
    { title: "Pricing & Media", icon: DollarSign },
    { title: "Requirements", icon: HelpCircle },
    { title: "Curriculum", icon: BookOpen },
  ];

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 md:px-8">
      <div className="mb-8">
        <DashboardPageHeader
          icon={PlusCircle}
          title={
            <>
              Create New{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-ocean">
                Course
              </span>
            </>
          }
          subtitle="Provide detailed information to set up your course. It will go live once approved by the administrators."
        />
      </div>

      {/* Multi-Step Indicator Bar */}
      <div className="grid grid-cols-4 gap-2 mb-10 glass-card rounded-2xl p-3 shadow-sm border border-card-border overflow-x-auto">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = activeTab > idx;
          const isActive = activeTab === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                // Ensure form fields are validated on step click
                let valid = true;
                for (let i = 0; i < idx; i++) {
                  if (!validateTab(i)) {
                    valid = false;
                    break;
                  }
                }
                if (valid) setActiveTab(idx);
              }}
              className={`flex flex-col xl:flex-row items-center justify-center gap-3 p-3 rounded-xl text-center xl:text-left transition-all duration-300 min-w-[80px] ${
                isActive
                  ? "bg-[var(--brand-cyan)]/10 text-[var(--brand-cyan)] shadow-inner"
                  : isCompleted
                    ? "text-[var(--brand-mint)]"
                    : "text-muted hover:bg-foreground/5"
              }`}
            >
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 xl:h-10 xl:w-10 rounded-[14px] flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isActive
                    ? "bg-[var(--brand-cyan)] text-white shadow-md shadow-[var(--brand-cyan)]/30"
                    : isCompleted
                      ? "bg-[var(--brand-mint)] text-white shadow-sm shadow-[var(--brand-mint)]/20"
                      : "bg-foreground/10 text-muted"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 sm:h-6 sm:w-6 xl:h-5 xl:w-5" />
                ) : (
                  <StepIcon className="h-5 w-5 sm:h-6 sm:w-6 xl:h-5 xl:w-5" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-tight mt-1 xl:mt-0">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card rounded-[32px] border border-card-border shadow-card p-6 md:p-10 lg:p-12 transition-colors duration-300">
          {/* STEP 0: BASIC INFORMATION */}
          {activeTab === 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-card-border pb-6">
                <div className="p-2.5 bg-[var(--brand-cyan)]/10 rounded-xl">
                  <FileText className="h-6 w-6 text-[var(--brand-cyan)]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Step 1: Basic Information
                </h2>
              </div>

              <div className="grid gap-8">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                  >
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Master React.js & Next.js from Scratch"
                    className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subTitle"
                    className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                  >
                    Subtitle / Short Summary
                  </label>
                  <input
                    type="text"
                    id="subTitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Build production-ready web applications using App Router"
                    className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Web Development"
                      className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Difficulty Level *
                    </label>
                    <div className="relative">
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all appearance-none"
                      >
                        <option value="Beginner" className="bg-card-bg">
                          Beginner
                        </option>
                        <option value="Intermediate" className="bg-card-bg">
                          Intermediate
                        </option>
                        <option value="Advanced" className="bg-card-bg">
                          Advanced
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-muted">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                  >
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="8"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what the course is about, targeted audiences, and what they will gain."
                    className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all resize-y placeholder:text-muted/50"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: PRICING & MEDIA */}
          {activeTab === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-card-border pb-6">
                <div className="p-2.5 bg-[var(--brand-mint)]/10 rounded-xl">
                  <DollarSign className="h-6 w-6 text-[var(--brand-mint)]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Step 2: Pricing & Details
                </h2>
              </div>

              <div className="grid gap-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Course Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-5 w-5 text-muted" />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="99"
                        className="w-full rounded-2xl border border-card-border bg-foreground/5 pl-11 pr-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="originalPrice"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Original Price ($) (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-4 h-5 w-5 text-muted" />
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="199"
                        className="w-full rounded-2xl border border-card-border bg-foreground/5 pl-11 pr-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Estimated Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4 h-5 w-5 text-muted" />
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 24 hours or Self-paced"
                        className="w-full rounded-2xl border border-card-border bg-foreground/5 pl-11 pr-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lessons"
                      className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider"
                    >
                      Number of Lessons *
                    </label>
                    <input
                      type="number"
                      id="lessons"
                      name="lessons"
                      min="1"
                      value={formData.lessons}
                      onChange={handleInputChange}
                      placeholder="e.g., 45"
                      className="w-full rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent transition-all placeholder:text-muted/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">
                    Course Thumbnail Image *
                  </label>
                  <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-[24px] p-8 bg-foreground/5 hover:bg-foreground/10 transition-all relative overflow-hidden group">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-3 py-8">
                        <RefreshCw className="h-10 w-10 text-[var(--brand-cyan)] animate-spin" />
                        <span className="text-sm font-bold text-muted">
                          Uploading thumbnail...
                        </span>
                      </div>
                    ) : formData.image ? (
                      <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-card-border shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.image}
                            alt="Course preview"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex gap-3 mt-2">
                          <label className="px-5 py-2.5 bg-card-bg border border-card-border rounded-xl text-sm font-bold text-foreground cursor-pointer hover:bg-foreground/5 transition-colors shadow-sm">
                            Change Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                            className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full py-10">
                        <div className="h-16 w-16 bg-foreground/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Plus className="h-8 w-8 text-muted" />
                        </div>
                        <span className="text-base font-bold text-foreground mb-1">
                          Upload Course Image
                        </span>
                        <span className="text-sm font-medium text-muted mt-1">
                          PNG, JPG, JPEG up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          required={!formData.image}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS & WHAT YOU'LL LEARN */}
          {activeTab === 2 && (
            <div className="space-y-10 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-card-border pb-6">
                <div className="p-2.5 bg-[var(--brand-deep)]/10 rounded-xl">
                  <HelpCircle className="h-6 w-6 text-[var(--brand-deep)]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Step 3: Goals & Prerequisites
                </h2>
              </div>

              {/* What You'll Learn */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <label className="block text-base font-bold text-foreground">
                    What will students learn in this course?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("learn")}
                    className="text-sm text-[var(--brand-cyan)] bg-[var(--brand-cyan)]/10 px-4 py-2 rounded-xl hover:bg-[var(--brand-cyan)]/20 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Goal
                  </button>
                </div>

                <div className="space-y-4">
                  {whatYoullLearn.map((val, idx) => (
                    <div key={idx} className="flex gap-3 items-center group">
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-muted font-bold text-sm border border-card-border">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleListFieldChange("learn", idx, e.target.value)
                        }
                        placeholder={`e.g., Build custom React Server Components`}
                        className="flex-1 rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] transition-all placeholder:text-muted/50"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("learn", idx)}
                        className="p-4 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
                        disabled={whatYoullLearn.length === 1 && !val}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-5 pt-8 border-t border-card-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <label className="block text-base font-bold text-foreground">
                    What are the requirements/prerequisites?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("req")}
                    className="text-sm text-[var(--brand-cyan)] bg-[var(--brand-cyan)]/10 px-4 py-2 rounded-xl hover:bg-[var(--brand-cyan)]/20 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Requirement
                  </button>
                </div>

                <div className="space-y-4">
                  {requirements.map((val, idx) => (
                    <div key={idx} className="flex gap-3 items-center group">
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-muted font-bold text-sm border border-card-border">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleListFieldChange("req", idx, e.target.value)
                        }
                        placeholder={`e.g., Decent understanding of modern Javascript ES6+`}
                        className="flex-1 rounded-2xl border border-card-border bg-foreground/5 px-5 py-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] transition-all placeholder:text-muted/50"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("req", idx)}
                        className="p-4 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
                        disabled={requirements.length === 1 && !val}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CURRICULUM */}
          {activeTab === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[var(--brand-ocean)]/10 rounded-xl">
                    <BookOpen className="h-6 w-6 text-[var(--brand-ocean)]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    Step 4: Curriculum Chapters
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addCurriculumRow}
                  className="text-sm bg-[var(--brand-ocean)]/10 text-[var(--brand-ocean)] hover:bg-[var(--brand-ocean)]/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-5 w-5" /> Add Chapter
                </button>
              </div>

              <div className="space-y-6">
                {curriculum.map((chapter, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-5 items-start bg-foreground/5 p-5 sm:p-6 border border-card-border rounded-[24px] relative group hover:border-card-border/80 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-card-bg border border-card-border flex items-center justify-center font-black text-lg text-foreground shrink-0 shadow-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 grid lg:grid-cols-3 gap-5 w-full">
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          Chapter/Module Title
                        </label>
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) =>
                            handleCurriculumChange(idx, "title", e.target.value)
                          }
                          placeholder="e.g., Introduction to the framework"
                          className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-ocean)] transition-all placeholder:text-muted/50 shadow-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          Number of Lectures
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={chapter.lectures}
                          onChange={(e) =>
                            handleCurriculumChange(
                              idx,
                              "lectures",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 5"
                          className="w-full rounded-2xl border border-card-border bg-card-bg px-4 py-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-ocean)] transition-all placeholder:text-muted/50 shadow-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCurriculumRow(idx)}
                      className="p-3 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all self-end md:self-center cursor-pointer border border-transparent hover:border-rose-500/30 md:mt-6"
                      disabled={curriculum.length === 1 && !chapter.title}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          {activeTab > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 border border-card-border hover:bg-foreground/5 bg-card-bg text-foreground font-bold px-6 py-3.5 rounded-2xl text-sm uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98] shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {activeTab < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-[var(--brand-cyan)] hover:brightness-110 text-white font-bold px-8 py-3.5 rounded-2xl text-sm uppercase tracking-wider cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[var(--brand-cyan)]/20"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--brand-cyan)] to-[var(--brand-ocean)] hover:brightness-110 text-white font-black px-10 py-4 rounded-2xl text-sm uppercase tracking-wider cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--brand-cyan)]/30 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" /> Publish Course
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
