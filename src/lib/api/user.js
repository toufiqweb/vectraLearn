"use server";

import { serverFetch, protectedFetch } from "../core/server";

export const getUserByEmail = async (email) => {
  return protectedFetch(`/api/users?email=${email}`);
};

export const searchDonors = async (queryParams) => {
  return serverFetch(`/api/courses/search?${queryParams}`);
};

export const getAllUsers = async () => {
  return serverFetch(`/api/users`);
};

export const getAllUsersAdmin = async (adminId, params = {}) => {
  const { page = 1, limit = 10, search = "", role = "", blocked = "" } = params;

  const query = new URLSearchParams();
  query.append("page", page);
  query.append("limit", limit);
  if (search) query.append("search", search);
  if (role && role !== "all") query.append("role", role);
  if (blocked !== "") query.append("blocked", blocked);

  return protectedFetch(`/api/admin/users?${query.toString()}`, { "x-user-id": adminId });
};

export const getInstructorEnrolledStudentsClient = async (instructorId, page = 1, limit = 10) => {
  return protectedFetch(
    `/api/instructor/course-students?page=${page}&limit=${limit}`,
    { "x-user-id": instructorId }
  );
};
