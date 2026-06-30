"use server";

import { protectedFetch } from "../core/server";

export const getPlatformAnalyticsClient = async (adminId) => {
  return protectedFetch("/api/admin/platform-analytics", { "x-user-id": adminId });
};

export const getInstructorAnalyticsClient = async (instructorId) => {
  return protectedFetch("/api/instructor/analytics", { "x-user-id": instructorId });
};
