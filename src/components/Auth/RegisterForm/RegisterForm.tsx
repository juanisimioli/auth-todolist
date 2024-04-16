"use client";
import { useFormState } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/actions/auth/registerAction";
import Input from "@/components/Input/Input";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import Divider from "@/components/Divider/Divider";

export const RegisterForm = () => {
  const [error, action] = useFormState(registerAction, { errorMessage: "" });

  return (
    <div className="h-screen flex flex-col items-center justify-center mx-4">
      <div className="w-full max-w-72">
        <form action={action} className="flex flex-col">
          <Input
            label="Username"
            name="username"
            type="text"
            required
            autoFocus
            color="violet"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            required
            color="violet"
            autocomplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            color="violet"
            autocomplete="new-password"
          />
          <Input
            label="Confirm Password"
            name="confirm-password"
            type="password"
            required
            color="violet"
            autocomplete="confirm-password"
          />
          <p className="text-red-500 text-xs my-4">{error?.errorMessage}</p>
          <SubmitButton
            color="violet"
            label="Register"
            labelPending="Registering"
          />
        </form>

        <Divider />

        <Link
          className="text-center inline-block px-4 py-1 w-full rounded-md cursor-pointer font-bold transition duration-300 border border-violet-500 text-violet-500 hover:text-violet-600 hover:border-violet-600"
          href="/login"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};
