"use client";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { push } = useRouter();

  const handleGet = async () => {
    const data = await fetch("/api/todos");
    const todos = await data.json();

    console.log(todos);
  };

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleGet}>get</button>
      <br></br>
      <button onClick={handleLogOut}>logout</button>
    </div>
  );
};

export default DashboardPage;
