"use server";
import db from "@/libs/db";
import { revalidatePath } from "next/cache";
import { userIdFromCookies, validatePermission } from "@/utils/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const schema = z.object({
  title: z.string().min(1, "Provide at 1 character for title"),
  content: z.string().min(1, "Provide at 1 character for content"),
  noteId: z.string(),
});

export async function updateTask(prevState: unknown, formData: FormData) {
  let updatedNote;

  try {
    const res = await userIdFromCookies();

    if (!res.success) {
      return {
        errorMessage: res.message,
      };
    }

    const userId = Number(res.data);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const noteId = formData.get("id") as string;

    const validatedFields = schema.safeParse({
      title,
      content,
      noteId,
    });

    if (!validatedFields.success) {
      return {
        errorMessage: validatedFields.error?.errors[0].message,
      };
    }

    const validationResponse = await validatePermission(userId, Number(noteId));

    if (!validationResponse.success) {
      return { errorMessage: validationResponse.message };
    }

    updatedNote = await db.note.update({
      where: { id: Number(noteId) },
      data: {
        title,
        content,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { errorMessage: "Note not found" };
      }
      return { errorMessage: "Internal Server Error" };
    }
  }

  if (updatedNote) {
    revalidatePath("/dashboard");
    return { success: true };
  }
}
