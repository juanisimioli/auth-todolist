import { redirect } from "next/navigation";
import { userIdFromCookies } from "@/utils/auth";
import { RegisterForm } from "@/components/Auth/RegisterForm/RegisterForm";

const RegisterPage = async () => {
  const res = await userIdFromCookies();
  if (res.success) redirect("/dashboard");
  return <RegisterForm />;
};

export default RegisterPage;
