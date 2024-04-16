"use server";
import db from "@/libs/db";
import { revalidatePath } from "next/cache";
import { userIdFromCookies } from "@/utils/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const schema = z.object({
  title: z.string().min(1, "Provide at 1 character for title"),
  content: z.string().min(1, "Provide at 1 character for content"),
});

export async function createTask(prevState: unknown, formData: FormData) {
  let newNote;

  try {
    const res = await userIdFromCookies();

    if (!res.success) {
      return {
        errorMessage: res.message,
      };
    }

    const userId = res.data;

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const validatedFields = schema.safeParse({
      title,
      content,
    });

    if (!validatedFields.success) {
      return {
        errorMessage: validatedFields.error?.errors[0].message,
      };
    }

    newNote = await db.note.create({
      data: {
        title,
        content,
        userId: Number(userId),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { errorMessage: "Note not found" };
      }
    }
    return { errorMessage: "Internal Server Error" };
  }

  if (newNote) {
    revalidatePath("/dashboard");
    return { success: true };
  }
}
