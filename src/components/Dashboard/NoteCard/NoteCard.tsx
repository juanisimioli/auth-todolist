"use client";
import { useState } from "react";
import { Note as NoteType } from "@prisma/client";
import Note from "./Note";
import EditNoteForm from "./EditNoteForm";

const NoteCard = ({
  note,
  setError,
}: {
  note: NoteType;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);

  return (
    <>
      <li
        className={`box-border border-2 px-4 py-3 max-w-md min-w-80 my-3 bg-gray-900 border-gray-900 rounded-lg flex justify-between h-70 ${
          isEditingNote ? "border-2 border-solid border-yellow-400" : ""
        }`}
      >
        {isEditingNote ? (
          <EditNoteForm
            note={note}
            setIsEditingNote={setIsEditingNote}
            setError={setError}
          />
        ) : (
          <Note
            note={note}
            setIsEditingNote={setIsEditingNote}
            setError={setError}
          />
        )}
      </li>
    </>
  );
};

export default NoteCard;
