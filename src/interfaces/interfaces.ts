import { User, Note } from "@prisma/client";

export interface UserWithNotes extends User {
  notes: Note[];
}

export interface UserInfo extends Omit<User, "notes" | "password"> {}

export interface NoteForm {
  title: string;
  content: string;
}
