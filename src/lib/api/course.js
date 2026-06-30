"use server";

import { serverFetch, protectedFetch } from "../core/server";

export const getAllCourses = async (queryParams = {}) => {
  const { page, limit, search, category, level, sort, instructorId } = queryParams;
  const params = new URLSearchParams();

  if (page !== undefined && page !== null && page !== "") params.append("page", page);
  if (limit !== undefined && limit !== null && limit !== "") params.append("limit", limit);
  if (search !== undefined && search !== null && search !== "") params.append("search", search);
  if (category !== undefined && category !== null && category !== "") params.append("category", category);
  if (level !== undefined && level !== null && level !== "") params.append("level", level);
  if (sort !== undefined && sort !== null && sort !== "") params.append("sort", sort);
  if (instructorId !== undefined && instructorId !== null && instructorId !== "") params.append("instructorId", instructorId);

  const queryString = params.toString();
  const path = queryString ? `/api/public/courses?${queryString}` : "/api/public/courses";
  return serverFetch(path);
};

export const getCourseById = async (id) => {
  return serverFetch(`/api/courses/${id}`);
};

export const getCoursesByInstructorClient = async (instructorId, page = 1, limit = 10, queryParams = {}) => {
  const { search, category, status, sort } = queryParams;
  const params = new URLSearchParams();
  
  params.append("page", page);
  params.append("limit", limit);
  
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (sort) params.append("sort", sort);

  const queryString = params.toString();

  return protectedFetch(
    `/api/courses/instructor/${instructorId}?${queryString}`,
    { "x-user-id": instructorId }
  );
};

export const getPendingCoursesClient = async (adminId) => {
  return protectedFetch("/api/admin/courses/pending", { "x-user-id": adminId });
};

export const getAllAdminCoursesClient = async (adminId, page = 1, limit = 10) => {
  return protectedFetch(
    `/api/admin/courses?page=${page}&limit=${limit}`,
    { "x-user-id": adminId }
  );
};

export const getEnrolledCoursesClient = async (studentId, page = 1, limit = 6) => {
  return protectedFetch(
    `/api/student/my-learning?page=${page}&limit=${limit}`,
    { "x-user-id": studentId }
  );
};
