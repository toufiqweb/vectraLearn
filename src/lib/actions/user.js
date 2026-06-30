"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const updateUserProfileAction = async (payload, userId) => {
  try {
    return await serverMutation(
      "/api/user/profile",
      payload,
      "PUT",
      { "x-user-id": userId }
    );
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUserRoleAdmin = async (adminId, userId, newRole) => {
  try {
    return await serverMutation(
      `/api/admin/users/${userId}/role`,
      { role: newRole },
      "PATCH",
      { "x-user-id": adminId }
    );
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const toggleUserBlockAdmin = async (adminId, userId) => {
  try {
    return await serverMutation(
      `/api/admin/users/${userId}/block`,
      {},
      "PATCH",
      { "x-user-id": adminId }
    );
  } catch (error) {
    return { success: false, message: error.message };
  }
};
