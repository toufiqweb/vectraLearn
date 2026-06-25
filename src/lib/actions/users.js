import { headers } from "next/headers";
import { auth } from "../auth";
import { getTokenServer } from "../core/BetterAuthToken";
import { serverMutation } from "../core/server";
import { revalidatePath } from "next/cache";

export const updateUserProfile = async (formData) => {
  // Get the current session to securely identify the user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const token = await getTokenServer();
  if (!token) {
    throw new Error("Unauthorized: No token found.");
  }
  if (!session?.user?.email) {
    throw new Error("Unauthorized: No active session found.");
  }

  // Call the Express backend PATCH /api/users/profile
  const data = await serverMutation(
    "/api/users/profile",
    {
      email: session.user.email, // Backend reads this to find the user
      ...formData, // name, image, bloodGroup, district, upazila
    },
    "PATCH",
    token,
  );

  // Revalidate the profile page so the Server Component re-fetches fresh data
  revalidatePath("/dashboard/profile");

  return data;
};
