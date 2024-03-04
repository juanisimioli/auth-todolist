import { NextResponse, NextRequest } from "next/server";
import db from "@/libs/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { AUTH_TOKEN, DAYS_30 } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const userFoundByEmail = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!userFoundByEmail) {
      return NextResponse.json(
        { message: "Email is not registered" },
        {
          status: 400,
        }
      );
    }

    const isCorrectPassword = await bcrypt.compare(
      data.password,
      userFoundByEmail.password
    );

    if (isCorrectPassword) {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in the environment variables");
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

      const token = jwt.sign(
        {
          username: userFoundByEmail.username,
          email: userFoundByEmail.email,
          id: userFoundByEmail.id,
          role: userFoundByEmail.role,
          exp: Math.floor(Date.now() / 1000) + DAYS_30,
        },
        jwtSecret
      );

      const serialized = serialize(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: DAYS_30,
        path: "/",
      });

      const response: NextResponse = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );

      response.headers.set("Set-Cookie", serialized);

      return response;
    }

    return NextResponse.json(
      { message: "Login failed: invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
