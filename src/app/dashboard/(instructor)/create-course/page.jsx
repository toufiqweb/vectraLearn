"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  BookOpen, Plus, Trash2, ArrowRight, ArrowLeft, 
  Check, Save, DollarSign, Layers, FileText, 
  HelpCircle, Settings, Award, Clock, RefreshCw
} from "lucide-react";
import { createCourse } from "@/lib/actions/courses";
import { imageUpload } from "@/lib/imageUpload";

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
  const [curriculum, setCurriculum] = useState([
    { title: "", lectures: "" }
  ]);

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
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        whatYoullLearn: whatYoullLearn.filter(item => item.trim() !== ""),
        requirements: requirements.filter(item => item.trim() !== ""),
        curriculum: curriculum
          .map((chap, index) => ({
            id: String(index + 1).padStart(2, "0"),
            title: chap.title,
            lectures: Number(chap.lectures) || 0
          }))
          .filter(chap => chap.title.trim() !== "")
      };

      const result = await createCourse(coursePayload);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/my-courses");
      } else {
        toast.error(result.error);
      }
    });
  };

  // Steps indicator names
  const steps = [
    { title: "Basic Info", icon: FileText },
    { title: "Pricing & Media", icon: DollarSign },
    { title: "Requirements", icon: HelpCircle },
    { title: "Curriculum", icon: BookOpen }
  ];

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide detailed information to set up your course. It will go live once approved by the administrators.
        </p>
      </div>

      {/* Multi-Step Indicator Bar */}
      <div className="grid grid-cols-4 gap-2 mb-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm">
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
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl text-center sm:text-left transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"
              }`}>
                {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4.5 w-4.5" />}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-gray-200 dark:border-zinc-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
          
          {/* STEP 0: BASIC INFORMATION */}
          {activeTab === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Step 1: Basic Information
              </h2>
              
              <div className="grid gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Master React.js & Next.js from Scratch"
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subTitle" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle / Short Summary
                  </label>
                  <input
                    type="text"
                    id="subTitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Build production-ready web applications using App Router"
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Web Development"
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what the course is about, targeted audiences, and what they will gain."
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-y"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: PRICING & MEDIA */}
          {activeTab === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Step 2: Pricing & Details
              </h2>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Course Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="99"
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 pl-9 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Original Price ($) (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <input
                        type="number"
                        id="originalPrice"
                        name="originalPrice"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="199"
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 pl-9 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Duration
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 24 hours or Self-paced"
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 pl-9 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lessons" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Thumbnail Image *
                  </label>
                  <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-zinc-800/40 hover:bg-gray-100/50 dark:hover:bg-zinc-800/60 transition-all relative">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                        <span className="text-xs font-bold text-gray-500">Uploading thumbnail...</span>
                      </div>
                    ) : formData.image ? (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.image}
                            alt="Course preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
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
                              setFormData(prev => ({ ...prev, image: "" }));
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
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                Step 3: Goals & Prerequisites
              </h2>

              {/* What You'll Learn */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    What will students learn in this course?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("learn")}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {whatYoullLearn.map((val, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleListFieldChange("learn", idx, e.target.value)}
                        placeholder={`e.g., Build custom React Server Components`}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("learn", idx)}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
                        disabled={whatYoullLearn.length === 1 && !val}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    What are the requirements/prerequisites?
                  </label>
                  <button
                    type="button"
                    onClick={() => addListField("req")}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {requirements.map((val, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleListFieldChange("req", idx, e.target.value)}
                        placeholder={`e.g., Decent understanding of modern Javascript ES6+`}
                        className="flex-1 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeListField("req", idx)}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
                        disabled={requirements.length === 1 && !val}
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
          {activeTab === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  Step 4: Course Curriculum Chapters
                </h2>
                <button
                  type="button"
                  onClick={addCurriculumRow}
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" /> Add Chapter
                </button>
              </div>

              <div className="space-y-4">
                {curriculum.map((chapter, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start bg-gray-50/60 dark:bg-zinc-800/20 p-4 border border-gray-150 dark:border-zinc-800/50 rounded-2xl relative">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    
                    <div className="flex-1 grid md:grid-cols-3 gap-4 w-full">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Chapter/Module Title
                        </label>
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) => handleCurriculumChange(idx, "title", e.target.value)}
                          placeholder="e.g., Introduction to the framework"
                          className="w-full rounded-xl border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Number of Lectures
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={chapter.lectures}
                          onChange={(e) => handleCurriculumChange(idx, "lectures", e.target.value)}
                          placeholder="e.g., 5"
                          className="w-full rounded-xl border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCurriculumRow(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all self-end sm:self-center cursor-pointer"
                      disabled={curriculum.length === 1 && !chapter.title}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center">
          {activeTab > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-850/50 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98]"
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] shadow-md shadow-blue-500/10"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <div className="h-4.5 w-4.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" /> Publish Course
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
