import { NextResponse } from "next/server";
import db from "@/libs/db";
import { User, Note } from "@prisma/client";
import { userIdFromCookies } from "@/utils/auth";

interface UserWithNotes extends User {
  notes: Note[];
}

export async function GET() {
  try {
    const userId = await userIdFromCookies();

    if (typeof userId !== "number") {
      return userId;
    }

    const user: UserWithNotes | null | undefined = await db.user.findUnique({
      where: { id: Number(userId) },
      include: { notes: true },
    });

    if (!user) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    const notesFromUser = user.notes;

    return NextResponse.json(notesFromUser);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  const userId = await userIdFromCookies();

  if (typeof userId !== "number") {
    return userId;
  }

  const { title, content } = await request.json();

  try {
    const newNote = await db.note.create({
      data: {
        title,
        content,
        userId: Number(userId),
      },
    });
    return NextResponse.json(
      {
        newNote,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
