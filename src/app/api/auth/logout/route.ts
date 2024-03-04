import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { AUTH_TOKEN } from "@/constants";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN);

  if (!token) {
    return NextResponse.json(
      {
        message: "Auth token is required",
      },
      { status: 401 }
    );
  }

  try {
    verify(token.value, process.env.JWT_SECRET as string);

    const serialized = serialize(AUTH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    const response: NextResponse = NextResponse.json({ status: 204 });

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
