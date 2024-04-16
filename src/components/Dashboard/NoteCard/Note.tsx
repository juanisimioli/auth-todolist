import ButtonsNoteCard from "./ButtonsNoteCard";
import { Note as NoteType } from "@prisma/client";

const Note = ({
  note,
  setIsEditingNote,
  setError,
}: {
  note: NoteType;
  setIsEditingNote: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { id, title, content } = note;

  return (
    <>
      <div className="flex flex-col justify-center text-white min-w-32 gap-1">
        <h5 className="text-white text-lg overflow-hidden whitespace-nowrap overflow-ellipsis w-95">
          {title}
        </h5>
        <p className="text-gray-500 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis w-95">
          {content}
        </p>
      </div>
      <ButtonsNoteCard
        cardId={String(id)}
        setIsEditingNote={setIsEditingNote}
        setError={setError}
      />
    </>
  );
};

export default Note;
