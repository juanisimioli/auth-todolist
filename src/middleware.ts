import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getTokenFromCookie, getJwtSecret, encodeSecret } from "./utils/auth";

export const internalStatServer = async (event: any) =>
  await fetch(`${process.env.API}${process.env.ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    cache: "no-store",
  });

/**
 * Middleware for verifying JWT tokens for authentication.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const tokenJwt = getTokenFromCookie();

  const pathname = request.nextUrl.pathname;

  const body = {
    section: "test juani 2",
    ip: request.ip,
    country: request.geo?.country,
    state: `${request.geo?.region}-${request.geo?.city}`,
  };

  try {
    console.log("try", pathname);
    const res = await internalStatServer(body);
    console.log("RES!!!", res.status, res);
  } catch (error) {
    console.error("loginInfo middleware ERROR", error);
  } finally {
    console.log("FINALLY");
  }

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
