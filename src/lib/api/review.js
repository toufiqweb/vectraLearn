"use server";

import { serverFetch, protectedFetch } from "../core/server";

export const getCourseReviews = async (id) => {
  return serverFetch(`/api/courses/${id}/reviews`);
};

export const getAllReviewsForModerationClient = async (adminId, page = 1, limit = 10) => {
  return protectedFetch(
    `/api/admin/reviews?page=${page}&limit=${limit}`,
    { "x-user-id": adminId }
  );
};
