import { Note as NoteType } from "@prisma/client";
import { cookies } from "next/headers";
import db from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AUTH_TOKEN } from "@/constants";

type ValidationResponse = {
  success: boolean;
  data?: string;
  message?: string;
  status?: number;
};

/**
 * Retrieve the authentication token from cookies.
 */
export function getTokenFromCookie(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_TOKEN);

  return token?.value;
}

/**
 * Retrieve the JWT secret from environment variables
 */
export function getJwtSecret(): ValidationResponse {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables");
    return { success: false, message: "Internal Server Error" };
  }

  return { success: true, data: jwtSecret };
}

/**
 * Encode a string secret into Uint8Array
 */
export function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/**
 * Get the user ID from a JWT token
 */
export async function getUserIdFromToken(
  token: string
): Promise<ValidationResponse> {
  const res = getJwtSecret();

  if (!res.success)
    return {
      success: false,
      message: "Internal Server Error",
    };

  const jwtSecret = res.data as string;

  try {
    const decodedToken = (await jwt.verify(token, jwtSecret)) as JwtPayload;
    const userId = decodedToken.id;
    if (userId === undefined) {
      return {
        success: false,
        message: "Unable to retrieve user ID from token",
      };
    }
    return { success: true, data: userId };
  } catch (error) {
    console.error("Error decoding token:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

/**
 * Get the user ID from cookies
 */
export async function userIdFromCookies(): Promise<ValidationResponse> {
  const token = getTokenFromCookie();

  if (typeof token !== "string" || token === "")
    return {
      success: false,
      message: "Unable to retrieve user ID from token",
    };

  const userId = await getUserIdFromToken(token);

  return userId;
}

/**
 * Validate permission based on user ID and note ID
 */
export async function validatePermission(
  userId: number,
  noteId: number
): Promise<ValidationResponse> {
  try {
    const note: NoteType | null = await db.note.findFirst({
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
  } catch (e) {
    return {
      success: false,
      message: "Internal server Error",
      status: 500,
    };
  }
}
