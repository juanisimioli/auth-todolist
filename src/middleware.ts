import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_TOKEN } from "./constants";

/**
 * Middleware for verifying JWT token for authentication.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const tokenJwt = request.cookies.get(AUTH_TOKEN);
  if (!tokenJwt) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables");
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  try {
    await jwtVerify(tokenJwt.value, new TextEncoder().encode(jwtSecret));
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
