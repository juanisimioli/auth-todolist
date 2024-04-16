"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "@/libs/db";
import { AUTH_TOKEN, DAYS_30 } from "@/constants";

const schema = z.object({
  email: z.string().email("This is not a valid email."),
  password: z.string().min(5, "Provide at least 5 characters for password"),
});

export async function loginAction(prevState: unknown, formData: FormData) {
  let token;

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = schema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return {
        errorMessage: validatedFields.error?.errors[0].message,
      };
    }

    const userFoundByEmail = await db.user.findUnique({
      where: { email },
    });

    if (!userFoundByEmail) {
      return { errorMessage: "Email is not registered. Please register." };
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      userFoundByEmail.password
    );

    if (!isCorrectPassword) {
      return { errorMessage: "Incorrect Password" };
    }

    if (isCorrectPassword) {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in the environment variables");
        return { errorMessage: "Internal Server Error" };
      }

      token = jwt.sign(
        {
          username: userFoundByEmail.username,
          email: userFoundByEmail.email,
          id: userFoundByEmail.id,
          role: userFoundByEmail.role,
          exp: Math.floor(Date.now() / 1000) + DAYS_30,
        },
        jwtSecret
      );

      cookies().set(AUTH_TOKEN, token);
    }
  } catch (e) {
    console.error(e);
    return { errorMessage: "Could not log in user." };
  }

  if (token) redirect("/dashboard");
}
