"use server";
import db from "@/libs/db";
import { userIdFromCookies, validatePermission } from "@/utils/auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteTask(prev: unknown, id: string) {
  let deletedNote;

  try {
    const res = await userIdFromCookies();

    if (!res.success) {
      return {
        errorMessage: res.message,
      };
    }

    const userId = res.data as string;

    const validationResponse = await validatePermission(
      Number(userId),
      Number(id)
    );

    if (!validationResponse.success) {
      return { errorMessage: validationResponse.message };
    }

    deletedNote = await db.note.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { errorMessage: "Note not found" };
      }
    }
    return { errorMessage: "Internal Server Error" };
  }

  if (deletedNote) revalidatePath("/dashboard");
}
