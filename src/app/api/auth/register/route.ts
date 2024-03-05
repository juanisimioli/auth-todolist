import { NextResponse } from "next/server";
import db from "@/libs/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const usernameFound = await db.user.findUnique({
      where: { username: data.username },
    });

    if (usernameFound) {
      return NextResponse.json(
        { message: "Username already exists" },
        {
          status: 400,
        }
      );
    }

    const emailFound = await db.user.findUnique({
      where: { email: data.email },
    });

    if (emailFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await db.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
