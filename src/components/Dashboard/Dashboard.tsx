import { Suspense } from "react";
import db from "@/libs/db";
import { userIdFromCookies } from "@/utils/auth";
import { UserWithNotes } from "@/interfaces/interfaces";
import NoteForm from "@/components/Dashboard/NoteForm/NoteForm";
import NoteCardContainer from "./NoteCardContainer/NoteCardContainer";
import Skeleton from "../Skeleton/Skeleton";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const res = await userIdFromCookies();

  if (!res.success) {
    return;
  }

  const userId = res.data as string;

  const user: UserWithNotes | null = await db.user.findUnique({
    where: { id: Number(userId) },
    include: { notes: true },
  });

  const notes = user?.notes.sort((a, b) => a.id - b.id) || [];

  return (
    <div className="mt-24 flex flex-col items-center justify-center mx-8 ">
      <h1 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-violet-500 to-green-500 bg-clip-text animate-gradient-x">
        Todo List
      </h1>
      <NoteForm />
      <Suspense fallback={<Skeleton />}>
        <NoteCardContainer notes={notes} />
      </Suspense>
    </div>
  );
};

export default Dashboard;
