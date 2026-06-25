import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  // https://skill-sphere-ecru-ten.vercel.app
  // baseURL: "http://localhost:3000",
  plugins: [jwtClient()],
});

export const { signIn, signUp, useSession } = authClient;
