"use server";

import { protectedFetch } from "../core/server";

export const getWishlist = async (userId, page = 1, limit = 9) => {
  return protectedFetch(
    `/api/student/wishlist?page=${page}&limit=${limit}`,
    { "x-user-id": userId }
  );
};

export const getWishlistIds = async (userId) => {
  return protectedFetch(
    `/api/student/wishlist/ids`,
    { "x-user-id": userId }
  );
};
