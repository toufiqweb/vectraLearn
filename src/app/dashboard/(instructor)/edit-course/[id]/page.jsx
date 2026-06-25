"use client";

import { use, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUserClientSession } from "@/lib/api/getUserServerSession";
import { getCourseById } from "@/lib/api/courses";
import { imageUpload } from "@/lib/imageUpload";
import { 
  BookOpen, Plus, Trash2, ArrowRight, ArrowLeft, 
  Check, Save, DollarSign, FileText, 
  HelpCircle, Clock, RefreshCw, AlertTriangle, ChevronDown
} from "lucide-react";

export default function EditCoursePage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  
  const { user, isPending: isSessionPending } = useUserClientSession();
  const [isPending, startTransition] = useTransition();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  // Centralized Course Form State Strategy
  const [courseFormData, setCourseFormData] = useState({
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
    whatYoullLearn: [""],
    requirements: [""],
    curriculum: [{ title: "", lectures: "" }],
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Load course details on mount (without automatic persistence)
  useEffect(() => {
    if (!courseId || !user?.id) return;

    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const res = await getCourseById(courseId);
        if (res?.success && res.data) {
          const course = res.data;
          
          // Verify ownership: client instructor must own this course
          if (course.instructor?.instructorId !== user.id) {
            setUnauthorized(true);
            toast.error("Unauthorized! You can only edit your own courses.");
            return;
          }

          setCourseFormData({
            title: course.title || "",
            subTitle: course.subTitle || "",
            category: course.category || "",
            duration: course.duration || "",
            lessons: course.lessons || "",
            level: course.level || "Beginner",
            price: course.price || "",
            originalPrice: course.originalPrice || "",
            image: course.image || "",
            description: course.description || "",
            whatYoullLearn: course.whatYoullLearn?.length ? course.whatYoullLearn : [""],
            requirements: course.requirements?.length ? course.requirements : [""],
            curriculum: course.curriculum?.length 
              ? course.curriculum 
              : [{ title: "", lectures: "" }]
          });
        } else {
          toast.error("Failed to load course details.");
        }
      } catch (error) {
        console.error("Error loading course details:", error);
        toast.error("Error loading course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, user?.id]);

  // Input changes handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = await imageUpload(file);
      if (data && data.url) {
        setCourseFormData((prev) => ({ ...prev, image: data.url }));
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

  // Dynamic Lists Handlers
  const addListField = (type) => {
    setCourseFormData((prev) => {
      const listName = type === "learn" ? "whatYoullLearn" : "requirements";
      return {
        ...prev,
        [listName]: [...prev[listName], ""],
      };
    });
  };

  const removeListField = (type, index) => {
    setCourseFormData((prev) => {
      const listName = type === "learn" ? "whatYoullLearn" : "requirements";
      const updated = prev[listName].filter((_, i) => i !== index);
      return {
        ...prev,
        [listName]: updated.length ? updated : [""],
      };
    });
  };

  const handleListFieldChange = (type, index, value) => {
    setCourseFormData((prev) => {
      const listName = type === "learn" ? "whatYoullLearn" : "requirements";
      const updated = [...prev[listName]];
      updated[index] = value;
      return {
        ...prev,
        [listName]: updated,
      };
    });
  };

  // Curriculum Handlers
  const addCurriculumRow = () => {
    setCourseFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: "", lectures: "" }],
    }));
  };

  const removeCurriculumRow = (index) => {
    setCourseFormData((prev) => {
      const updated = prev.curriculum.filter((_, i) => i !== index);
      return {
        ...prev,
        curriculum: updated.length ? updated : [{ title: "", lectures: "" }],
      };
    });
  };

  const handleCurriculumChange = (index, field, value) => {
    setCourseFormData((prev) => {
      const updated = [...prev.curriculum];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        curriculum: updated,
      };
    });
  };

  // Validation before changing tab
  const validateTab = (tabIndex) => {
    if (tabIndex === 0) {
      if (!courseFormData.title.trim()) {
        toast.error("Course title is required.");
        return false;
      }
      if (!courseFormData.category.trim()) {
        toast.error("Category is required.");
        return false;
      }
    } else if (tabIndex === 1) {
      if (!courseFormData.lessons || Number(courseFormData.lessons) <= 0) {
        toast.error("Lessons count must be greater than 0.");
        return false;
      }
      if (!courseFormData.price || Number(courseFormData.price) < 0) {
        toast.error("Price is required.");
        return false;
      }
      if (uploadingImage) {
        toast.error("Please wait for the image upload to complete.");
        return false;
      }
      if (!courseFormData.image.trim()) {
        toast.error("Course thumbnail image is required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateTab(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Centralized submit handler (Only triggered when final save button is explicitly clicked)
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Validate first and second tabs before sending payload
    if (!validateTab(0) || !validateTab(1)) return;

    if (!courseFormData.description.trim()) {
      toast.error("Please add a course description.");
      setActiveStep(0);
      return;
    }

    startTransition(async () => {
      try {
        const coursePayload = {
          title: courseFormData.title,
          subTitle: courseFormData.subTitle,
          category: courseFormData.category,
          duration: courseFormData.duration,
          lessons: Number(courseFormData.lessons),
          level: courseFormData.level,
          price: Number(courseFormData.price),
          originalPrice: courseFormData.originalPrice ? Number(courseFormData.originalPrice) : Number(courseFormData.price),
          image: courseFormData.image,
          description: courseFormData.description,
          whatYoullLearn: courseFormData.whatYoullLearn.filter((item) => item.trim() !== ""),
          requirements: courseFormData.requirements.filter((item) => item.trim() !== ""),
          curriculum: courseFormData.curriculum
            .map((chap, index) => ({
              id: chap.id || String(index + 1).padStart(2, "0"),
              title: chap.title,
              lectures: Number(chap.lectures) || 0,
            }))
            .filter((chap) => chap.title.trim() !== ""),
          instructorId: user.id, // For ownership validation on the backend
        };

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/courses/${courseId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coursePayload),
        });

        const result = await response.json();
        if (result.success) {
          toast.success(result.message || "Course updated successfully");
          router.push("/dashboard/my-courses");
        } else {
          toast.error(result.message || "Failed to update course");
        }
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("An unexpected error occurred while saving updates.");
      }
    });
  };

  // Steps indicators
  const steps = [
    { title: "Basic Info", icon: FileText },
    { title: "Pricing & Details", icon: DollarSign },
    { title: "Requirements", icon: HelpCircle },
    { title: "Curriculum", icon: BookOpen }
  ];

  // Loading Screen
  if (isSessionPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <RefreshCw className="w-10 h-10 text-[var(--brand-purple)] animate-spin" />
        <p className="text-sm font-semibold text-muted">Loading course details...</p>
      </div>
    );
  }

  // Unauthorized page block
  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Unauthorized</h2>
        <p className="text-muted max-w-sm mb-6">
          You do not have permission to edit this course as you are not the registered creator.
        </p>
        <Link
          href="/dashboard/my-courses"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all cursor-pointer"
        >
          Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-6 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Edit Course
        </h1>
        <p className="text-sm text-muted mt-1 font-medium">
          Modify your course information, pricing options, requirements, or chapters.
        </p>
      </div>

      {/* Multi-Step Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-8 bg-card-bg border border-card-border rounded-3xl p-3 shadow-sm">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = activeStep > idx;
          const isActive = activeStep === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                let valid = true;
                for (let i = 0; i < idx; i++) {
                  if (!validateTab(i)) {
                    valid = false;
                    break;
                  }
                }
                if (valid) setActiveStep(idx);
              }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-2xl text-center sm:text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-500/10 text-[var(--brand-purple)]"
                  : isCompleted
                  ? "text-emerald-500"
                  : "text-muted hover:text-primary"
              }`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                isActive
                  ? "bg-[var(--brand-purple)] text-white shadow-md shadow-indigo-600/10"
                  : isCompleted
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-muted"
              }`}>
                {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4.5 w-4.5" />}
              </div>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="bg-card-bg border border-card-border rounded-[32px] shadow-sm p-6 md:p-8">
          
          {/* STEP 0: BASIC INFORMATION */}
          {activeStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-3">
                <FileText className="h-5 w-5 text-indigo-500" />
                Step 1: Basic Information
              </h2>
              
              <div className="grid gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-primary mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={courseFormData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Master React.js & Next.js from Scratch"
                    className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subTitle" className="block text-sm font-bold text-primary mb-2">
                    Subtitle / Short Summary
                  </label>
                  <input
                    type="text"
                    id="subTitle"
                    name="subTitle"
                    value={courseFormData.subTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Build production-ready web applications using App Router"
                    className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-bold text-primary mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={courseFormData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Web Development"
                      className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-bold text-primary mb-2">
                      Difficulty Level *
                    </label>
                    <div className="relative">
                      <select
                        id="level"
                        name="level"
                        value={courseFormData.level}
                        onChange={handleInputChange}
                        className="appearance-none w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 pl-4 pr-10 py-3.5 text-sm text-primary focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold cursor-pointer"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-primary mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    value={courseFormData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what the course is about, targeted audiences, and what they will gain."
                    className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all resize-y font-semibold"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: PRICING & MEDIA */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-3">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Step 2: Pricing & Details
              </h2>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-bold text-primary mb-2">
                      Course Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        value={courseFormData.price}
                        onChange={handleInputChange}
                        placeholder="99"
                        className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 pl-9 pr-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-bold text-primary mb-2">
                      Original Price ($) (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        min="0"
                        value={courseFormData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="199"
                        className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 pl-9 pr-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-bold text-primary mb-2">
                      Estimated Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={courseFormData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 24 hours or Self-paced"
                        className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 pl-9 pr-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lessons" className="block text-sm font-bold text-primary mb-2">
                      Number of Lessons *
                    </label>
                    <input
                      type="number"
                      id="lessons"
                      name="lessons"
                      min="1"
                      value={courseFormData.lessons}
                      onChange={handleInputChange}
                      placeholder="e.g., 45"
                      className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Course Thumbnail Image *
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-all relative">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                        <span className="text-xs font-bold text-gray-500">Uploading thumbnail...</span>
                      </div>
                    ) : courseFormData.image ? (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-card-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={courseFormData.image}
                            alt="Course preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="px-4 py-2 bg-white dark:bg-zinc-800 border border-card-border rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
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
                              setCourseFormData(prev => ({ ...prev, image: "" }));
                            }}
                            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-950/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full py-4">
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Upload Course Image</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          required={!courseFormData.image}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REQUIREMENTS & WHAT YOU'LL LEARN */}
          {activeStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-3">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                Step 3: Goals & Prerequisites
              </h2>

              {/* What You'll Learn */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-primary">
                    What will students learn in this course?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("learn")}
                    className="text-xs text-[var(--brand-purple)] font-black flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {courseFormData.whatYoullLearn.map((val, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleListFieldChange("learn", idx, e.target.value)}
                        placeholder="e.g., Build custom React Server Components"
                        className="flex-1 rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("learn", idx)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                        disabled={courseFormData.whatYoullLearn.length === 1 && !val}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4 pt-6 border-t border-card-border">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-primary">
                    What are the requirements/prerequisites?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("req")}
                    className="text-xs text-[var(--brand-purple)] font-black flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {courseFormData.requirements.map((val, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleListFieldChange("req", idx, e.target.value)}
                        placeholder="e.g., Basic familiarity with JavaScript ES6"
                        className="flex-1 rounded-xl border border-card-border bg-slate-50/50 dark:bg-slate-900/40 px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] focus:ring-2 focus:ring-[var(--brand-purple)]/10 outline-none transition-all font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("req", idx)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                        disabled={courseFormData.requirements.length === 1 && !val}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CURRICULUM */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-card-border pb-3">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Step 4: Course Curriculum
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-primary">
                    Curriculum Chapters & Lecture Counts
                  </label>
                  <button
                    type="button"
                    onClick={addCurriculumRow}
                    className="text-xs text-[var(--brand-purple)] font-black flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add Chapter
                  </button>
                </div>

                <div className="space-y-4">
                  {courseFormData.curriculum.map((chap, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50/50 dark:bg-slate-900/20 border border-card-border p-4 rounded-2xl relative group">
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={chap.title}
                          onChange={(e) => handleCurriculumChange(idx, "title", e.target.value)}
                          placeholder={`Chapter ${idx + 1} Title`}
                          className="w-full rounded-xl border border-card-border bg-card-bg px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] outline-none font-semibold"
                        />
                      </div>
                      
                      <div className="w-full sm:w-36 flex items-center gap-2">
                        <input
                          type="number"
                          value={chap.lectures}
                          onChange={(e) => handleCurriculumChange(idx, "lectures", e.target.value)}
                          placeholder="Lectures"
                          min="0"
                          className="w-full rounded-xl border border-card-border bg-card-bg px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-[var(--brand-purple)] outline-none text-center font-semibold"
                        />
                        <span className="text-xs font-bold text-muted hidden sm:inline">Lectures</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCurriculumRow(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer self-end sm:self-auto"
                        disabled={courseFormData.curriculum.length === 1 && !chap.title}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Control Action Strip */}
          <div className="flex gap-4 items-center justify-between border-t border-card-border mt-8 pt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeStep === 0 || isPending}
              className="px-5 py-3 rounded-2xl border border-card-border text-primary font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isPending}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-primary font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={handleSubmit}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
