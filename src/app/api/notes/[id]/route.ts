import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import db from "@/libs/db";
import { userIdFromCookies, validatePermission } from "@/utils/auth";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const note = await db.note.findFirst({
      where: { id: Number(id) },
    });

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const userId = await userIdFromCookies();

    if (typeof userId !== "number") {
      return userId;
    }

    const validationResponse = await validatePermission(userId, Number(id));

    if (!validationResponse.success) {
      return NextResponse.json(
        { message: validationResponse.message },
        { status: validationResponse.status }
      );
    }

    const deletedNote = await db.note.delete({
      where: { id: Number(id) },
    });

    if (!deletedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(deletedNote, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Note not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const userId = await userIdFromCookies();

    if (typeof userId !== "number") {
      return userId;
    }

    const validationResponse = await validatePermission(userId, Number(id));

    if (!validationResponse.success) {
      return NextResponse.json(
        { message: validationResponse.message },
        { status: validationResponse.status }
      );
    }

    const { title, content } = await request.json();

    const updatedNote = await db.note.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Note not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
