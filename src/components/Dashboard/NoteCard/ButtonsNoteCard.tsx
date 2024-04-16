"use client";
import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { deleteTask } from "@/actions/tasks/deleteTask";

const ButtonsNoteCard = ({
  cardId,
  setIsEditingNote,
  setError,
}: {
  cardId: string;
  setIsEditingNote: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [error, action] = useFormState(deleteTask, {
    errorMessage: "",
  });

  const [pending, startTransition] = useTransition();

  const handleDeleteTask = () => {
    setError("");
    startTransition(async () => await action(cardId));
  };

  useEffect(() => {
    if (error?.errorMessage) setError(error.errorMessage);
  }, [error]);

  return (
    <div className="flex items-center gap-4 ml-5 mr-2">
      <button
        onClick={() => setIsEditingNote((prev) => !prev)}
        className="px-4 h-8 rounded-md font-bold transition duration-300 bg-blue-500 hover:bg-blue-600"
      >
        edit
      </button>
      <button
        disabled={pending}
        onClick={handleDeleteTask}
        className="disabled:bg-gray-300 px-2 h-8 rounded-md font-bold hover:bg-red-600 transition duration-300 bg-red-500 hover:bg-red-600"
      >
        x
      </button>
    </div>
  );
};

export default ButtonsNoteCard;
