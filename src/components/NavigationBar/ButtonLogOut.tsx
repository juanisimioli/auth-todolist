"use client";
import { logoutAction } from "@/actions/auth/logoutAction";

const ButtonLogOut = () => {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <button
      className="px-6 h-8 rounded-md cursor-pointer font-bold transition duration-300 bg-gray-300 text-gray-900 hover:bg-yellow-400"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
};

export default ButtonLogOut;
