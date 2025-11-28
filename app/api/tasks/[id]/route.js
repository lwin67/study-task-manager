import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function getId(params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return null;
  return id;
}

// GET /api/tasks/:id
export async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const id = getId(params);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PUT /api/tasks/:id  -> update
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(session.user.id);
    const id = getId(params);
    if (!id) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, status, imageUrl } = body;

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        status: status ?? existing.status,
        imageUrl:
          imageUrl === undefined ? existing.imageUrl : imageUrl || null,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Error updating task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(_request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(session.user.id);
    const id = getId(params);
    if (!id) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Error deleting task" },
      { status: 500 }
    );
  }
}
