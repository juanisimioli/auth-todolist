"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import db from "@/libs/db";
import bcrypt from "bcrypt";

const schema = z
  .object({
    username: z.string(),
    email: z.string().email("This is not a valid email."),
    password: z.string().min(5, "Provide at least 5 characters for password"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerAction(prevState: unknown, formData: FormData) {
  let userCreated;
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    const validatedFields = schema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return {
        errorMessage: validatedFields.error?.errors[0].message,
      };
    }

    const usernameFound = await db.user.findUnique({
      where: { username },
    });

    if (usernameFound) {
      return { errorMessage: "Username already exists" };
    }

    const emailFound = await db.user.findUnique({
      where: { email },
    });

    if (emailFound) {
      return { errorMessage: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userCreated = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });
  } catch (e) {
    console.error(e);
    return { errorMessage: "Could not register user" };
  }

  if (userCreated) redirect("/login");
}
