import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    const loginUrl = new URL("/signin", request.url);

    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/checkout", "/dashboard"],
};
