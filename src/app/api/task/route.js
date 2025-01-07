import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Task from "@/models/Task";

export async function POST(req) {
  try {
    const { text, date } = await req.json();

    if (!text || !date) {
      return NextResponse.json(
        { error: "Text and date are required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    // Format date to YYYY-MM-DD and find highest position for tasks on this date
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const tasksOnDate = await Task.find({
      userId: user._id,
      date: formattedDate,
    })
      .sort({ position: -1 })
      .limit(1);

    const position = tasksOnDate.length > 0 ? tasksOnDate[0].position + 1 : 1;

    const task = await Task.create({
      userId: user._id,
      text,
      date: formattedDate,
      position,
    });

    user.tasks.push(task._id);
    await user.save();

    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
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
    const { text, date, position, isCompleted } = await req.json();
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

    // Verify task belongs to user
    const user = await User.findById(session.user.id);
    if (!user.tasks.includes(task._id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update only provided fields
    if (text !== undefined) task.text = text;
    if (date !== undefined) task.date = date;
    if (position !== undefined) task.position = position;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    await task.save();

    return NextResponse.json(
      { message: "Task updated successfully" },
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
