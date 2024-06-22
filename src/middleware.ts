import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    const c = cookies();
    const allCookies = c
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    /**
     * If next-auth.session-token is not present, return 401
     * (!) IMPORTANT NOTE HERE:
     * next-auth likes to use different cookie name for prod (https) so make sure to set a consistent cookie name in your next-auth configuration file (see docs)
     */
    if (!c.get("next-auth.session-token")?.value?.trim()) {
      return NextResponse.json(
        { message: "Unauthorized, log in first" },
        { status: 401 }
      );
    }

    const reqHeaders = {
      "Content-Type": "application/json",
      Cookie: allCookies,
    };

    /**
     * Send a request to /api/auth/session to get the user session
     * process.LOOPBACK_URL can be set as localhost, or your website url
     */
    const url = new URL(`/api/auth/session`, request.nextUrl.origin);
    const response = await fetch(url.href, {
      headers: reqHeaders,
      cache: "no-store",
    });

    if (response.ok) {
      const newHeaders = new Headers(request.headers);
      const session = await response.json();
      if (typeof session === "object") {
        const id = session?.user?.id;
        newHeaders.set("x-middleware-userid", id);
      }

      return NextResponse.next({
        request: {
          headers: newHeaders,
        },
      });
    }
  }
}
