"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const { push } = useRouter();

  const onSubmit: SubmitHandler<LoginData> = async (formData) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const resJSON = await res.json();

    if (res.ok) {
      push("/dashboard");
    } else {
      console.log(resJSON);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "30%",
        gap: 50,
      }}
    >
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        {...register("email", {
          required: { value: true, message: "Must provide email" },
        })}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        {...register("password", {
          required: { value: true, message: "Must provide password" },
        })}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginPage;
