"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const deleteReviewAdminClient = async (adminId, reviewId) => {
  try {
    const response = await serverMutation(
      `/api/admin/reviews/${reviewId}`,
      {},
      "DELETE",
      { "x-user-id": adminId }
    );
    revalidatePath("/dashboard/manage-review");
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const rateCourseAction = async (courseId, rating, reviewText, userId) => {
  try {
    const response = await serverMutation(
      `/api/courses/review`,
      { courseId, ratingValue: rating, reviewMessage: reviewText },
      "POST",
      { "x-user-id": userId }
    );
    return response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
