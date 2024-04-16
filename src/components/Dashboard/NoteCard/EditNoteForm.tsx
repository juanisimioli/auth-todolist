import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Note as NoteType } from "@prisma/client";
import { updateTask } from "@/actions/tasks/updateTask";
import ButtonsEditNoteCard from "./ButtonsEditNoteCard";

const EditNoteForm = ({
  note,
  setIsEditingNote,
  setError,
}: {
  note: NoteType;
  setIsEditingNote: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { id, title, content } = note;

  const handleActionUpdate = async (prev: unknown, formData: FormData) => {
    setError("");
    const response = await updateTask(prev, formData);
    if (response?.success) {
      setIsEditingNote(false);
    }
    return response;
  };

  const [errorUpdate, action] = useFormState(handleActionUpdate, {
    errorMessage: "",
  });

  useEffect(() => {
    if (errorUpdate?.errorMessage) setError(errorUpdate.errorMessage);
  }, [errorUpdate]);

  return (
    <form action={action} className="flex flex-row justify-between w-full">
      <div className="flex flex-col justify-center text-white min-w-30 gap-1 w-full">
        <input
          name="title"
          defaultValue={title}
          className="w-full text-black bg-yellow-400 rounded text-lg overflow-hidden whitespace-nowrap overflow-ellipsis w-95"
        />
        <input
          name="content"
          defaultValue={content || ""}
          className="w-full text-black bg-yellow-400 rounded text-sm overflow-hidden whitespace-nowrap overflow-ellipsis w-95"
        />
        <input type="hidden" name="id" defaultValue={id} />
      </div>
      <ButtonsEditNoteCard setIsEditingNote={setIsEditingNote} />
    </form>
  );
};

export default EditNoteForm;
