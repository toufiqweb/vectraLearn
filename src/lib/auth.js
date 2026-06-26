import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  // REQUIRED: Uncomment secret to ensure sessions are signed with a stable key.
  // Without this, every cold start or redeploy invalidates all existing sessions.
  secret: process.env.BETTER_AUTH_SECRET,

  // REQUIRED: List all allowed origins for cross-origin auth requests.
  // Add your deployed Vercel client domain here via BETTER_AUTH_URL env var.
  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL,
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
      },
      status: {
        type: "string",
        defaultValue: "active", // active, blocked
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30,
    },
  },
  plugins: [jwt()],
});
