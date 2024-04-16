import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getTokenFromCookie, getJwtSecret, encodeSecret } from "./utils/auth";

/**
 * Middleware for verifying JWT tokens for authentication.
 */
export async function middleware(request: Request): Promise<NextResponse> {
  const tokenJwt = getTokenFromCookie();

  if (!tokenJwt) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl.toString());
  }

  const res = getJwtSecret();

  if (!res.success) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const jwtSecret = res.data as string;

  try {
    await jwtVerify(tokenJwt, encodeSecret(jwtSecret));
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
