import { redirect } from "next/navigation";
import { userIdFromCookies } from "@/utils/auth";
import { LoginForm } from "@/components/Auth/LoginForm/LoginForm";

const LoginPage = async () => {
  const res = await userIdFromCookies();
  if (res.success) redirect("/dashboard");
  return <LoginForm />;
};

export default LoginPage;
