import { serverFetch } from "../core/server";

export const getAllCourses = async (queryParams = {}) => {
  const { page, limit, search, category, level, sort, instructorId } =
    queryParams;

  const params = new URLSearchParams();

  // Conditionally append query parameters if they are valid
  if (page !== undefined && page !== null && page !== "") {
    params.append("page", page);
  }

  if (limit !== undefined && limit !== null && limit !== "") {
    params.append("limit", limit);
  }

  if (search !== undefined && search !== null && search !== "") {
    params.append("search", search);
  }

  if (category !== undefined && category !== null && category !== "") {
    params.append("category", category);
  }

  if (level !== undefined && level !== null && level !== "") {
    params.append("level", level);
  }

  if (sort !== undefined && sort !== null && sort !== "") {
    params.append("sort", sort);
  }

  if (
    instructorId !== undefined &&
    instructorId !== null &&
    instructorId !== ""
  ) {
    params.append("instructorId", instructorId);
  }

  const queryString = params.toString();
  const path = queryString
    ? `/api/public/courses?${queryString}`
    : "/api/public/courses";

  return serverFetch(path);
};

export const getCourseById = async (id) => {
  return serverFetch(`/api/courses/${id}`);
};

export const getCoursesByInstructorClient = async (
  instructorId,
  page = 1,
  limit = 10,
  filters = {},
) => {
  const { search, category, status, sort } = filters;
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (category && category !== "all") params.append("category", category);
  if (status && status !== "all") params.append("status", status);
  if (sort) params.append("sort", sort);
  return serverFetch(
    `/api/courses/instructor/${instructorId}?${params.toString()}`,
  );
};

export const getPendingCoursesClient = async (adminId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/admin/courses/pending`, {
    headers: {
      "x-user-id": adminId,
    },
  });
  return res.json();
};

export const toggleCourseStatus = async (
  courseId,
  actionType,
  instructorId,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/courses/${courseId}/toggle-status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-instructor-id": instructorId,
    },
    body: JSON.stringify({ action: actionType }),
  });
  return res.json();
};

export const approveOrRejectCourse = async (courseId, actionType, adminId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/admin/courses/${courseId}/approval`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": adminId,
    },
    body: JSON.stringify({ action: actionType }),
  });
  return res.json();
};

export const getAllAdminCoursesClient = async (
  adminId,
  page = 1,
  limit = 10,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
  const res = await fetch(
    `${baseUrl}/api/admin/courses?page=${page}&limit=${limit}`,
    {
      headers: {
        "x-user-id": adminId,
      },
    },
  );
  return res.json();
};
