"use server";

import { serverMutation } from "../core/server";

export const toggleWishlistItem = async (courseId, userId) => {
  try {
    return await serverMutation(
      `/api/student/wishlist/toggle`,
      { courseId },
      "POST",
      { "x-user-id": userId }
    );
  } catch (error) {
    return { success: false, message: error.message };
  }
};
