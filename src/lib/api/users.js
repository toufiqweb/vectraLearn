import { protectedServerFetch, serverFetch } from "../core/server";

export const getUserByEmail = async (email, token) => {
  return protectedServerFetch(`/api/users?email=${email}`, token);
};

export const searchDonors = async (queryParams) => {
  return serverFetch(`/api/courses/search?${queryParams}`);
};

// ── Admin User Management API ─────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/**
 * Fetch all users for the admin panel with search, role filter, and pagination.
 * @param {string} adminId - The logged-in admin's user ID (sent as x-user-id header)
 * @param {object} params  - { page, limit, search, role }
 */
export const getAllUsersAdmin = async (adminId, params = {}) => {
  const { page = 1, limit = 10, search = "", role = "", blocked = "" } = params;

  const query = new URLSearchParams();
  query.append("page", page);
  query.append("limit", limit);
  if (search) query.append("search", search);
  if (role && role !== "all") query.append("role", role);
  if (blocked !== "") query.append("blocked", blocked); // "true" | "false"

  const res = await fetch(`${BASE_URL}/api/admin/users?${query.toString()}`, {
    headers: { "x-user-id": adminId },
  });
  return res.json();
};

/**
 * Change a user's role.
 * @param {string} adminId  - The logged-in admin's user ID
 * @param {string} userId   - Target user's ID
 * @param {string} newRole  - 'student' | 'instructor' | 'admin'
 */
export const updateUserRoleAdmin = async (adminId, userId, newRole) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": adminId,
    },
    body: JSON.stringify({ role: newRole }),
  });
  return res.json();
};

/**
 * Toggle a user's block/unblock status.
 * @param {string} adminId - The logged-in admin's user ID
 * @param {string} userId  - Target user's ID
 */
export const toggleUserBlockAdmin = async (adminId, userId) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
    method: "PATCH",
    headers: { "x-user-id": adminId },
  });
  return res.json();
};
