import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getTokenFromCookie, getJwtSecret, encodeSecret } from "./utils/auth";

/**
 * Middleware for verifying JWT token for authentication.
 */
export async function middleware(request: Request): Promise<NextResponse> {
  const tokenJwt = getTokenFromCookie();

  if (!tokenJwt) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl.toString());
  }

  const jwtSecret = getJwtSecret();

  if (typeof jwtSecret !== "string") {
    return jwtSecret;
  }

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
