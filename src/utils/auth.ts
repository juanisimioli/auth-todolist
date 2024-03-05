import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/constants";
import db from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";

export function getTokenFromCookie(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_TOKEN);

  return token?.value;
}

export function getJwtSecret(): string | NextResponse {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables");
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  return jwtSecret;
}

export function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function getUserIdFromToken(
  token: string
): Promise<number | NextResponse> {
  const jwtSecret = getJwtSecret();

  if (typeof jwtSecret !== "string") {
    return jwtSecret;
  }

  try {
    const decodedToken = (await jwt.verify(token, jwtSecret)) as JwtPayload;
    const id = decodedToken.id;

    if (id === undefined) {
      throw new Error("Unable to retrieve user ID from token");
    }

    return Number(id);
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Internal Server Error. Error decoding token.");
  }
}

export async function userIdFromCookies(): Promise<number | NextResponse> {
  const token = getTokenFromCookie();

  if (typeof token !== "string") {
    return NextResponse.json(
      {
        message: "Unable to retrieve user ID from token",
      },
      { status: 401 }
    );
  }

  const userId = await getUserIdFromToken(token);

  return userId;
}

interface ValidationResponse {
  success: boolean;
  message?: string;
  status?: number;
}

export async function validatePermission(
  userId: number,
  noteId: number
): Promise<ValidationResponse> {
  const note = await db.note.findFirst({
    where: { id: noteId },
  });

  if (!note) {
    return { success: false, message: "Note not found", status: 404 };
  }

  if (note.userId !== userId) {
    return {
      success: false,
      message: "Not allowed to perform this action",
      status: 403,
    };
  }

  return { success: true };
}
