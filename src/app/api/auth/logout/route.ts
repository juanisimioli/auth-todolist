import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { AUTH_TOKEN } from "@/constants";
import { getTokenFromCookie, getJwtSecret } from "@/utils/auth";

export async function POST() {
  const tokenJwt = getTokenFromCookie();

  if (!tokenJwt) {
    return NextResponse.json(
      {
        message: "Auth token is required",
      },
      { status: 401 }
    );
  }

  const jwtSecret = getJwtSecret();

  if (typeof jwtSecret !== "string") {
    return jwtSecret;
  }

  try {
    verify(tokenJwt, jwtSecret);

    const serialized = serialize(AUTH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    const response = NextResponse.json({ message: "Logout successful" });

    response.headers.set("Set-Cookie", serialized);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
}
