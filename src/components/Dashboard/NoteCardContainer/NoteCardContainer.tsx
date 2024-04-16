"use client";
import { useState } from "react";
import { Note } from "@prisma/client";
import NoteCard from "@/components/Dashboard/NoteCard/NoteCard";

const NoteCardContainer = ({ notes }: { notes: Note[] }) => {
  const [error, setError] = useState<string>("");

  return (
    <div className="mt-12 w-full max-w-md mb-16">
      {notes?.length > 0 ? (
        <ul>
          {notes.map((note: Note) => (
            <NoteCard key={note.id} note={note} setError={setError} />
          ))}
        </ul>
      ) : (
        <p>Empty List. Create a note.</p>
      )}
      <p>{error}</p>
    </div>
  );
};

export default NoteCardContainer;
