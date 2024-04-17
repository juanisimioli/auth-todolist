import db from "@/libs/db";
import { userIdFromCookies } from "@/utils/auth";
import { UserWithNotes } from "@/interfaces/interfaces";
import ButtonLogOut from "./ButtonLogOut";

const NavigationBar = async () => {
  const res = await userIdFromCookies();

  if (!res.success) {
    return null;
  }

  const userId = res.data;

  const user: UserWithNotes | null = await db.user.findUnique({
    where: { id: Number(userId) },
    include: { notes: true },
  });

  return (
    <nav className="fixed top-0 left-0 w-full bg-black flex justify-end items-center text-white min-w-min gap-4 h-16 border-b border-gray-300 px-5">
      <p className="text-lg font-bold text-gray-400">Hi {user?.username}!</p>
      <ButtonLogOut />
    </nav>
  );
};

export default NavigationBar;
