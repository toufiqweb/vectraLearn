import { protectedServerFetch, serverFetch } from "../core/server";

export const getUserByEmail = async (email, token) => {
  return protectedServerFetch(`/api/users?email=${email}`, token);
};

export const searchDonors = async (queryParams) => {
  return serverFetch(`/api/courses/search?${queryParams}`);
};
