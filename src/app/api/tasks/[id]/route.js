import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Task from "@/models/Task";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);

    // Allow deletion if user owns the task or is admin
    if (!user.tasks.includes(task._id) && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove task from user's tasks array
    user.tasks = user.tasks.filter((taskId) => !taskId.equals(task._id));
    await user.save();

    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, position, isCompleted } = body;

    if (text !== undefined && text.trim() === "") {
      return NextResponse.json(
        { error: "Task text cannot be empty" },
        { status: 400 }
      );
    }

    if (
      text === undefined &&
      position === undefined &&
      isCompleted === undefined
    ) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    await connectMongo();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);

    // Allow updates if user owns the task or is admin
    if (!user.tasks.includes(task._id) && !user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateFields = {};
    if (text !== undefined) updateFields.text = text;
    if (position !== undefined) updateFields.position = position;
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
