"use server";

import { revalidatePath } from "next/cache";
import { getUserServerSession } from "./getUserServerSession";
import { serverMutation } from "../core/server";

export const createCourse = async (courseData) => {
  try {
    const user = await getUserServerSession();
    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in." };
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      return { success: false, error: "Unauthorized: Only instructors can create courses." };
    }

    const {
      title, subTitle, category, duration, lessons, level, price, originalPrice,
      image, description, whatYoullLearn, requirements, curriculum,
    } = courseData;

    if (!title || !category || !lessons || !price || !image || !description) {
      return { success: false, error: "Please fill out all required fields." };
    }

    const finalizedCourse = {
      title: String(title),
      subTitle: String(subTitle || ""),
      category: String(category),
      duration: String(duration || "Self-paced"),
      lessons: Number(lessons),
      level: String(level || "Beginner"),
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      image: String(image),
      description: String(description),
      whatYoullLearn: Array.isArray(whatYoullLearn) ? whatYoullLearn.filter(Boolean) : [],
      requirements: Array.isArray(requirements) ? requirements.filter(Boolean) : [],
      instructor: {
        instructorId: String(user.id),
        name: String(user.name),
        role: String(user.role),
        email: String(user.email),
      },
      curriculum: Array.isArray(curriculum)
        ? curriculum.map((chap, idx) => ({
            id: chap.id || String(idx + 1).padStart(2, "0"),
            title: String(chap.title || ""),
            lectures: Number(chap.lectures || 0),
          })).filter(chap => chap.title !== "")
        : [],
    };

    const response = await serverMutation("/api/courses", finalizedCourse, "POST");

    revalidatePath("/dashboard/my-courses");
    revalidatePath("/dashboard/pending-courses");
    revalidatePath("/courses");

    return response;
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
};

export const deleteCourse = async (courseId, instructorId) => {
  try {
    const user = await getUserServerSession();
    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in." };
    }

    const response = await serverMutation(
      `/api/courses/${courseId}`,
      { instructorId: instructorId || user.id, userRole: user.role },
      "DELETE"
    );

    revalidatePath("/dashboard/my-courses");
    revalidatePath("/courses");

    return response;
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
};

export const toggleCourseStatus = async (courseId, actionType, instructorId) => {
  try {
    const response = await serverMutation(
      `/api/courses/${courseId}/toggle-status`,
      { action: actionType },
      "PATCH",
      { "x-instructor-id": instructorId }
    );
    revalidatePath("/dashboard/my-courses");
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const approveOrRejectCourse = async (courseId, actionType, adminId) => {
  try {
    const response = await serverMutation(
      `/api/admin/courses/${courseId}/approval`,
      { action: actionType },
      "PATCH",
      { "x-user-id": adminId }
    );
    revalidatePath("/dashboard/pending-courses");
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCourseAction = async (courseId, coursePayload) => {
  try {
    const response = await serverMutation(
      `/api/courses/${courseId}`,
      coursePayload,
      "PATCH"
    );
    revalidatePath("/dashboard/my-courses");
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
