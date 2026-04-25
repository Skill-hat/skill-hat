import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host.startsWith("admin.")) {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  return NextResponse.next();
}