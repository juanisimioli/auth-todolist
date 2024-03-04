"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface Inputs extends RegisterData {
  confirmPassword: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { push } = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { username, email, password } = formData;

    const registerData: RegisterData = {
      username,
      email,
      password,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    const resJSON = await res.json();

    if (res.ok) {
      push("/login");
    } else {
      console.log(resJSON);
    }
  };

  console.log(errors);

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
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        {...register("username", {
          required: { value: true, message: "Username is required " },
        })}
        placeholder="John Smith"
        autoFocus
      />
      {errors.username && <span>{errors.username?.message}</span>}

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
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        {...register("confirmPassword", {
          required: { value: true, message: "Must provide confirm password" },
        })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
