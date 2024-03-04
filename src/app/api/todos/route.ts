import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { AUTH_TOKEN } from "@/constants";

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      message: "TODOS...",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
}
