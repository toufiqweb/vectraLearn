import { redirect } from "next/navigation";
import { getTokenServer } from "./BetterAuthToken";

// Server-side fetch utilities (NOT Server Actions - do not use "use server" here)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
  const token = await getTokenServer();
  const header = token ? { authorization: `Bearer ${token}` } : {};
  return header;
};

export const serverMutation = async (path, data, method = "POST", customHeaders = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
      ...customHeaders,
    },
    body: JSON.stringify(data),
  });
  return handleStatus(res);
};

export const serverFetch = async (path, customHeaders = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...customHeaders,
    },
  });
  return handleStatus(res);
};

export const protectedFetch = async (path, customHeaders = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...(await authHeader()),
      ...customHeaders,
    },
  });
  return handleStatus(res);
};

const handleStatus = async (res) => {
  if (res.status === 401) {
    redirect("/signin");
  } else if (res.status === 403) {
    redirect("/forbidden");
  }
  
  if (!res.ok) {
    let message = `Server error (${res.status})`;
    try {
      const body = await res.json();
      message = body?.message || body?.msg || message;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
};
