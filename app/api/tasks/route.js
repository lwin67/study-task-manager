import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/tasks  -> list tasks for logged-in user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks  -> create task
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await request.json();
    const { title, description, status, imageUrl } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: status || "pending",
        imageUrl: imageUrl || null,
        userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Error creating task" },
      { status: 500 }
    );
  }
}
