"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/constants";

export async function logoutAction() {
  cookies().set(AUTH_TOKEN, "");
  redirect("/login");
}
