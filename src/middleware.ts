import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // 🔥 If admin subdomain
  if (host.startsWith("admin.")) {
    const url = request.nextUrl.clone();

    // prevent infinite loop
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}