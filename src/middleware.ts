import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  if (host.startsWith("admin.")) {
    // If already inside /admin, allow
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin/login"; // 👈 IMPORTANT
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};